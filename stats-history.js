const historyDialog = document.getElementById('playerHistory');
const historyColumns = document.getElementById('historyColumns');
const historyRows = document.getElementById('historyRows');
const historiesByName = new Map(playerHistories.map(player => [player.name, player]));

function historyRow(cells, header = false) {
  const row = document.createElement('tr');
  if (!header && cells[0] === 'I alt') row.className = 'history-total';
  cells.forEach((value, index) => {
    const cell = document.createElement(header || index === 0 ? 'th' : 'td');
    if (header || index === 0) cell.scope = header ? 'col' : 'row';
    cell.textContent = value;
    row.append(cell);
  });
  return row;
}

for (const button of document.querySelectorAll('.history-player')) {
  const name = button.textContent.trim();
  button.addEventListener('click', () => {
    const player = historiesByName.get(name);
    const portraitSlot = document.getElementById('historyPortrait');
    const portrait = document.createElement('img');
    portrait.hidden = true;
    portrait.className = 'stats-portrait';
    portrait.alt = '';
    portrait.width = 56;
    portrait.height = 56;
    portrait.addEventListener('load', () => { portrait.hidden = false; }, {once: true});
    portrait.addEventListener('error', () => portrait.remove(), {once: true});
    portraitSlot.replaceChildren(portrait);
    const key = name.toLowerCase().normalize('NFKD').replaceAll('đ', 'd').replace(/[^a-z0-9]/g, '');
    apiFetch('/api/player-portraits').then(response => response.ok ? response.json() : {})
      .then(photos => {
        if (portrait.isConnected && Object.hasOwn(photos, key)) portrait.src = photos[key];
        else portrait.remove();
      }).catch(() => portrait.remove());
    document.getElementById('historyPlayerName').textContent = name;
    document.getElementById('historySource').href = player.url;
    const empty = document.getElementById('historyEmpty');
    const hasHistory = Boolean(player.rows?.length);
    empty.hidden = hasHistory;
    empty.textContent = player.rows === null
      ? 'Sæsonhistorikken kunne ikke læses. Se spillerens profil.'
      : 'Klubben har ingen sæsontal på denne spillerprofil endnu.';
    document.getElementById('historyScroll').hidden = !hasHistory;
    historyColumns.replaceChildren(...(hasHistory ? [historyRow(player.rows[0], true)] : []));
    historyRows.replaceChildren(...(hasHistory ? player.rows.slice(1).map(cells => historyRow(cells)) : []));
    historyDialog.showModal();
  });
}
