export default function TargetModal({ open, onClose, onSave, symbol, initialTarget="", initialNotes="" }) {
  if (!open) return null;
  function submit(e){
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSave({ target: Number(fd.get("target")), notes: fd.get("notes") });
  }
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-head">Adicionar/Editar Meta</div>
        <form onSubmit={submit} className="modal-body">
          <label>Símbolo</label>
          <input value={symbol} readOnly />
          <label>Preço Alvo</label>
          <input name="target" type="number" step="0.01" defaultValue={initialTarget} />
          <label>Notas</label>
          <input name="notes" type="text" defaultValue={initialNotes} />
          <div className="modal-actions">
            <button className="btn" type="submit">Salvar</button>
            <button className="btn btn-secondary" type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
