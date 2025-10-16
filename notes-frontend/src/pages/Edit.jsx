import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { META } from "../services/mock.js";

export default function Edit() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const from = useLocation().state?.from || "watchlist";

  const [items, setItems] = useLocalStorage("watchlist", []);
  const current = items.find(i => i.symbol === symbol) || null;

  function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const target = parseFloat(form.get("target"));
    const notes  = String(form.get("notes") || "");

    if (current) {
      setItems(items.map(i => i.symbol === symbol ? { ...i, target, notes } : i));
    } else {
      const name  = META[symbol]?.name || symbol;
      const price = META[symbol]?.price ?? 0;
      setItems([...items, { id: crypto.randomUUID(), symbol, name, price, target, notes }]);
    }
    navigate("/watchlist", { state: { from: "details", symbol } });
  }

  function onCancel() {
    if (from === "details") return navigate(`/detalhe/${symbol}`);
    return navigate("/watchlist");
  }

  return (
    <div className="page-wrapper">
      <section className="page centered">
        <div className="stack-narrow">
          <h2 className="title">Editar meta</h2>
          <form id="edit-form" onSubmit={onSubmit} className="form">
            <label>Símbolo</label>
            <input value={symbol} readOnly />
            <label>Preço Atual</label>
            <input value={symbol} readOnly />
            <label>Preço alvo</label>
            <input name="target" type="number" step="0.01" defaultValue={current?.target ?? ""} required />
            <label>Notas</label>
            <input name="notes" type="text" defaultValue={current?.notes ?? ""} />
          </form>
        </div>
      </section>

      <footer className="page-actions">
        <div className="left">
          <button className="btn btn-primary" form="edit-form" type="submit">Salvar</button>
        </div>
        <div className="right">
          <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancelar</button>
        </div>
      </footer>
    </div>
  );
}
