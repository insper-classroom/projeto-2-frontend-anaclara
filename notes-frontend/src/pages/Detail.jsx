import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import BackButton from "../components/BackButton.jsx";
import TargetModal from "../components/TargetModal.jsx";
import { getDetails, createWatchItem } from "../services/api.js";

export default function Detail() {
  const { symbol } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true); setErr("");
      try {
        const d = await getDetails(symbol);
        if (!cancelled) setData(d);
      } catch (e) {
        if (!cancelled) setErr("Cotações indisponíveis no momento.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [symbol]);

  async function handleSave({ target, notes }) {
    try {
      await createWatchItem({ symbol, targetPrice: target, notes, direction: "above" });
      setOpen(false);
      // redireciona para a watchlist após salvar
      window.location.assign("/watchlist");
    } catch (e) {
      alert(`Falha ao salvar: ${e.message}`);
    }
  }

  return (
    <div className="page-wrapper">
      <section className="page centered">
        <div className="stack-narrow">
          <h2 className="title">{symbol}</h2>

          {err && <p className="muted" style={{ color: "#b91c1c" }}>{err}</p>}

          <div className="grid-2">
            <div className="stat card">
              <div className="label">Preço atual</div>
              <div className="value">{fmtPrice(data?.price)}</div>
            </div>
            <div className="stat card">
              <div className="label">Variação</div>
              <div className="value">{fmtChange(data?.change, data?.change_pct)}</div>
            </div>
            <div className="stat card">
              <div className="label">Última atualização</div>
              <div className="value">{fmtTime(data?.as_of)}</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <button className="btn btn-primary" onClick={() => setOpen(true)} disabled={loading || !!err}>
              Adicionar
            </button>
          </div>
        </div>
      </section>

      <footer className="page-actions">
        <div className="left"><BackButton to="/resultados" fallback="/" /></div>
        <div className="right"><Link className="btn" to="/watchlist">Watchlist</Link></div>
      </footer>

      <TargetModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        symbol={symbol}
      />
    </div>
  );
}

function fmtPrice(v) {
  if (v == null) return "—";
  return Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}
function fmtChange(ch, pct) {
  if (ch == null && pct == null) return "—";
  const p = pct != null ? ` (${pct.toFixed(2)}%)` : "";
  const sign = ch > 0 ? "+" : "";
  return `${sign}${ch?.toFixed(2) ?? "—"}${p}`;
}
function fmtCap(v) {
  if (!v) return "—";
  return Intl.NumberFormat("pt-BR").format(v);
}
function fmtTime(t) {
  if (!t) return "—";
  // t pode vir em epoch (Yahoo) ou ISO (stooq). Mostra bruto/legível.
  try {
    if (typeof t === "number") return new Date(t * 1000).toLocaleString("pt-BR");
    return new Date(t).toLocaleString("pt-BR");
  } catch { return String(t); }
}
