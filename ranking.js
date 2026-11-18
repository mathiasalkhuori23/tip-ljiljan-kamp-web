const el = id => document.getElementById(id);
function showRanking(entries, scoringAvailable) {
  const rows = el('rows');
  rows.replaceChildren();
  let place = 1;
  entries.forEach((entry, index) => {
    if (index && entry.points !== entries[index - 1].points) place = index + 1;
    const row = rows.insertRow();
    if (entry.mine) row.className = 'mine';
    for (const value of [
      scoringAvailable ? place : '–',
      entry.name + (entry.mine ? ' (dig)' : ''),
      scoringAvailable ? entry.points : '–'
    ]) row.insertCell().textContent = value;
  });
}

async function renderRanking() {
  try {
    const data = await competitionRequest('standings');
    showRanking(data.entries, data.scoringAvailable);
    el('rankingStatus').textContent = !data.scoringAvailable ? 'Klubbens resultater er midlertidigt utilgængelige.'
      : data.local ? 'Lokal konkurrence. Point beregnes ud fra de tilgængelige kampresultater.' : '';
  } catch (error) {
    el('rows').replaceChildren();
    el('rankingStatus').textContent = error.message;
  }
}

renderRanking();
setInterval(renderRanking, 60000);
window.addEventListener('pageshow', event => {
  if (event.persisted) renderRanking();
});
