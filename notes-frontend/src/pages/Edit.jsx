import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { listWatchlist, updateWatchItem, createWatchItem } from "../services/api.js";

export default function Edit() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { from = "watchlist", id: idFromState, item: itemFromState } = useLocation().state || {};
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(itemFromState || null); // {id, ticker/symbol, target_price, notes}

  // se não veio pelo state, busca pelos itens e tenta achar por símbolo
  useEffect(() => {
    if (itemFromState) return;
    let cancel = false;
    async function load() {
      try {
        const data = await listWatchlist();
        if (cancel) return;
        const found = (data || []).find(i => (i.ticker || i.symbol) === symbol);
        if (found) setItem(found);
      } catch { /* silencioso */ }
    }
    load();
    return () => { cancel = true; };
  }, [symbol, itemFromState]);

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const target = parseFloat(form.get("target"));
    const notes  = String(form.get("notes") || "");

    setLoading(true);
    try {
      if (item?.id) {
        await updateWatchItem(item.id, { targetPrice: target, notes });
      } else {
        await createWatchItem({ symbol, targetPrice: target, notes });
      }
      navigate("/watchlist");
    } catch (err) {
      alert(`Falha ao salvar: ${err.message}`);
    } finally {
      setLoading(false);
    }
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
            <label>Preço alvo</label>
            <input name="target" type="number" step="0.01" defaultValue={item?.target_price ?? ""} required />
            <label>Notas</label>
            <input name="notes" type="text" defaultValue={item?.notes ?? ""} />
          </form>
        </div>
      </section>

      <footer className="page-actions">
        <div className="left">
          <button className="btn btn-primary" form="edit-form" type="submit" disabled={loading}>Salvar</button>
        </div>
        <div className="right">
          <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancelar</button>
        </div>
      </footer>
    </div>
  );
}
