import Header from "./components/Header.jsx";
import RoutesConfig from "./routes.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main className="container app-main">
        <RoutesConfig />
      </main>
    </>
  );
}
