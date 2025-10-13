import axios from "axios";
import "./index.css";

export default function Note(props) {

  // Função para deletar a anotação
  const deletarNota = () => {
    axios
      .delete(`http://localhost:8000/notes/${props.id}/`)
      .then(() => {
        props.loadNotes(); // Atualiza a lista de anotações
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="card">
      <h3 className="card-title">{props.title}</h3>
      <div className="card-content">{props.children}</div>
      <button className="btn-delete" onClick={deletarNota}>
        Deletar
      </button>
    </div>
  );
}
