import SearchBar from "../components/SearchBar.jsx";
import SuggestionChips from "../components/SuggestionChips.jsx";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page-wrapper">
      {/* vh-center centraliza vertical + horizontal */}
      <section className="page centered vh-center">
        <div className="stack-narrow home-hero">
          <h1 className="hero hero-centered">
            Pesquise ações, estabeleça metas<br/>e visualize oportunidades em tempo real.
          </h1>

          <SearchBar />
          <div className="chips-wrap chips-center">
            <SuggestionChips />
          </div>
        </div>
      </section>

      <footer className="page-actions">
        <div className="left" />
        <div className="right">
          <Link className="btn" to="/watchlist">Watchlist</Link>
        </div>
      </footer>
    </div>
  );
}
