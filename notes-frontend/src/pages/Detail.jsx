import { useParams } from "react-router-dom";
import ChartCanvas from "../components/ChartCanvas.jsx";
import { mockSeries, META } from "../services/mock.js";
import { formatBRL } from "../utils/format.js";

export default function Detail() {
  const { symbol } = useParams();
  const serie = mockSeries(30, 38, 3);
  const price = serie.at(-1);
  const change = ((price - serie[0]) / serie[0]) * 100;

  return (
    <>
      <div className="head">
        <h1>{META[symbol]?.name || symbol}</h1>
        <p className="ticker">{symbol}</p>
      </div>

      <div className="specs">
        <div className="spec"><span>Preço atual</span><strong>{formatBRL(price)}</strong></div>
        <div className="spec"><span>Variação</span><strong>{change>=0?"+":""}{change.toFixed(2)}%</strong></div>
        <div className="spec"><span>Market Cap</span><strong>{(META[symbol]?.mcap||0).toLocaleString("pt-BR")}</strong></div>
        <div className="spec"><span>Atualização</span><strong>agora</strong></div>
      </div>

      <div className="chart-card">
        <div className="chart-head"><h2>Histórico</h2></div>
        <ChartCanvas data={serie} />
      </div>
    </>
  );
}
