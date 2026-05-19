// src/features/auth/components/QuickLoginMenu.jsx
import { useEffect, useRef } from "react";

// Arreglo de usuarios con iconos SVG profesionales incorporados
const DEMO_USERS = [
  {
    id: "admin",
    name: "Administrador",
    email: "admin@automanager.com",
    password: "Admin1234!",
    // Icono SVG profesional: Escudo con llave (control total)
    iconSVG: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <circle cx="12" cy="11" r="3"/>
        <path d="M12 14v4"/>
      </svg>
    ),
    description: "Acceso completo: Crear, editar, eliminar y exportar"
  },
  {
    id: "viewer",
    name: "Aspirante / Viewer",
    email: "david@automanager.com",
    password: "Viewer1234!",
    // Icono SVG profesional: Usuario con lupa (solo lectura)
    iconSVG: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <circle cx="18" cy="7" r="2.5" />
        <path d="M21 10.5l-2.5-2.5" />
      </svg>
    ),
    description: "Solo lectura: Ver tabla y buscar"
  }
];

export default function QuickLoginMenu({ onSelectUser, isOpen, onClose }) {
  const menuRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Cerrar al presionar Escape
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Fondo oscuro y difuminado */}
      <div className="quick-login-overlay" onClick={onClose} />
      
      {/* Contenedor principal del menú */}
      <div ref={menuRef} className="quick-login-menu">
        <div className="quick-login-header">
          {/* Título con icono de cohete profesional */}
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C6007E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="header-rocket">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <circle cx="12" cy="11" r="3"/>
                <path d="M12 14v4"/>
            </svg>
            <span>Acceso Rápido</span>
          </h3>
          <p>Selecciona un perfil de prueba para ingresar</p>
        </div>
        
        <div className="quick-login-users">
          {DEMO_USERS.map((user) => (
            <button
              key={user.id}
              className="quick-login-user-btn"
              onClick={() => onSelectUser(user.email, user.password)}
            >
              {/* Contenedor del icono con fondo */}
              <div className="quick-login-user-icon">
                {user.iconSVG}
              </div>
              
              <div className="quick-login-user-info">
                <div className="quick-login-user-name">{user.name}</div>
                <div className="quick-login-user-email">{user.email}</div>
                <div className="quick-login-user-desc">{user.description}</div>
              </div>
              <span className="quick-login-user-arrow">→</span>
            </button>
          ))}
        </div>
        
        {/* El footer con la bombilla ha sido eliminado */}
      </div>
    </>
  );
}