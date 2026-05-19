export default function SearchInput({ value, onChange }) {
  return (
    <input 
      className="dash-input" 
      placeholder="Buscar aspirante..." 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
    />
  );
}