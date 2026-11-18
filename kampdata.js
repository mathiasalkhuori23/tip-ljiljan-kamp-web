async function loadMatchFeed() {
  const response = await apiFetch('/api/kampdata', {cache:'no-store'});
  if (!response.ok) throw new Error('Kampdata kan ikke hentes lige nu.');
  return response.json();
}
