import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import searchIcon from "../assets/search.png";

export default function SearchBar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initial = params.get("q") || "";
  const [q, setQ] = useState(initial);

  useEffect(() => { setQ(initial); }, [initial]);

  function onSubmit(e) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/resultados?q=${encodeURIComponent(query)}`);
  }

  return (
    <form className="searchbar" onSubmit={onSubmit}>
      <div className="search-block">
        <input
          type="text"
          placeholder="Buscar ticker..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="icon-btn" type="submit" aria-label="Buscar">
          <img src={searchIcon} alt="" />
        </button>
      </div>
    </form>
  );
}
