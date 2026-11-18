const clubName = 'F.K. Ljiljan';
function matchTime(match) {
  return match.kickoff ?? Date.parse(match.date + '+01:00');
}
function teams(match) {
  return match.home ? [clubName, match.opponent] : [match.opponent, clubName];
}
let knownMatches = [];
let state = readState();
let requestedTip = /^#tip-[0-9]+$/.test(location.hash) ? location.hash.slice(1) : '';

function renderSeasonTips() {
  const entries = [['serie3', 'Serie 3'], ['serie5', 'Serie 5']].flatMap(([team, label]) => {
    const place = state.season?.[team];
    if (!Number.isInteger(place) || place < 1 || place > 12) return [];
    const item = document.createElement('li');
    const title = document.createElement('strong');
    title.textContent = label;
    const prediction = document.createElement('div');
    prediction.textContent = 'Dit tip: ' + place + '. plads';
    item.append(title, prediction);
    return [item];
  });
  el('mySeasonTipsEmpty').hidden = entries.length > 0;
  el('mySeasonTipsList').replaceChildren(...entries);
}

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
    item.id = 'tip-' + id;
    item.tabIndex = -1;
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
  state = readState();
  const [profile, feed] = await Promise.allSettled([
    competitionRequest('profile'), loadMatchFeed()
  ]);
  if (profile.status === 'fulfilled') Object.assign(state.tips, profile.value.tips);
  if (feed.status === 'fulfilled') knownMatches = feed.value.matches;
  el('myTipsStatus').hidden = profile.status === 'fulfilled' && feed.status === 'fulfilled';
  renderMyTips();
  renderSeasonTips();
  const target = requestedTip && el(requestedTip);
  if (target) {
    requestedTip = '';
    target.focus();
    target.scrollIntoView({block: 'center'});
  }
}

renderMyTips();
renderSeasonTips();
refreshMyTips();
window.addEventListener('pageshow', event => {
  if (event.persisted) refreshMyTips();
});
setInterval(refreshMyTips, 60000);
