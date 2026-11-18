async function setupMatchReminders() {
  if (!backend) return;
  const panel = el('matchReminders');
  const toggle = el('reminderToggle');
  const status = el('reminderStatus');
  const description = status.textContent;
  const marker = 'ljiljan:reminders:' + backend.url;
  panel.hidden = false;

  const isAppleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  if (isAppleMobile && !window.matchMedia('(display-mode: standalone)').matches && !navigator.standalone) {
    toggle.hidden = true;
    status.textContent = 'På iPhone og iPad skal du tilføje appen til hjemmeskærmen og åbne den derfra for at slå påmindelser til.';
    return;
  }
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    toggle.hidden = true;
    status.textContent = 'Denne browser understøtter ikke kamppåmindelser.';
    return;
  }

  let registration;
  let publicKey;
  let subscription;
  let enabled;
  function showStatus(message = description) {
    toggle.textContent = enabled ? 'Slå kamppåmindelser fra' : 'Slå kamppåmindelser til';
    status.textContent = message;
    toggle.disabled = !enabled && Notification.permission === 'denied';
  }

  try {
    await navigator.serviceWorker.register('reminder-sw.js');
    registration = await navigator.serviceWorker.ready;
    subscription = await registration.pushManager.getSubscription();
    enabled = Boolean(subscription && localStorage.getItem(marker) === subscription.endpoint);
    if (!enabled && Notification.permission !== 'denied') ({publicKey} = await competitionRequest('reminders'));
    showStatus(Notification.permission === 'denied'
      ? 'Notifikationer er blokeret. Du kan ændre tilladelsen i browserens indstillinger.'
      : description);
  } catch {
    status.textContent = 'Kamppåmindelser kunne ikke indlæses. Prøv at genindlæse siden.';
    return;
  }

  toggle.addEventListener('click', async () => {
    toggle.disabled = true;
    try {
      if (enabled) {
        const current = subscription;
        await current.unsubscribe();
        localStorage.removeItem(marker);
        enabled = false;
        subscription = null;
        try { await competitionRequest('reminders', {enabled: false, subscription: current.toJSON()}); }
        catch { /* The push service already removed this subscription. */ }
        showStatus('Kamppåmindelser er slået fra på denne enhed.');
        return;
      }

      const name = competitionName || el('alias').value.trim();
      if (!name) {
        showStatus('Skriv dit kaldenavn ved kamptippet for at slå påmindelser til.');
        el('alias').focus();
        return;
      }
      if (!publicKey) ({publicKey} = await competitionRequest('reminders'));
      subscription ??= await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: Uint8Array.from(atob(publicKey.replace(/-/g, '+').replace(/_/g, '/') + '='),
          character => character.charCodeAt(0))
      });
      const profile = await ensureCompetitionProfile(name);
      competitionName = profile.name;
      await competitionRequest('reminders', {enabled: true, subscription: subscription.toJSON()});
      localStorage.setItem(marker, subscription.endpoint);
      enabled = true;
      showStatus('Påmindelser er slået til på denne enhed. Du får besked 30 minutter før kampstart, hvis du mangler at tippe.');
    } catch {
      showStatus(Notification.permission === 'denied'
        ? 'Notifikationer er blokeret. Du kan ændre tilladelsen i browserens indstillinger.'
        : 'Kamppåmindelser kunne ikke ændres. Prøv igen.');
    }
  });
}

setupMatchReminders();
