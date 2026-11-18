const backend = window.LJILJAN_BACKEND;
const sessionHeader = 'X-Ljiljan-Session';
const sessionKey = backend && 'ljiljan:session:' + backend.url;

async function apiFetch(path, options = {}) {
  if (!backend) return fetch(path, options);

  const headers = new Headers(options.headers);
  headers.set('apikey', backend.key);
  if (path.startsWith('/api/competition/')) {
    const token = localStorage.getItem(sessionKey);
    if (token) headers.set(sessionHeader, token);
  }
  const response = await fetch(backend.url + '/functions/v1/ljiljan' + path, {...options, headers});
  const token = response.headers.get(sessionHeader);
  if (response.ok && token) localStorage.setItem(sessionKey, token);
  return response;
}
