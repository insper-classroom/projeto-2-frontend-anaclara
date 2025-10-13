const BASE = import.meta.env.VITE_API_BASE_URL;

export const api = {
  search: (q) => fetch(`${BASE}/api/external/search?q=${encodeURIComponent(q)}`).then(r=>r.json()),
  quote:  (s) => fetch(`${BASE}/api/external/quote/${encodeURIComponent(s)}`).then(r=>r.json()),
  listWatch: () => fetch(`${BASE}/api/watchlist/`).then(r=>r.json()),
  addWatch: (body) => fetch(`${BASE}/api/watchlist/`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}).then(r=>r.json()),
  patchWatch: (id, body) => fetch(`${BASE}/api/watchlist/${id}/`, {method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}).then(r=>r.json()),
  delWatch: (id) => fetch(`${BASE}/api/watchlist/${id}/`, {method:"DELETE"}),
};
