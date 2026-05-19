import { useState } from 'react';

export default function ContactForm({ onSubmit }) {
  const [text, setText] = useState('');
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(text); }}>
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Escribe tu mensaje..." 
      />
      <button type="submit">Enviar</button>
    </form>
  );
}