// src/components/BackButton.jsx
import { useNavigate, useLocation } from "react-router-dom";

export default function BackButton({ to, fallback }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleBack() {
    if (to) return navigate(to);
    if (location.key !== "default") return navigate(-1);
    if (fallback) return navigate(fallback);
  }

  return (
    <button className="btn btn-secondary" onClick={handleBack}>
      Voltar
    </button>
  );
}
