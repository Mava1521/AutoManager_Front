// src/features/auth/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import SupportChatbot from "../../../features/auth/components/ChatBot";
import QuickLoginMenu from "../components/QuickLoginMenu";
import logo from "../../../assets/images/Imagologo_motion.svg";
import carBg from "../../../assets/images/ImageBackground.png";
import "../../../styles/LoginPage.css";
import "../../../styles/QuickLoginMenu.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(
    location.search.includes("expired=true")
      ? "Tu sesión ha expirado, por favor inicia sesión nuevamente."
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  // Función para auto-completar y hacer login automático
  const handleQuickLogin = async (email, password, userName) => {
    setIsQuickMenuOpen(false);
    setForm({ email, password });
    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Redirige primero a la página de bienvenida
        navigate("/home"); 
      } else {
        setError(result.message || "Error al iniciar sesión con el perfil de prueba.");
        setLoading(false);
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intenta nuevamente.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    try {
      setLoading(true);
      const result = await login(form.email, form.password);
      
      if (result.success) {
        // Redirige primero a la página de bienvenida
        navigate("/home");
      } else {
        setError(result.message || "Credenciales incorrectas. Intenta de nuevo.");
      }
    } catch (err) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="welcome-header">
        <img src={logo} alt="Manager logo" className="welcome-logo" />
      </div>

      <img src={carBg} alt="" className="login-bg" aria-hidden="true" />
      <div className="login-overlay" />

      <div className="login-card">
        <div className="login-logo">
          <img src={logo} alt="Logo Manager" />
          <div className="login-logo-divider" />
          <span className="login-logo-text">Manager</span>
        </div>

        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="email">USUARIO</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="design@monitoringinnovation.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="login-field" style={{ marginTop: "1.2rem" }}>
            <label htmlFor="password">CONTRASEÑA</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "1.6rem" }}>
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </div>
        </form>

        <div className="login-links-row">
          <Link to="/recovery" className="login-link">
            Olvidé <span className="login-link-highlight">Mi</span> contraseña
          </Link>
          <Link to="/signup" className="login-link">
            Registrarse
          </Link>
        </div>

        {/* Botones inferiores */}
        <div className="login-icons-row">
          {/* Botón de Información -> Activa el Chatbot */}
          <button 
            className={`login-icon-btn ${isChatbotOpen ? 'active' : ''}`} 
            aria-label="Soporte Técnico" 
            data-tooltip="Abrir Asistente de Soporte Técnico"
            type="button"
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </button>

          {/* Botón de Usuario -> Quick Login para evaluadores */}
          <button 
            className="login-icon-btn" 
            aria-label="Acceso rápido para evaluadores" 
            data-tooltip="Ver Perfiles de Prueba (Acceso Rápido)"
            type="button"
            onClick={() => setIsQuickMenuOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>

      {isChatbotOpen && (
        <div className="login-chatbot-portal">
          <SupportChatbot onClose={() => setIsChatbotOpen(false)} />
        </div>
      )}

      <QuickLoginMenu
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onSelectUser={handleQuickLogin}
      />
    </div>
  );
}