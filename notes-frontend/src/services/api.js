// src/services/api.js
const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

// helper HTTP
async function http(path, opts = {}) {
  const hasBody = !!opts.body;
  const defaultHeaders = { Accept: "application/json" };
  // Se for POST/PATCH/PUT com body, garanta Content-Type JSON (a menos que já tenha)
  if (hasBody && !opts.headers?.["Content-Type"]) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE}${path}`, {
    // não enviamos credenciais/cookies -> evita CSRF em dev
    ...opts,
    headers: { ...defaultHeaders, ...(opts.headers || {}) },
  });

  const tryJson = async () => {
    try { return await res.json(); } catch { return null; }
  };

  if (!res.ok) {
    const body = await tryJson();
    const msg = body?.detail || body?.message || res.statusText || "Erro de rede";
    throw new Error(msg);
  }
  return (await tryJson()) ?? {};
}

/* ---------------- Stocks ---------------- */

export async function searchSymbols(q, limit = 10) {
  if (!q?.trim()) return { items: [] };
  return http(`/stocks/search?q=${encodeURIComponent(q)}&limit=${limit}`);
}

export async function getDetails(symbol) {
  return http(`/stocks/${encodeURIComponent(symbol)}/details`);
}

// (opcional – se não usar mais, pode remover)
export async function getHistoryEOD(symbol, params = {}) {
  const qs = new URLSearchParams(params);
  return http(`/stocks/${encodeURIComponent(symbol)}/history/eod?${qs}`);
}

/* ---------------- Watchlist ---------------- */

// Lista todos
export async function listWatchlist() {
  return http(`/watchlist/`);
}

// Cria item (aceita tanto {symbol, targetPrice} quanto {ticker, target_price})
export async function createWatchItem(payload) {
  const {
    symbol,
    ticker,
    targetPrice,
    target_price,
    target,         // se vier com esse nome
    notes,
    direction = "above",
    is_active = true,
  } = payload || {};

  const body = {
    // back mapeia symbol -> ticker
    symbol: symbol ?? ticker,
    // back mapeia targetPrice/target -> target_price
    targetPrice: targetPrice ?? target_price ?? target,
    notes,
    direction,
    is_active,
  };

  return http(`/watchlist/`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Atualiza parcialmente (PATCH)
export async function updateWatchItem(id, payload) {
  const {
    symbol,
    ticker,
    targetPrice,
    target_price,
    target,
    notes,
    direction,
    is_active,
  } = payload || {};

  const body = {};
  if (symbol ?? ticker) body.symbol = symbol ?? ticker;
  if (targetPrice ?? target_price ?? target) body.targetPrice = targetPrice ?? target_price ?? target;
  if (notes !== undefined) body.notes = notes;
  if (direction) body.direction = direction;
  if (typeof is_active === "boolean") body.is_active = is_active;

  return http(`/watchlist/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

// Exclui item
export async function deleteWatchItem(id) {
  return http(`/watchlist/${id}/`, { method: "DELETE" });
}
