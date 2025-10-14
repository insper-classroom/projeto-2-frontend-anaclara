import { useSearchParams, Link } from "react-router-dom";
import { MOCK_RESULTS } from "../services/mock.js";
import SearchBar from "../components/SearchBar.jsx";
import BackButton from "../components/BackButton.jsx";

export default function Results() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase();
  const data = MOCK_RESULTS.filter(r =>
    r.symbol.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)
  );

  return (
    <div className="page-wrapper">
      <section className="page centered">
        <div className="stack-narrow">
          <h2 className="title">
            Resultados {q && <>para ‘<span className="highlight">{q}</span>’</>}
          </h2>
          <SearchBar />

          <div className="list">
            {data.map(d => (
              <article key={d.symbol} className="card">
                <div className="card-head">
                  <h3 className="ticker">{d.symbol}</h3>
                  <span className="muted">{d.exchange}</span>
                </div>
                <p className="name">{d.name}</p>
                <Link className="btn-link" to={`/detalhe/${d.symbol}`}>Ver detalhes</Link>
              </article>
            ))}
            {data.length === 0 && <p className="empty">Nenhum resultado.</p>}
          </div>
        </div>
      </section>

      <footer className="page-actions">
        <div className="left"><BackButton to="/" /></div>
        <div className="right"><Link className="btn" to="/watchlist">Watchlist</Link></div>
      </footer>
    </div>
  );
}
