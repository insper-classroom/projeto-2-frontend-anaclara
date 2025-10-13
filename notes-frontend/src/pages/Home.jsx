import SearchBar from "../components/SearchBar.jsx";
import SuggestionChips from "../components/SuggestionChips.jsx";

export default function Home() {
  return (
    <section className="card">
      <div className="hero">
        <p>Pesquise ações, trace metas e visualize oportunidades.</p>
      </div>
      <SearchBar placeholder="Digite um ticker (ex.: PETR4, AAPL...)" />
      <SuggestionChips />
    </section>
  );
}
