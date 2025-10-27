import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Results from "./pages/Results.jsx";
import Detail from "./pages/Detail.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import Edit from "./pages/Edit.jsx"; 

export default function RoutesConfig() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resultados" element={<Results />} />
      <Route path="/detalhe/:symbol" element={<Detail />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/editar/:symbol" element={<Edit />} /> 
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
