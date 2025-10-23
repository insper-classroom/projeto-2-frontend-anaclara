// src/pages/Watchlist.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listWatchlist,
  deleteWatchItem,   // <- usamos essa função; ela NÃO deve tentar json() num 204
} from "../services/api";

// util simples de formatação
const fmtBRL = (v) =>
  typeof v === "number"
    ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "—";

const fmtPct = (v) =>
  typeof v === "number"
    ? `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`
    : "—";

// regra: destacar quando preço atual atingir/ultrapassar a meta.
// (não depende mais de direção; mantém a lógica neutra que combinamos)
function hitTarget(current, target) {
  if (current == null || target == null) return false;
  // se a meta é maior que o preço atual, só "bate" quando current >= target
  // se a meta é menor que o preço atual, só "bate" quando current <= target
  return target >= current ? current >= target : current <= target;
}

export default function Watchlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await listWatchlist();
        setItems(Array.isArray(data) ? data : data?.results ?? []);
      } catch (e) {
        setErr(e?.message || "Erro ao carregar a watchlist");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleDelete(id) {
    const ok = window.confirm("Tem certeza que deseja excluir esta meta?");
    if (!ok) return;
    try {
      // IMPORTANTE: a função deleteWatchItem deve apenas verificar res.ok (204) e não chamar res.json()
      await deleteWatchItem(id);
      // atualiza a lista local
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e) {
      alert("Falha ao excluir: " + (e?.message || "erro desconhecido"));
    }
  }

  function handleEdit(row) {
    // navega para tela de edição com o id da meta (seu Edit.jsx já trata isso)
    navigate(`/editar/${encodeURIComponent(row.symbol)}`, {
      state: { item: row }, // mantém compatibilidade com seu Edit.jsx
    });
  }

  function handleDetails(row) {
    navigate(`/detalhe/${encodeURIComponent(row.symbol)}`);
  }

  return (
    <div className="page">
      <div className="container">
        <h1>Watchlist</h1>

        {loading && <p>Carregando…</p>}
        {err && <p className="error">{err}</p>}

        {!loading && items.length === 0 && <p>Nenhum item cadastrado.</p>}

        {!loading && items.length > 0 && (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Símbolo</th>
                  <th>Preço Atual</th>
                  <th>Variação</th>
                  <th>Meta</th>
                  <th>Notas</th>
                  <th style={{ textAlign: "right" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => {
                  // campos esperados do back/agg do front:
                  // id, symbol, target_price, notes, quote_price, quote_change_pct
                  const current = row.quote_price ?? row.currentPrice;
                  const changePct =
                    typeof row.quote_change_pct === "number"
                      ? row.quote_change_pct * 100 // se veio em fração (0.013), vira %
                      : row.quote_change_pct ?? row.changePct;

                  const target = row.target_price ?? row.targetPrice;
                  const isHit = hitTarget(current, target);

                  return (
                    <tr key={row.id || row.symbol}>
                      <td>{row.symbol}</td>
                      <td className={isHit ? "hit" : undefined}>
                        {fmtBRL(current)}
                      </td>
                      <td className={changePct < 0 ? "neg" : "pos"}>
                        {fmtPct(changePct)}
                      </td>
                      <td>{fmtBRL(target)}</td>
                      <td>{row.notes || "—"}</td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <button className="btn ghost" onClick={() => handleDetails(row)}>
                          Detalhes
                        </button>
                        <button className="btn" onClick={() => handleEdit(row)}>
                          Editar
                        </button>
                        <button
                          className="btn danger"
                          onClick={() => handleDelete(row.id)}
                          style={{ marginLeft: 8 }}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="footer-bar">
          <button className="btn light" onClick={() => navigate(-1)}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
