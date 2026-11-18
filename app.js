const clubName = 'F.K. Ljiljan';
let selected = fixtures[0];
let matchDataReady = false;
let archive = pastFixtures;
let schedule = fixtures;
let state = readState();
let savingTip = false;
let savingAlias = false;
let competitionName = '';
let requestedMatch = new URLSearchParams(location.search).get('kamp');
const previewDate = new Intl.DateTimeFormat('da-DK', {dateStyle:'medium', timeZone:'Europe/Copenhagen'});

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
    const bye = isBye(match);
    const row = document.createElement('li');
    row.className = 'fixture';
    const text = document.createElement('div');
    text.textContent = teams(match).join(' – ');
    const info = document.createElement('small');
    info.textContent = (bye ? previewDate.format(matchTime(match)) : dateLabel(match)) + ' · ' + match.competition +
      (tip && !bye ? ' · Dit tip ' + tip.score.join('–') : '');
    text.append(info);
    const button = document.createElement('button');
    button.className = 'secondary';
    button.textContent = bye ? 'Se runde'
      : matchTime(match) <= Date.now() || match.result || match.cancelled ? 'Se kamp' : tip ? 'Se tip' : 'Tip kamp';
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
function opponentKey(name) {
  return name.toLowerCase().trim()
    .replace(/\s*\((?:s[1-6][a-z]?|[1-9])\)$/, '')
    .replaceAll('aa', 'å').normalize('NFD').replace(/[\p{Mark}\p{Punctuation}\s]/gu, '');
}
function renderPreviewList(id, matches) {
  el(id + 'Empty').hidden = matches.length > 0;
  el(id).replaceChildren(...matches.map(match => {
    const row = document.createElement('li');
    row.className = 'preview-result';
    const matchup = document.createElement('span');
    matchup.textContent = match.home + ' – ' + match.away;
    const detail = document.createElement('small');
    detail.textContent = previewDate.format(match.playedAt) + ' · ' + match.competition;
    matchup.append(detail);
    const score = document.createElement('span');
    score.className = 'preview-score';
    score.textContent = match.score;
    row.append(matchup, score);
    return row;
  }));
}
function renderMatchPreview() {
  const cutoff = Math.min(Date.now(), matchTime(selected));
  const opponent = opponentKey(selected.opponent);
  const history = archive.map(match => ({
    ...match,
    playedAt: match.source?.kickoff ?? Date.parse(match.day.split('.').reverse().join('-') + 'T12:00:00+01:00')
  })).filter(match => match.id !== selected.id && match.playedAt < cutoff)
    .sort((first, second) => second.playedAt - first.playedAt);
  renderPreviewList('recentResults', history.filter(match => /^\d+[–-]\d+$/.test(match.score)).slice(0, 5));
  const section = el('opponentHistorySection');
  section.hidden = isBye(selected);
  if (section.hidden) return;

  const previousMeetings = history.filter(match =>
    opponentKey(match.source?.opponent ?? (match.home === clubName ? match.away : match.home)) === opponent
  );
  el('opponentHistoryTitle').textContent = 'Tidligere opgør mod ' + selected.opponent;
  renderPreviewList('opponentHistory', previousMeetings);
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
  const alias = el('alias');
  if (alias.value === alias.defaultValue) {
    alias.value = alias.defaultValue = competitionName || tip?.name || state.alias || '';
  }
  el('feedback').textContent = tip ? 'Dit gemte tip: ' + tip.score.join('–') + '.' : '';
}
function render() {
  const tip = state.tips[selected.id];
  const bye = isBye(selected);
  const locked = bye || savingTip || !matchDataReady || selected.cancelled || Boolean(selected.result) || Date.now() >= matchTime(selected);
  const [home,away] = teams(selected);
  el('competition').textContent = selected.competition;
  el('competition').classList.toggle('winter-competition', /^vinterbold$/i.test(selected.competition));
  if (el('match').dataset.matchId !== selected.id) {
    renderMatchup(el('match'), [home, away], selected.id, false, selected);
    el('match').dataset.matchId = selected.id;
  }
  el('matchDate').textContent = bye ? previewDate.format(matchTime(selected)) : dateLabel(selected);
  el('homeLabel').textContent = home;
  el('awayLabel').textContent = away;
  for (const id of ['home','away']) el(id).disabled = locked;
  el('save').disabled = locked || savingAlias;
  el('guess').hidden = bye;
  el('feedback').hidden = bye;
  el('alias').disabled = savingTip || savingAlias || (!competitionName && locked);
  const hasSquad = Boolean(selected.squad?.length);
  el('playerTips').disabled = locked;
  el('squadStatus').textContent = hasSquad
    ? 'Vælg blandt de udtagne Ljiljan-spillere.'
    : 'Vælg blandt Ljiljans spillere.';
  el('save').textContent = savingTip ? 'Gemmer…' : !matchDataReady ? 'Afventer kampdata' : locked ? 'Tip lukket' : tip ? 'Opdater mit tip' : 'Gem mit tip';
  el('result').hidden = !bye && !selected.result && !selected.cancelled;
  el('result').classList.toggle('bye-notice', bye);
  if (bye) {
    el('result').textContent = 'Ljiljan sidder over i denne runde. Der spilles ingen kamp.';
  } else if (selected.cancelled) {
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
  renderMatchPreview();
}
for (const role of ['scorer', 'assist']) {
  el(role).addEventListener('change', () => updatePlayerCount(role));
}

async function updateAlias(name) {
  const profile = competitionName
    ? await competitionRequest('profile/name', {name})
    : await ensureCompetitionProfile(name);
  competitionName = profile.name;
  const field = el('alias');
  field.value = field.defaultValue = competitionName;
  state.alias = competitionName;
  persist(state);
}

async function saveAlias() {
  if (!competitionName || savingTip || savingAlias) return;
  const field = el('alias');
  const status = el('aliasStatus');
  const name = field.value.trim();
  if (name === competitionName) return;
  if (!name) {
    status.textContent = 'Skriv dit kaldenavn.';
    field.focus();
    return;
  }
  savingAlias = true;
  status.textContent = '';
  render();
  try {
    await updateAlias(name);
    status.textContent = 'Dit kaldenavn er opdateret.';
  } catch (error) {
    status.textContent = error.message;
  } finally {
    savingAlias = false;
    render();
    field.focus();
  }
}

el('alias').addEventListener('input', () => {
  el('aliasStatus').textContent = '';
});
el('alias').addEventListener('keydown', event => {
  if (event.key === 'Enter' && competitionName && !event.isComposing) {
    event.preventDefault();
    saveAlias();
  }
});
el('guess').addEventListener('submit', async event => {
  event.preventDefault();
  if (savingTip || savingAlias || !matchDataReady || isBye(selected) || selected.cancelled || selected.result || Date.now() >= matchTime(selected)) return;
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
    if (name !== competitionName) {
      const renaming = Boolean(competitionName);
      await updateAlias(name);
      if (renaming) el('aliasStatus').textContent = 'Dit kaldenavn er opdateret.';
    }
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
  const loadedName = competitionName;
  try {
    const profile = await competitionRequest('profile');
    if (!savingTip && !savingAlias && competitionName === loadedName) {
      competitionName = profile.name;
      if (profile.name) state.alias = profile.name;
    }
    Object.assign(state.tips, profile.tips);
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
    const knownIds = new Set(matches.map(match => match.id));
    archive = [
      ...matches.filter(match => match.result || (match.kickoff < now && (match.resultStatus || match.cancelled)))
        .reverse().map(match => ({id:match.id, competition:match.competition, home:match.homeName,
          away:match.awayName, day:dateLabel(match), score:match.result?.join('–') ?? match.resultStatus ?? 'Aflyst', source:match})),
      ...pastFixtures.filter(match => !knownIds.has(match.id))
    ];
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
    loadCompetitionProfile();
    refreshMatches();
  }
});
setInterval(refreshMatches, 60000);
setInterval(() => { if (!el('save').disabled && Date.now() >= matchTime(selected)) render(); }, 1000);
