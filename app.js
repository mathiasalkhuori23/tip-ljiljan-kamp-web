const clubName = 'F.K. Ljiljan';
let selected = fixtures[0];
let matchDataReady = false;
let archive = pastFixtures;
let schedule = fixtures;
let state = readState();
let savingTip = false;
let competitionName = '';
let requestedMatch = new URLSearchParams(location.search).get('kamp');

function matchTime(match) {
  return match.kickoff ?? Date.parse(match.date + '+01:00');
}
function teams(match) {
  return match.home ? [clubName, match.opponent] : [match.opponent, clubName];
}
function clubBadge(name, logo, compact) {
  const badge = document.createElement('span');
  badge.className = 'club';
  if (logo) {
    const image = document.createElement('img');
    image.alt = '';
    if (compact) image.loading = 'lazy';
    image.addEventListener('error', () => { image.hidden = true; });
    image.src = logo === 'ljiljan'
      ? 'https://fkljiljan.dk/wp-content/themes/fkljiljan/assets/01%20Merkevare/crest-white.png'
      : logo.startsWith('https://') ? logo : 'https://fkljiljan.dk/wp-content/uploads/lj-logos/' + logo + '.png';
    badge.append(image);
  }
  const label = document.createElement('span');
  label.textContent = name;
  badge.append(label);
  return badge;
}
function renderMatchup(target, names, matchId, compact = false, match) {
  const logos = matchLogos[matchId] ?? (match
    ? (match.home ? ['ljiljan', match.logo] : [match.logo, 'ljiljan']) : []);
  const divider = document.createElement('span');
  divider.className = 'match-divider';
  divider.textContent = '–';
  target.replaceChildren(clubBadge(names[0], logos[0], compact), divider, clubBadge(names[1], logos[1], compact));
}
function dateLabel(match) {
  return new Intl.DateTimeFormat('da-DK', {
    dateStyle:'long', timeStyle:'short', timeZone:'Europe/Copenhagen'
  }).format(matchTime(match));
}
function renderSchedule() {
  el('upcoming').replaceChildren();
  for (const match of schedule) {
    const tip = state.tips[match.id];
    const row = document.createElement('li');
    row.className = 'fixture';
    const text = document.createElement('div');
    text.textContent = teams(match).join(' – ');
    const info = document.createElement('small');
    info.textContent = dateLabel(match) + ' · ' + match.competition +
      (tip ? ' · Dit tip ' + tip.score.join('–') : '');
    text.append(info);
    const button = document.createElement('button');
    button.className = 'secondary';
    button.textContent = matchTime(match) <= Date.now() || match.result || match.cancelled ? 'Se kamp' : tip ? 'Se tip' : 'Tip kamp';
    button.setAttribute('aria-pressed', String(match.id === selected.id));
    button.addEventListener('click', () => {
      selected = match;
      restoreForm();
      render();
      el('match').focus();
    });
    row.append(text, button);
    el('upcoming').append(row);
  }
}
function renderArchive() {
  el('archive').replaceChildren();
  el('historyTitle').textContent = 'Tidligere kampe (' + archive.length + ')';
  for (const competition of [...new Set(archive.map(match => match.competition))]) {
    const title = document.createElement('h3');
    title.textContent = competition;
    const list = document.createElement('ul');
    for (const match of archive.filter(item => item.competition === competition)) {
      const row = document.createElement('li');
      row.className = 'fixture';
      const text = document.createElement('div');
      const matchup = document.createElement('div');
      matchup.className = 'archive-matchup';
      renderMatchup(matchup, [match.home, match.away], match.id, true, match.source);
      text.append(matchup);
      const day = document.createElement('small');
      day.textContent = match.day;
      text.append(day);
      const link = document.createElement('a');
      link.href = 'https://fkljiljan.dk/kamp/?k=' + match.id;
      link.textContent = match.score;
      row.append(text, link);
      list.append(row);
    }
    el('archive').append(title, list);
  }
}
function selectedPlayers(role) {
  return [...el(role).querySelectorAll('input:checked')].map(input => input.value);
}
function updatePlayerCount(role) {
  const count = selectedPlayers(role).length;
  el(role + 'Count').textContent = count ? count + ' valgt' : '';
}
const positionsByName = new Map(Object.entries({...squadPositions, ...clubPositions})
  .map(([name, position]) => [normalizePlayer(name), position]));
function restorePlayerPicks(role, savedNames) {
  const list = el(role);
  const checked = new Set(playerNames(savedNames).map(name => squadPlayer(selected, name)));
  list.replaceChildren();
  for (const name of eligiblePlayers(selected)) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = name;
    input.checked = checked.has(name);
    const text = document.createElement('span');
    text.textContent = name;
    label.append(input, text);
    const position = positionsByName.get(normalizePlayer(name));
    if (position) {
      const detail = document.createElement('small');
      detail.className = 'player-position';
      detail.textContent = position;
      label.append(detail);
    }
    list.append(label);
  }
  updatePlayerCount(role);
}
function restoreForm() {
  const tip = state.tips[selected.id];
  el('home').value = tip?.score[0] ?? '';
  el('away').value = tip?.score[1] ?? '';
  restorePlayerPicks('scorer', tip?.scorer);
  restorePlayerPicks('assist', tip?.assist);
  el('alias').value = competitionName || tip?.name || state.alias || '';
  el('feedback').textContent = tip ? 'Dit gemte tip: ' + tip.score.join('–') + '.' : '';
}
function render() {
  const tip = state.tips[selected.id];
  const locked = savingTip || !matchDataReady || selected.cancelled || Boolean(selected.result) || Date.now() >= matchTime(selected);
  const [home,away] = teams(selected);
  el('competition').textContent = selected.competition;
  if (el('match').dataset.matchId !== selected.id) {
    renderMatchup(el('match'), [home, away], selected.id, false, selected);
    el('match').dataset.matchId = selected.id;
  }
  el('matchDate').textContent = dateLabel(selected);
  el('homeLabel').textContent = home;
  el('awayLabel').textContent = away;
  for (const id of ['home','away','alias','save']) el(id).disabled = locked;
  el('alias').disabled ||= Boolean(competitionName);
  const hasSquad = Boolean(selected.squad?.length);
  el('playerTips').disabled = locked;
  el('squadStatus').textContent = hasSquad
    ? 'Vælg blandt de udtagne Ljiljan-spillere.'
    : 'Vælg blandt Ljiljans spillere.';
  el('save').textContent = savingTip ? 'Gemmer…' : !matchDataReady ? 'Afventer kampdata' : locked ? 'Tip lukket' : tip ? 'Opdater mit tip' : 'Gem mit tip';
  el('result').hidden = !selected.result && !selected.cancelled;
  if (selected.cancelled) {
    el('result').textContent = 'Kampen er aflyst.';
  } else if (selected.result) {
    const details = [
      'Slutresultat: ' + selected.result.join('–') + '.',
      selected.scorer.length ? 'Målscorere: ' + selected.scorer.join(', ') + '.' : '',
      selected.assist.length ? 'Assistmagere: ' + selected.assist.join(', ') + '.' : '',
      selected.incompleteScorers || selected.incompleteAssists ? 'Nogle spilleroplysninger mangler hos kilden.' : '',
      tip ? 'Dit tip gav ' + tipPoints(tip, selected) + ' point ud fra de registrerede oplysninger.' : ''
    ];
    el('result').textContent = details.filter(Boolean).join(' ');
  }
  renderSchedule();
}
for (const role of ['scorer', 'assist']) {
  el(role).addEventListener('change', () => updatePlayerCount(role));
}
el('guess').addEventListener('submit', async event => {
  event.preventDefault();
  if (savingTip || !matchDataReady || selected.cancelled || selected.result || Date.now() >= matchTime(selected)) return;
  const name = el('alias').value.trim();
  if (!name) { el('feedback').textContent = 'Skriv dit kaldenavn.'; el('alias').focus(); return; }
  const match = selected;
  const payload = {
    matchId: match.id,
    score: [el('home').valueAsNumber, el('away').valueAsNumber],
    scorer: selectedPlayers('scorer'),
    assist: selectedPlayers('assist')
  };
  savingTip = true;
  render();
  try {
    const profile = await ensureCompetitionProfile(name);
    competitionName = profile.name;
    el('alias').value = competitionName;
    const {tip} = await competitionRequest('tips', payload);
    state.tips[match.id] = tip;
    state.alias = tip.name;
    persist(state);
    if (selected.id === match.id) el('feedback').textContent = 'Dit tip er gemt: ' + tip.score.join('–') + '.';
  } catch (error) {
    el('feedback').textContent = error.message;
  } finally {
    savingTip = false;
    render();
  }
});
async function loadCompetitionProfile() {
  try {
    const profile = await competitionRequest('profile');
    competitionName = profile.name;
    Object.assign(state.tips, profile.tips);
    if (profile.name) state.alias = profile.name;
    restoreForm();
    render();
  } catch {
    el('feedback').textContent = 'Konkurrencen er midlertidigt utilgængelig.';
  }
}
async function refreshMatches() {
  try {
    const {matches, local} = await loadMatchFeed();
    const now = Date.now();
    const next = matches.filter(match => (match.kickoff >= now && !match.result) || state.tips[match.id]);
    const nextSelected = (requestedMatch ? matches.find(match => match.id === requestedMatch) : undefined) ??
      next.find(match => match.id === selected.id) ??
      next.find(match => match.kickoff >= now && !match.cancelled && !match.result) ??
      matches.find(match => match.id === selected.id) ?? matches.at(-1);
    requestedMatch = null;
    const selectionChanged = selected.id !== nextSelected.id;
    const squadChanged = JSON.stringify(selected.squad ?? []) !== JSON.stringify(nextSelected.squad);
    const currentPicks = {scorer:selectedPlayers('scorer'), assist:selectedPlayers('assist')};
    selected = nextSelected;
    schedule = next;
    archive = matches.filter(match => match.result || (match.cancelled && match.kickoff < now)).reverse()
      .map(match => ({id:match.id, competition:match.competition, home:match.homeName,
        away:match.awayName, day:dateLabel(match), score:match.result?.join('–') ?? 'Aflyst', source:match}));
    matchDataReady = true;
    el('matchFeedStatus').textContent = local ? 'Serveren bruger det medfølgende kampprogram i denne lokale test.' : schedule.length ? '' : 'Der er ingen kommende kampe i klubbens program lige nu.';
    if (selectionChanged) restoreForm();
    else if (squadChanged) {
      restorePlayerPicks('scorer', currentPicks.scorer);
      restorePlayerPicks('assist', currentPicks.assist);
    }
    el('match').removeAttribute('data-match-id');
    renderArchive();
  } catch {
    matchDataReady = false;
    el('matchFeedStatus').textContent = 'Klubbens kampdata kunne ikke hentes. Siden prøver igen automatisk.';
  }
  render();
}

restoreForm();
render();
renderArchive();
loadCompetitionProfile();
refreshMatches();
window.addEventListener('pageshow', event => {
  if (event.persisted) {
    state = readState();
    restoreForm();
    refreshMatches();
  }
});
setInterval(refreshMatches, 60000);
setInterval(() => { if (!el('save').disabled && Date.now() >= matchTime(selected)) render(); }, 1000);
