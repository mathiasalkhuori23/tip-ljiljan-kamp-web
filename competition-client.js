async function competitionRequest(path, data) {
  const response = await apiFetch('/api/competition/' + path, data === undefined
    ? {cache: 'no-store'}
    : {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Konkurrencen er midlertidigt utilgængelig.');
  return result;
}

let profileRequest;
function ensureCompetitionProfile(name) {
  if (!profileRequest) {
    profileRequest = competitionRequest('profile', {name}).finally(() => { profileRequest = undefined; });
  }
  return profileRequest;
}
