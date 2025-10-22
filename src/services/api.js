const RAW_BASE =
  import.meta.env.VITE_API_BASE ??
  "https://projeto-2-backend-anaclara.onrender.com/api";
const BASE = RAW_BASE.replace(/\/$/, ""); // remove barra no fim

async function http(path, opts) {
  const url = `${BASE}${path}`; // path sempre começa com "/"
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", ...(opts?.headers || {}) },
      ...opts,
    });

    if (!res.ok) {
      let msg = res.statusText || "Erro de rede";
      try {
        const body = await res.json();
        msg =
          body?.detail ||
          Object.values(body || {})?.[0]?.[0] ||
          JSON.stringify(body);
      } catch {
        // se não der para ler JSON, mantém a msg padrão
      }
      throw new Error(msg);
    }

    return res.json();
  } catch (err) {
    // Quando é CORS/mixed content/offline, cai aqui e o browser mostra "Failed to fetch"
    console.error("HTTP falhou", { url, err });
    throw new Error(`Failed to fetch (${url})`);
  }
}

// ---- Stocks ----
export async function searchSymbols(q, limit = 10) {
  if (!q?.trim()) return { items: [] };
  const qs = new URLSearchParams({ q, limit: String(limit) }).toString();
  return http(`/stocks/search?${qs}`);
}

export async function getDetails(symbol) {
  return http(`/stocks/${encodeURIComponent(symbol)}/details`);
}

export async function getHistoryEOD(symbol, params = {}) {
  const qs = new URLSearchParams(params).toString();
  return http(`/stocks/${encodeURIComponent(symbol)}/history/eod?${qs}`);
}

// ---- Watchlist ----
export async function listWatchlist() {
  return http(`/watchlist/`);
}

export async function createWatchItem({ symbol, targetPrice, target, notes }) {
  // sem "direction"
  const payload = {
    ticker: symbol,
    target_price: Number(targetPrice ?? target),
    notes: notes ?? "",
  };
  return http(`/watchlist/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateWatchItem(id, { symbol, targetPrice, target, notes }) {
  const payload = {};
  if (symbol) payload.ticker = symbol;
  if (targetPrice != null || target != null)
    payload.target_price = Number(targetPrice ?? target);
  if (notes != null) payload.notes = notes;

  return http(`/watchlist/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteWatchItem(id) {
  return http(`/watchlist/${id}/`, { method: "DELETE" });
}
