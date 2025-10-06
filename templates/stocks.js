/* 
   UTILIDADES GERAIS
 */
function qs(sel, ctx=document){ return ctx.querySelector(sel); }
function qsa(sel, ctx=document){ return [...ctx.querySelectorAll(sel)]; }
function getParam(name){ return new URLSearchParams(location.search).get(name); }

/* 
   HOME — Pesquisa e sugestões
 */
const home = () => {
  const input = qs("#searchInput");
  const form = qs("#searchForm");
  const chips = qs("#suggestionChips");

  const suggestions = ["PETR4", "AAPL", "VALE3", "MSFT", "ITUB4", "AMZN"];

  if (chips) {
    suggestions.forEach(sym => {
      const c = document.createElement("button");
      c.className = "chip";
      c.textContent = sym;
      c.addEventListener("click", () => goSearch(sym));
      chips.appendChild(c);
    });
  }

  function goSearch(query) {
    if (!query) query = input.value.trim();
    if (!query) return;
    location.href = `resultados.html?q=${encodeURIComponent(query)}`;
  }

  if (form) form.addEventListener("submit", e => {
    e.preventDefault();
    goSearch();
  });
};

/* 
   RESULTADOS — Mock e navegação
 */
const resultados = () => {
  const MOCK = [
    { symbol:"PETR4.SA", name:"Petrobras PN", exchange:"SAO" },
    { symbol:"VALE3.SA", name:"Vale ON", exchange:"SAO" },
    { symbol:"AAPL", name:"Apple Inc.", exchange:"NASDAQ" },
    { symbol:"MSFT", name:"Microsoft Corp.", exchange:"NASDAQ" },
  ];

  const q = (getParam("q") || "").toLowerCase();
  const list = qs("#results");
  const empty = qs("#empty");
  const title = qs("#title");

  if (!list) return;
  title.textContent = q ? `Resultados para ‘${q}’` : "Resultados";

  const data = MOCK.filter(r =>
    r.symbol.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)
  );

  if (data.length === 0) {
    empty.hidden = false;
    return;
  }

  list.innerHTML = data.map(d => `
    <article class="card">
      <h3>${d.symbol}</h3>
      <p class="muted">${d.name} • ${d.exchange}</p>
      <a class="link" href="detalhe.html?symbol=${d.symbol}">Ver detalhes</a>
    </article>
  `).join("");
};

/* 
   DETALHE — Gráfico dinâmico
 */
const detalhe = () => {
  const symbol = getParam("symbol") || "PETR4.SA";
  const name = {
    "PETR4.SA":"Petrobras PN",
    "VALE3.SA":"Vale ON",
    "AAPL":"Apple Inc.",
    "MSFT":"Microsoft Corp."
  }[symbol] || symbol;

  qs("#assetName")?.textContent = name;
  qs("#assetSymbol")?.textContent = symbol;

  // série de preços mock
  const days = 30;
  let p = 38, arr=[];
  for(let i=0;i<days;i++){
    p += (Math.random()-0.5)*2;
    arr.push(p);
  }

  const canvas = qs("#chart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.beginPath();
  arr.forEach((v,i)=>{
    const x = (i/(days-1))*(w-40)+20;
    const y = h - ((v - Math.min(...arr))/(Math.max(...arr)-Math.min(...arr)))*(h-40) - 20;
    i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  });
  ctx.strokeStyle = "#0b2a6f";
  ctx.lineWidth = 2;
  ctx.stroke();
};

/* 
   WATCHLIST — CRUD local
 */
const watchlist = () => {
  const listEl = qs("#list");
  if (!listEl) return;

  let data = JSON.parse(localStorage.getItem("watchlist") || "[]");
  if (data.length === 0) {
    data = [
      { id:1, symbol:"PETR4.SA", name:"Petrobras PN", price:38.42, target:42.0 },
      { id:2, symbol:"AAPL", name:"Apple Inc.", price:173.2, target:190.0 }
    ];
    localStorage.setItem("watchlist", JSON.stringify(data));
  }

  function render() {
    listEl.innerHTML = "";
    if (data.length === 0) {
      qs("#empty").hidden = false;
      return;
    }
    qs("#empty").hidden = true;

    data.forEach(item=>{
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="row">
          <span class="symbol">${item.symbol}</span>
          <span class="price">R$ ${item.price.toFixed(2)}</span>
        </div>
        <p class="muted">${item.name} • Meta: R$ ${item.target.toFixed(2)}</p>
        <div class="actions">
          <button class="btn edit">Editar</button>
          <button class="btn btn-danger del">Excluir</button>
        </div>`;
      // excluir
      card.querySelector(".del").addEventListener("click",()=>{
        if(confirm("Remover da watchlist?")){
          data = data.filter(x=>x.id!==item.id);
          localStorage.setItem("watchlist", JSON.stringify(data));
          render();
        }
      });
      // editar meta
      card.querySelector(".edit").addEventListener("click",()=>{
        const newVal = prompt("Nova meta (R$)", item.target);
        if (!newVal) return;
        item.target = parseFloat(newVal);
        localStorage.setItem("watchlist", JSON.stringify(data));
        render();
      });
      listEl.appendChild(card);
    });
  }

  render();
};

/* 
   AUTO-DETECTA A PÁGINA
 */
document.addEventListener("DOMContentLoaded", () => {
  if (qs(".suggestions")) home();
  else if (qs("#results")) resultados();
  else if (qs("#chart")) detalhe();
  else if (qs("#list")) watchlist();
});
