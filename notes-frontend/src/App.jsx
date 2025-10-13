import axios from "axios";
import { useEffect, useState } from "react";
import Note from "./components/Note";
import AppBar from "./components/AppBar";
import Formulario from "./components/Formulario";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);

  const carregaNotas = () => {
    axios
      .get("http://localhost:8000/notes/")
      .then((res) => setNotes(res.data));
  }

  useEffect(() => {
    carregaNotas();
  }, []);

  return (
    <>
      <AppBar />
      <main className="container">
        <Formulario loadNotes={carregaNotas}/>
        <div className="card-container">
          {notes.map((note) => (
            <Note key={`note__${note.id}`} title={note.title}>
              {note.content}
            </Note>
          ))}
        </div>
      </main>
    </>
  );
}

export default App;