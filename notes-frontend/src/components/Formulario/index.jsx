import axios from "axios";
import { useState } from "react";
import "./index.css";

export default function Formulario(props) {
    const [titulo, setTitulo] = useState("");
    const [content, setContent] = useState("");

    const criarNote = (event) => {
        event.preventDefault();

        const data = {
            "title": titulo,
            "content": content
        }

        axios
            .post("http://localhost:8000/notes/", data)
            .then((response) => {
                props.loadNotes();
                setTitulo("");
                setContent("");
            })
            .catch((error) => console.log(error));
    }

    return (
        <form className="form-card" onSubmit={criarNote}>
            <input
                className="form-card-title"
                type="text"
                name="titulo"
                placeholder="Título"
                onChange={(event) => setTitulo(event.target.value)}
                value={titulo}
            />
            <textarea
                className="autoresize"
                name="detalhes"
                placeholder="Digite o conteúdo..."
                onChange={(event) => setContent(event.target.value)}
                value={content}
            ></textarea>
            <button className="btn" type="submit">Criar</button>
        </form>
    );
}