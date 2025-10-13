import { useLocalStorage } from "../hooks/useLocalStorage.js";
import TargetModal from "../components/TargetModal.jsx";

export default function Watchlist() {
  const [items, setItems] = useLocalStorage("watchlist", [
    { id: crypto.randomUUID(), symbol:"AAPL", name:"Apple Inc.", price:173.2, target:190.0, notes:"comprar" },
    { id: crypto.randomUUID(), symbol:"PETR4.SA", name:"Petrobras PN", price:38.42, target:42.0, notes:"vender" },
  ]);
  const [editing, setEditing] = React.useState(null);

  function remove(id){ setItems(items.filter(i=>i.id!==id)); }
  function openEdit(item){ setEditing(item); }
  function saveEdit({target, notes}){
    setItems(items.map(i=> i.id===editing.id ? {...i, target, notes} : i));
    setEditing(null);
  }

  return (
    <>
      <h1>Minha Watchlist</h1>
      <div className="grid" style={{marginTop:12}}>
        {items.map(i=>(
          <article key={i.id} className="card">
            <div className="row">
              <span className="symbol">{i.symbol}</span>
              <span className="price">R$ {i.price.toFixed(2)}</span>
            </div>
            <div className="row"><span className="label">Meta (target)</span><strong>R$ {i.target.toFixed(2)}</strong></div>
            <div className="row"><span className="label">Notas</span><span>{i.notes || "—"}</span></div>
            <div className="actions" style={{marginTop:8}}>
              <button className="btn" onClick={()=>openEdit(i)}>Editar</button>
              <button className="btn btn-danger" onClick={()=>remove(i.id)}>Excluir</button>
            </div>
          </article>
        ))}
      </div>

      <TargetModal
        open={!!editing}
        symbol={editing?.symbol}
        initialTarget={editing?.target}
        initialNotes={editing?.notes}
        onSave={saveEdit}
        onClose={()=>setEditing(null)}
      />
    </>
  );
}
