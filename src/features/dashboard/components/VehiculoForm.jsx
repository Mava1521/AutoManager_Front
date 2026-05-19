export default function VehiculoForm({ mode, data = {}, setForm, onSave, onCancel }) {
  // Aseguramos que data sea un objeto vacío si es undefined
  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <>
      <h3>{mode === 'create' ? 'Nuevo Registro' : 'Editar Registro'}</h3>
      {/* Usamos el operador || '' para evitar el error de undefined */}
      <input 
        name="marca" 
        className="dash-input" 
        value={data.marca || ''} 
        onChange={handleChange} 
        placeholder="Marca" 
      />
      <input 
        name="sucursal" 
        className="dash-input" 
        value={data.sucursal || ''} 
        onChange={handleChange} 
        placeholder="Sucursal" 
      />
      <input 
        name="aspirante" 
        className="dash-input" 
        value={data.aspirante || ''} 
        onChange={handleChange} 
        placeholder="Aspirante" 
      />
      
      <button onClick={onSave}>{mode === 'create' ? 'Crear' : 'Guardar'}</button>
      <button onClick={onCancel}>Cancelar</button>
    </>
  );
}