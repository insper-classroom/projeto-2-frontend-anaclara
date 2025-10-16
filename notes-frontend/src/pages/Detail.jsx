import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";
import { getDetails } from "../services/api.js";
import { formatBRL } from "../utils/format.js";

export default function Detail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setErr("");
      try {
        const d = await getDetails(symbol);
        if (!cancelled) setData(d);
      } catch (e) {
        if (!cancelled) setErr(e.message || "Erro ao obter detalhes");
      }
    }
    run();
    return () => { cancelled = true; };
  }, [symbol]);

  function goEdit() {
    navigate(`/editar/${symbol}`, { state: { from: "details" } });
  }

  const price = data?.price ?? null;
  const changePct = data?.change_pct ?? null;

  return (
    <div className="page-wrapper">
      <section className="page centered vh-center">
        <div className="stack-narrow">
          <h2 className="title" style={{ textAlign:"center" }}>
            {data?.name || ""} <span className="ticker">{symbol}</span>
          </h2>

          {err && <p className="muted" style={{color:"#b91c1c", textAlign:"center"}}>{err}</p>}

          <div className="specs centered-specs">
            <div className="spec">
              <span>Preço atual</span>
              <strong>{price != null ? formatBRL(price) : "—"}</strong>
            </div>
            <div className="spec">
              <span>Variação</span>
              <strong>{changePct != null ? `${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%` : "—"}</strong>
            </div>
            <div className="spec">
              <span>Market Cap</span>
              <strong>—</strong>
            </div>
            <div className="spec">
              <span>Última atualização</span>
              <strong>{data?.as_of || "—"}</strong>
            </div>
          </div>

          <div className="cta-center">
            <button className="btn btn-primary-lg" onClick={goEdit}>Adicionar</button>
          </div>
        </div>
      </section>

      <footer className="page-actions">
        <div className="left"><BackButton to="/resultados" /></div>
        <div className="right"><Link className="btn" to="/watchlist" state={{ from:"details", symbol }}>Watchlist</Link></div>
      </footer>
    </div>
  );
}
