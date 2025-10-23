// api.js
const BASE = (import.meta.env.VITE_API_BASE || "https://projeto-2-backend-anaclara.onrender.com").replace(/\/+$/, "");
const API_PREFIX = (import.meta.env.VITE_API_PREFIX || "/api").replace(/^\/?/, "/").replace(/\/+$/, "");

function buildUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${API_PREFIX}${p}`;
}

async function http(path, opts) {
  const res = await fetch(buildUrl(path), {
    headers: { Accept: "application/json", ...(opts?.headers || {}) },
    ...opts,
  });

  if (!res.ok) {
    let msg = res.statusText || "Erro de rede";
    try {
      // tenta JSON
      const body = await res.clone().json();
      msg =
        body?.detail ??
        Object.values(body || {})?.[0]?.[0] ??
        JSON.stringify(body);
    } catch {
      try {
        // fallback para texto/HTML
        const txt = await res.text();
        if (txt) msg = msg === "OK" ? txt : msg; // preserva statusText quando fizer sentido
      } catch {}
    }
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

export async function listWatchlist() {
  return http(`/watchlist/`);
}

export async function createWatchItem({ symbol, targetPrice, target, notes, direction }) {
  const payload = {
    ticker: symbol,
    target_price: Number(targetPrice ?? target),
    notes: notes ?? "",
    direction: direction || "above",
  };
  return http(`/watchlist/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateWatchItem(id, { symbol, targetPrice, target, notes, direction }) {
  const payload = {};
  if (symbol) payload.ticker = symbol;
  if (targetPrice != null || target != null) payload.target_price = Number(targetPrice ?? target);
  if (notes != null) payload.notes = notes;
  if (direction) payload.direction = direction;

  return http(`/watchlist/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteWatchItem({ id, symbol }) {
  if (id != null) {
    return http(`/watchlist/${id}/`, { method: "DELETE" });
  }
  if (symbol) {
    return http(`/watchlist/by-ticker?ticker=${encodeURIComponent(symbol)}`, { method: "DELETE" });
  }
  throw new Error("Faltou id ou symbol para excluir");
}
