import { useNavigate, useSearchParams } from "react-router-dom";
export default function SearchBar({ placeholder="Buscar ticker..." }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const defaultQ = params.get("q") || "";

  function onSubmit(e) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q").trim();
    if (!q) return;
    navigate(`/resultados?q=${encodeURIComponent(q)}`);
  }

  return (
    <form className="search" onSubmit={onSubmit} role="search">
      <input name="q" defaultValue={defaultQ} placeholder={placeholder} />
      <button type="submit" aria-label="Buscar">
        <svg viewBox="0 0 24 24"><path d="M21 21l-4.3-4.3m1.3-5.2a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" stroke="white" strokeWidth="2" fill="none"/></svg>
      </button>
    </form>
  );
}
