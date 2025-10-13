import { useSearchParams, Link } from "react-router-dom";
import { MOCK_RESULTS } from "../services/mock.js";
import SearchBar from "../components/SearchBar.jsx";

export default function Results() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase();
  const data = MOCK_RESULTS.filter(r =>
    r.symbol.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)
  );

  return (
    <>
      <SearchBar />
      <h1 style={{marginTop:16}}>{q ? `Resultados para ‘${q}’` : "Resultados"}</h1>
      <div className="grid" style={{marginTop:12}}>
        {data.map(d=>(
          <article key={d.symbol} className="card">
            <h3>{d.symbol}</h3>
            <p className="muted">{d.name} • {d.exchange}</p>
            <Link className="link" to={`/detalhe/${d.symbol}`}>Ver detalhes</Link>
          </article>
        ))}
        {data.length===0 && <p className="empty">Nenhum resultado.</p>}
      </div>
    </>
  );
}
