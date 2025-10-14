import { useParams, useNavigate, Link } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";
import { META } from "../services/mock.js";
import { formatBRL } from "../utils/format.js";

export default function Detail() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const price = META[symbol]?.price ?? 43.02;
  const change = META[symbol]?.change ?? 13.66;
  const name = META[symbol]?.name || symbol;

  function goEdit() {
    navigate(`/editar/${symbol}`, { state: { from: "details" } });
  }

  return (
    <div className="page-wrapper">
      <section className="page centered vh-center">
        <div className="stack-narrow">
          <h2 className="title" style={{ textAlign: "center" }}>
            {name} <span className="ticker">{symbol}</span>
          </h2>

          <div className="specs centered-specs">
            <div className="spec"><span>Preço atual</span><strong>{formatBRL(price)}</strong></div>
            <div className="spec"><span>Variação</span><strong>{change>=0?"+":""}{change.toFixed(2)}%</strong></div>
            <div className="spec"><span>Market Cap</span><strong>{(META[symbol]?.mcap||0).toLocaleString("pt-BR")}</strong></div>
            <div className="spec"><span>Última atualização</span><strong>agora</strong></div>
          </div>

          <div className="cta-center">
            <button className="btn btn-primary-lg" onClick={goEdit}>Adicionar</button>
          </div>
        </div>
      </section>

      <footer className="page-actions">
        <div className="left"><BackButton to="/resultados" /></div>
        <div className="right">
          <Link className="btn" to="/watchlist" state={{ from: "details", symbol }}>Watchlist</Link>
        </div>
      </footer>
    </div>
  );
}
