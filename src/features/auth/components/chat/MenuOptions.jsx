export default function MenuOptions({ options, onSelect }) {
  return (
    <div className="menu-options">
      {options.map((opt) => (
        <button key={opt.id} onClick={() => onSelect(opt.id)}>
          {opt.text}
        </button>
      ))}
    </div>
  );
}