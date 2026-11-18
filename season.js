for (let i = 1; i <= 12; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = i + '. plads';
  el('place').append(option);
}
function showSeasonTip() {
  const state = readState();
  const saved = state.season[el('seasonTeam').value];
  el('place').value = saved ?? '';
  el('seasonFeedback').textContent = saved ? 'Dit gemte tip: ' + saved + '. plads.' : '';
}
el('seasonTeam').addEventListener('change', showSeasonTip);
el('seasonGuess').addEventListener('submit', event => {
  event.preventDefault();
  const place = Number(el('place').value);
  if (!Number.isInteger(place) || place < 1 || place > 12) return;
  const state = readState();
  state.season[el('seasonTeam').value] = place;
  el('seasonFeedback').textContent = (persist(state) ? 'Dit tip er gemt: ' : 'Dit tip for denne session: ') + place + '. plads.';
});
showSeasonTip();
window.addEventListener('pageshow', event => {
  if (event.persisted) showSeasonTip();
});
