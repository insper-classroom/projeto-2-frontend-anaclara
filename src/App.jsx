import Header from "./components/Header.jsx";
import RoutesConfig from "./routes.jsx";
import "./styles/style.css";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="content">
        <RoutesConfig />
      </main>
    </div>
  );
}
