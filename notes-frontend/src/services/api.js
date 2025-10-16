// src/services/api.js
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

async function http(path, opts) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Accept": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body.detail || res.statusText || "Erro de rede";
    throw new Error(msg);
  }
  return res.json();
}

export async function searchSymbols(q, limit = 10) {
  if (!q?.trim()) return { items: [] };
  return http(`/stocks/search?q=${encodeURIComponent(q)}&limit=${limit}`);
}

export async function getDetails(symbol) {
  return http(`/stocks/${encodeURIComponent(symbol)}/details`);
}

export async function getHistoryEOD(symbol, params = {}) {
  const qs = new URLSearchParams(params);
  return http(`/stocks/${encodeURIComponent(symbol)}/history/eod?${qs}`);
}

// (se for integrar watchlist via backend depois, colocamos aqui também)
