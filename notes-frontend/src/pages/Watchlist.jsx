// src/pages/Watchlist.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

export default function Watchlist() {
  const [items, setItems] = useLocalStorage("watchlist", [
    { id: crypto.randomUUID(), symbol: "AAPL",    name: "Apple Inc.",   price: 173.2, target: 190.0, notes: "comprar" },
    { id: crypto.randomUUID(), symbol: "PETR4.SA", name: "Petrobras PN", price: 41.97, target: 41.97, notes: "vender"  },
  ]);

  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);

  function remove(id) { setItems(items.filter(i => i.id !== id)); }
  function openEdit(item) { navigate(`/editar/${item.symbol}`, { state: { from: "watchlist" } }); }

  return (
    <div className="page-wrapper">
      <section className="page">
        <h2 className="title">Watchlist</h2>

        <table className="watchlist-table">
          <thead>
            <tr>
              <th>Símbolo</th><th>Nome</th><th>Preço Atual</th><th>Meta</th><th>Notas</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const hit = item.target != null && item.price >= item.target;
              return (
                <tr key={item.id} className={hit ? "hit" : ""}>
                  <td className="symbol">{item.symbol}</td>
                  <td>{item.name}</td>
                  <td className="price">R$ {item.price.toFixed(2)}</td>
                  <td>{item.target != null ? `R$ ${item.target.toFixed(2)}` : "—"}</td>
                  <td>{item.notes || "—"}</td>
                  <td className="row-actions">
                    <Link className="btn btn-secondary" to={`/detalhe/${item.symbol}`}>Detalhes</Link>
                    <button className="btn" onClick={() => openEdit(item)}>Editar</button>
                    <button className="btn danger" onClick={() => remove(item.id)}>Excluir</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <footer className="page-actions">
        <div className="left"><Link className="btn btn-secondary" to="/">Voltar</Link></div>
        <div className="right" />
      </footer>
    </div>
  );
}
