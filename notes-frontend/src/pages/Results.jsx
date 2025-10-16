import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import BackButton from "../components/BackButton.jsx";
import { searchSymbols } from "../services/api.js";

export default function Results() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!q) { setItems([]); return; }
      setLoading(true); setErr("");
      try {
        const data = await searchSymbols(q, 12);
        if (!cancelled) setItems(data.items || []);
      } catch (e) {
        if (!cancelled) setErr(e.message || "Falha ao buscar");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [q]);

  return (
    <div className="page-wrapper">
      <section className="page centered vh-center">
        <div className="stack-narrow">
          <h2 className="title">
            Resultados {q && <>para ‘<span className="highlight">{q}</span>’</>}
          </h2>

          <SearchBar />

          {loading && <p className="muted">Buscando…</p>}
          {err && <p className="muted" style={{color:"#b91c1c"}}>{err}</p>}

          <div className="list">
            {items.map(d => (
              <article key={`${d.symbol}-${d.exchange}`} className="card">
                <div className="card-head">
                  <h3 className="ticker">{d.symbol}</h3>
                  <span className="muted">{d.exchange}</span>
                </div>
                <p className="name">{d.name}</p>
                <Link className="btn-link" to={`/detalhe/${d.symbol}`}>Ver detalhes</Link>
              </article>
            ))}
          </div>

          {!loading && !err && items.length === 0 && q && (
            <p className="muted">Nenhum resultado.</p>
          )}
        </div>
      </section>

      <footer className="page-actions">
        <div className="left"><BackButton to="/" /></div>
        <div className="right"><Link className="btn" to="/watchlist">Watchlist</Link></div>
      </footer>
    </div>
  );
}
