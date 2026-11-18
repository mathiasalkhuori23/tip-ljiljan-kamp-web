const key = 'ljiljan-tip-demo-v2';
const el = id => document.getElementById(id);
function isBye(match) {
  return /^oversidder$/i.test(match?.opponent?.trim() ?? '');
}
function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved) return saved;
    const old = JSON.parse(localStorage.getItem('ljiljan-tip-demo-v1'));
    if (old?.tip) return {tips:{141423:{...old.tip, finished:old.finished}}, season:{}};
  } catch {}
  return {tips:{}, season:{}};
}
function persist(state) {
  try { localStorage.setItem(key, JSON.stringify(state)); return true; }
  catch { return false; }
}
function rank(score, result) {
  if (score[0] === result[0] && score[1] === result[1]) return 3;
  return Math.sign(score[0] - score[1]) === Math.sign(result[0] - result[1]) ? 1 : 0;
}
function normalizePlayer(name) {
  const normalized = (name ?? '').trim().replace(/\s+/g, ' ')
    .toLocaleLowerCase('da').normalize('NFD').replace(/\p{Mark}/gu, '');
  return Object.hasOwn(playerAliases, normalized) ? playerAliases[normalized] : normalized;
}
function eligiblePlayers(match) {
  if (!match.squad?.length) return playerSuggestions;
  const squad = new Set(match.squad.map(normalizePlayer));
  return playerSuggestions.filter(name => squad.has(normalizePlayer(name)));
}
function squadPlayer(match, name) {
  const normalized = normalizePlayer(name);
  return eligiblePlayers(match).find(player => normalizePlayer(player) === normalized) ?? '';
}
function playerNames(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}
function playerPoints(tip, match) {
  const events = match;
  return ['scorer', 'assist'].reduce((points, role) => {
    const picks = playerNames(tip[role]);
    const normalizedPicks = new Set(picks.map(normalizePlayer));
    const correct = new Set(playerNames(events[role]).map(normalizePlayer));
    return points + [...correct].filter(name => normalizedPicks.has(name)).length;
  }, 0);
}
function tipPoints(tip, match) {
  return rank(tip.score, match.result) + playerPoints(tip, match);
}
