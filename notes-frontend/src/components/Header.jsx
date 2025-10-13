import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function Header() {
  const { pathname } = useLocation();
  return (
    <header>
      <div className="header-inner">
        <Link to="/" className="logo" aria-label="FinScope Home">
          <img src={logo} alt="" width={28} height={28} />
          <span className="logo-title">FinScope</span>
        </Link>
        <nav className="nav">
          <Link to="/resultados" className={`nav-link ${pathname==="/resultados" ? "active":""}`}>Buscar</Link>
          <Link to="/watchlist" className={`nav-link ${pathname==="/watchlist" ? "active":""}`}>Watchlist</Link>
        </nav>
      </div>
    </header>
  );
}
