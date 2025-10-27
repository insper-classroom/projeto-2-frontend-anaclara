import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { listWatchlist, deleteWatchItem, getDetails } from "../services/api.js";

// helper: bateu meta com base na direção
function hitTarget(price, target, direction) {
  if (price == null || target == null) return false;
  const p = Number(price);
  const t = Number(target);
  if (Number.isNaN(p) || Number.isNaN(t)) return false;

  const dir = (direction || "above").toLowerCase();
  if (dir === "above") return p >= t; // alerta quando subir até/ultrapassar a meta
  if (dir === "below") return p <= t; // alerta quando cair até/abaixo da meta

  // fallback (se vier algum valor inesperado):
  return t >= p ? p >= t : p <= t;
}

export default function Watchlist() {
  const [items, setItems] = useState([]);
  const [quotes, setQuotes] = useState({}); // { [symbol]: { price, change_pct } }
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const data = await listWatchlist();
        if (cancel) return;
        const rows = Array.isArray(data) ? data : [];
        setItems(rows);

        // Buscar preços/variação em paralelo (uma por símbolo)
        const results = await Promise.allSettled(
          rows.map(async (it) => {
            const symbol = it.ticker || it.symbol;
            const d = await getDetails(symbol);
            return [symbol, { price: d?.price ?? null, change_pct: d?.change_pct ?? null }];
          })
        );
        if (cancel) return;

        const map = {};
        for (const r of results) {
          if (r.status === "fulfilled") {
            const [sym, val] = r.value;
            map[sym] = val;
          }
        }
        setQuotes(map);
      } catch (e) {
        if (!cancel) setErr(e.message || "Falha ao carregar a watchlist.");
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    load();
    return () => {
      cancel = true;
    };
  }, []);

  // receber o item inteiro, e deletar por id OU por ticker (fallback)
  async function remove(item) {
    const symbol = item.ticker || item.symbol;
    const id = item.id;

    if (!confirm(`Excluir ${symbol}?`)) return;
    try {
      await deleteWatchItem({ id, symbol });
      // Atualiza estado removendo por id quando houver, senão por ticker
      setItems((prev) =>
        prev.filter((i) => {
          const sameId = (id != null) && i.id === id;
          const sameTicker = (i.ticker || i.symbol) === symbol;
          // remove o que corresponde ao id; se não tem id, remove pelo ticker
          return id != null ? !sameId : !sameTicker;
        })
      );
    } catch (e) {
      alert(`Falha ao excluir: ${e.message}`);
    }
  }

  function openEdit(item) {
    const symbol = item.ticker || item.symbol;
    navigate(`/editar/${symbol}`, { state: { from: "watchlist", id: item.id, item } });
  }

  return (
    <div className="page-wrapper">
      <section className="page">
        <h2 className="title">Watchlist</h2>

        {loading && <p className="muted">Carregando…</p>}
        {err && <p className="muted" style={{ color: "#b91c1c" }}>{err}</p>}

        <table className="watchlist-table">
          <thead>
            <tr>
              <th>Símbolo</th>
              <th>Preço Atual</th>
              <th>Variação</th>
              <th>Meta</th>
              <th>Notas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const symbol = item.ticker || item.symbol;
              const q = quotes[symbol] || {};
              const price = typeof q.price === "number" ? q.price : null;
              const changePct = typeof q.change_pct === "number" ? q.change_pct : null;

              const hit = hitTarget(price, item.target_price, item.direction);

              return (
                <tr key={item.id ?? symbol} className={hit ? "hit" : ""}>
                  <td className="symbol">{symbol}</td>

                  <td className="price">
                    {price != null ? `R$ ${price.toFixed(2)}` : "—"}
                  </td>

                  <td className={`var ${changePct == null ? "" : changePct >= 0 ? "positive" : "negative"}`}>
                    {changePct != null ? `${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%` : "—"}
                  </td>

                  <td>
                    {item.target_price != null ? `R$ ${Number(item.target_price).toFixed(2)}` : "—"}
                  </td>

                  <td>{item.notes || "—"}</td>

                  <td className="row-actions">
                    <Link className="btn btn-secondary" to={`/detalhe/${symbol}`}>Detalhes</Link>
                    <button className="btn" onClick={() => openEdit(item)}>Editar</button>

                    <button className="btn danger" onClick={() => remove(item)}>Excluir</button>
                  </td>
                </tr>
              );
            })}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="muted">Nenhum item na watchlist.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <footer className="page-actions">
        <div className="left"><Link className="btn btn-secondary" to="/">Voltar</Link></div>
        <div className="right" />
      </footer>
    </div>
  );
}
