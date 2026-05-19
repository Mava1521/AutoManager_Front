import React from 'react';

/**
 * Componente Atómico de Botón Reutilizable.
 * de interacción del sistema y garantizando un comportamiento accesible y consistente.
 * * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido o etiqueta interna del botón.
 * @param {boolean} [props.fullWidth=false] - Define si el componente expande su ancho al 100%.
 * @param {'primary' | 'secondary' | 'danger' | 'outline'} [props.variant='primary'] - Variante estética.
 * @param {string} [props.className=''] - Clases utilitarias adicionales para sobreescrituras controladas.
 */
export default function Button({ 
  children, 
  fullWidth = false, 
  variant = 'primary', 
  className = '', 
  ...props 
}) {
  
  // 1. Coacción limpia a booleano para el control de dimensiones
  const isFullWidth = !!fullWidth;

  // 2. Catálogo de Estilos de Diseño (Cohesivo con fuentes Montserrat y paleta corporativa)
  const baseStyles = 'inline-flex items-center justify-center font-montserrat font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 text-sm';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md focus:ring-cyan-500',
    secondary: 'bg-pink-600 hover:bg-pink-700 text-white shadow-md focus:ring-pink-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  // 3. Composición dinámica de cadenas de clases evitando colisiones básicas
  const buttonStyles = [
    baseStyles,
    variants[variant] || variants.primary,
    isFullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      type={props.type || 'button'} // Define 'button' por defecto para evitar comportamientos de submit inesperados en formularios
      className={buttonStyles} 
      {...props} 
    >
      {children}
    </button>
  );
}