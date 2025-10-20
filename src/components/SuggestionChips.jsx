import { useNavigate } from "react-router-dom";
export default function SuggestionChips({ items=["PETR4","AAPL","VALE3","MSFT","ITUB4","AMZN"] }) {
  const navigate = useNavigate();
  return (
    <div className="suggestions">
      {items.map(sym=>(
        <button key={sym} className="chip" onClick={()=>navigate(`/resultados?q=${sym}`)}>
          {sym}
        </button>
      ))}
    </div>
  );
}
