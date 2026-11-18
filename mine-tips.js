const clubName = 'F.K. Ljiljan';
function matchTime(match) {
  return match.kickoff ?? Date.parse(match.date + '+01:00');
}
function teams(match) {
  return match.home ? [clubName, match.opponent] : [match.opponent, clubName];
}
let knownMatches = [];
let state = readState();
let nameVersion = 0;

function showProfileName(name) {
  el('editProfile').hidden = !name;
  const field = el('profileName');
  if (field.value === field.defaultValue) field.value = name;
  field.defaultValue = name;
}

el('editName').addEventListener('submit', async event => {
  event.preventDefault();
  const field = el('profileName');
  const button = el('saveName');
  const status = el('nameStatus');
  if (button.disabled) return;
  const name = field.value.trim();
  if (!name) {
    status.textContent = 'Skriv et kaldenavn.';
    field.focus();
    return;
  }
  nameVersion++;
  button.disabled = true;
  field.readOnly = true;
  status.textContent = '';
  try {
    const updated = await competitionRequest('profile/name', {name});
    field.value = updated.name;
    field.defaultValue = updated.name;
    const saved = readState();
    saved.alias = updated.name;
    persist(saved);
    status.textContent = 'Dit kaldenavn er opdateret.';
  } catch (error) {
    status.textContent = error.message;
  } finally {
    field.readOnly = false;
    button.disabled = false;
  }
});

function renderMyTips() {
  const matches = new Map([...fixtures, ...knownMatches].map(match => [match.id, match]));
  const entries = Object.entries(state.tips).flatMap(([id, tip]) => {
    if (!Array.isArray(tip?.score)) return [];
    const match = matches.get(id);
    const kickoff = match ? matchTime(match) : NaN;
    return [{id, match, tip, kickoff: Number.isFinite(kickoff) ? kickoff : -Infinity}];
  }).sort((first, second) => second.kickoff - first.kickoff);
  el('myTipsEmpty').hidden = entries.length > 0;
  el('myTipsList').replaceChildren(...entries.map(({id, match, tip, kickoff}) => {
    const item = document.createElement('li');
    const title = document.createElement('strong');
    title.textContent = match ? teams(match).join(' – ') : 'Kamp ' + id;
    item.append(title);
    const details = ['Dit tip: ' + tip.score.join('–')];
    for (const [role, label] of [['scorer', 'Målscorere'], ['assist', 'Assistmagere']]) {
      const players = playerNames(tip[role]);
      if (players.length) details.push(label + ': ' + players.join(', '));
    }
    if (match?.cancelled) details.push('Kampen er aflyst.');
    else if (match?.result) details.push('Slutresultat: ' + match.result.join('–') + ' · ' + tipPoints(tip, match) + ' point');
    else if (Number.isFinite(kickoff) && Date.now() >= kickoff) details.push('Afventer slutresultat');
    for (const detail of details) {
      const line = document.createElement('div');
      line.textContent = detail;
      item.append(line);
    }
    return item;
  }));
}

async function refreshMyTips() {
  const loadedNameVersion = nameVersion;
  state = readState();
  const [profile, feed] = await Promise.allSettled([
    competitionRequest('profile'), loadMatchFeed()
  ]);
  if (profile.status === 'fulfilled') {
    Object.assign(state.tips, profile.value.tips);
    if (loadedNameVersion === nameVersion && !el('saveName').disabled) showProfileName(profile.value.name);
  }
  if (feed.status === 'fulfilled') knownMatches = feed.value.matches;
  el('myTipsStatus').hidden = profile.status === 'fulfilled' && feed.status === 'fulfilled';
  renderMyTips();
}

renderMyTips();
refreshMyTips();
window.addEventListener('pageshow', event => {
  if (event.persisted) refreshMyTips();
});
setInterval(refreshMyTips, 60000);
