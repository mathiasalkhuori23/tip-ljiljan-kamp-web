const clubName = 'F.K. Ljiljan';
function matchTime(match) {
  return match.kickoff ?? Date.parse(match.date + '+01:00');
}
function teams(match) {
  return match.home ? [clubName, match.opponent] : [match.opponent, clubName];
}
let knownMatches = fixtures;
let state = readState();

const seasonDate = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Copenhagen', year: 'numeric', month: 'numeric'
});

function competitionSeason(timestamp) {
  const parts = seasonDate.formatToParts(timestamp);
  const year = Number(parts.find(part => part.type === 'year').value);
  const month = Number(parts.find(part => part.type === 'month').value);
  if (month >= 12) return year + '-12';
  if (month >= 7) return year + '-07';
  return (year - 1) + '-12';
}

function renderMyTips() {
  const matches = new Map(knownMatches.map(match => [match.id, match]));
  const currentSeason = competitionSeason(Date.now());
  const entries = Object.entries(state.tips).flatMap(([id, tip]) => {
    const match = matches.get(id);
    if (!match || !Array.isArray(tip?.score)) return [];
    const kickoff = matchTime(match);
    if (!Number.isFinite(kickoff) || competitionSeason(kickoff) !== currentSeason) return [];
    return [{match, tip, kickoff}];
  }).sort((first, second) => second.kickoff - first.kickoff);
  el('myTipsEmpty').hidden = entries.length > 0;
  el('myTipsList').replaceChildren(...entries.map(({match, tip}) => {
    const item = document.createElement('li');
    const title = document.createElement('strong');
    title.textContent = teams(match).join(' – ');
    item.append(title);
    const details = ['Dit tip: ' + tip.score.join('–')];
    for (const [role, label] of [['scorer', 'Målscorere'], ['assist', 'Assistmagere']]) {
      const players = playerNames(tip[role]);
      if (players.length) details.push(label + ': ' + players.join(', '));
    }
    if (match?.cancelled) details.push('Kampen er aflyst.');
    else if (match?.result) details.push('Slutresultat: ' + match.result.join('–') + ' · ' + tipPoints(tip, match) + ' point');
    else if (match && Date.now() >= matchTime(match)) details.push('Afventer slutresultat');
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
}

renderMyTips();
refreshMyTips();
window.addEventListener('pageshow', event => {
  if (event.persisted) refreshMyTips();
});
setInterval(refreshMyTips, 60000);
