async function setupMatchReminders() {
  if (!backend) return;
  const panel = el('matchReminders');
  const status = el('reminderStatus');
  const controls = [
    {kind: 'before', button: el('reminderToggle'), label: 'kamppåmindelser'},
    {kind: 'after', button: el('resultReminderToggle'), label: 'pointbeskeder'}
  ];
  panel.hidden = false;

  function setMessage(message) {
    status.textContent = message;
    status.hidden = !message;
  }

  const isAppleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  if (isAppleMobile && !window.matchMedia('(display-mode: standalone)').matches && !navigator.standalone) {
    el('reminderOptions').hidden = true;
    setMessage('På iPhone og iPad skal du tilføje appen til hjemmeskærmen og åbne den derfra for at slå beskeder til.');
    return;
  }
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    el('reminderOptions').hidden = true;
    setMessage('Denne browser understøtter ikke kampbeskeder.');
    return;
  }

  let registration;
  let publicKey;
  let subscription;
  let saving = false;
  let preferences = {before: false, after: false};
  const blocked = 'Notifikationer er blokeret. Du kan ændre tilladelsen i browserens indstillinger.';

  function renderControls() {
    for (const {kind, button, label} of controls) {
      button.textContent = 'Slå ' + label + (preferences[kind] ? ' fra' : ' til');
      button.disabled = saving || (!preferences[kind] && Notification.permission === 'denied');
    }
  }

  try {
    await navigator.serviceWorker.register('reminder-sw.js');
    registration = await navigator.serviceWorker.ready;
    subscription = await registration.pushManager.getSubscription();
    const [config, saved] = await Promise.all([
      competitionRequest('reminders'),
      subscription && competitionRequest('reminders', {action: 'status', subscription: subscription.toJSON()})
    ]);
    publicKey = config.publicKey;
    if (saved) preferences = saved;
    if (Notification.permission === 'denied') setMessage(blocked);
    renderControls();
  } catch {
    setMessage('Kampbeskeder kunne ikke indlæses. Prøv at genindlæse siden.');
    return;
  }

  for (const {kind, button, label} of controls) {
    button.addEventListener('click', async () => {
      if (saving) return;
      const enabled = !preferences[kind];
      const name = competitionName || el('alias').value.trim();
      if (enabled && !name) {
        setMessage('Skriv dit kaldenavn ved kamptippet for at slå beskeder til.');
        el('alias').focus();
        return;
      }

      saving = true;
      setMessage('');
      renderControls();
      try {
        if (enabled) {
          subscription ??= await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: Uint8Array.from(atob(publicKey.replace(/-/g, '+').replace(/_/g, '/') + '='),
              character => character.charCodeAt(0))
          });
          const profile = await ensureCompetitionProfile(name);
          competitionName = profile.name;
        }
        preferences = await competitionRequest('reminders', {kind, enabled, subscription: subscription.toJSON()});
        if (!preferences.before && !preferences.after) {
          await subscription.unsubscribe().catch(() => {});
          subscription = null;
        }
        setMessage(label[0].toUpperCase() + label.slice(1) + (enabled ? ' er slået til.' : ' er slået fra.'));
      } catch (error) {
        setMessage(Notification.permission === 'denied' ? blocked :
          error.message || 'Kampbeskeder kunne ikke ændres. Prøv igen.');
      } finally {
        saving = false;
        renderControls();
      }
    });
  }
}

setupMatchReminders();
