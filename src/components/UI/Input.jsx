import React, { useId } from 'react';

/**
 * Componente de Input altamente reutilizable.
 * * Gestiona visualmente estados de error y branding corporativo.
 */
export default function Input({ 
  label, 
  type = 'text', 
  error, 
  className = '', 
  ...props 
}) {
  // Genera un ID único para vincular label e input automáticamente
  const id = useId();

  // Composición de estilos base y dinámicos (Claro, escalable y mantenible)
  const baseInputStyles = 'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 font-montserrat';
  
  const borderStyles = error 
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-300 focus:ring-[#00249C] focus:border-[#00249C]';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-semibold text-gray-700 mb-1 font-montserrat"
        >
          {label}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        className={`${baseInputStyles} ${borderStyles}`}
        {...props}
      />
      
      {/* Mensaje de error con espaciado consistente */}
      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-medium font-montserrat animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
}