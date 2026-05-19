// src/features/auth/pages/SignupPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import logo from "../../../assets/images/Imagologo_motion.svg";
import carBg from "../../../assets/images/ImageBackground.png";
import "../../../styles/SignupPage.css";

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    confirmar: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.apellido || !form.correo || !form.password || !form.confirmar) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (form.password !== form.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      setLoading(true);
      await register({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.correo,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Ocurrió un error al crear la cuenta."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* Fondo — misma foto con tinte rosa/magenta */}
      <img src={carBg} alt="" className="signup-bg" aria-hidden="true" />
      <div className="signup-overlay" />

      {/* Card */}
      <div className="signup-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src={logo} alt="Logo Manager" />
          <div className="auth-logo-divider" />
          <span className="auth-logo-text">Manager</span>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Fila Nombre + Apellido */}
          <div className="signup-row">
            <div className="auth-field">
              <label htmlFor="nombre">Nombre</label>
              <div className="signup-name-wrapper">
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="NOMBRE"
                  value={form.nombre}
                  onChange={handleChange}
                  autoComplete="given-name"
                />
                <span className="signup-plus" aria-hidden="true">+</span>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                placeholder="APELLIDO"
                value={form.apellido}
                onChange={handleChange}
                autoComplete="family-name"
              />
            </div>
          </div>

          {/* Correo */}
          <div className="auth-field" style={{ marginTop: "1rem" }}>
            <label htmlFor="correo">Correo</label>
            <input
              id="correo"
              name="correo"
              type="email"
              placeholder="design@monitoringinnovation.com"
              value={form.correo}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          {/* Contraseña */}
          <div className="auth-field" style={{ marginTop: "1rem" }}>
            <label htmlFor="password">Contraseña</label>
            <div className="signup-input-eye">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  /* Ojo abierto */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  /* Ojo tachado */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="auth-field" style={{ marginTop: "1rem" }}>
            <label htmlFor="confirmar">Confirmar Contraseña</label>
            <div className="signup-input-eye">
              <input
                id="confirmar"
                name="confirmar"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••••••••"
                value={form.confirmar}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirm ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Términos */}
          <p className="signup-terms">
            Al hacer clic en crear cuenta, acepta los términos de las{" "}
            <a href="https://monitoringinnovation.com/" target="_blank" rel="noreferrer">
              políticas de privacidad
            </a>{" "}
            y{" "}
            <a href="https://monitoringinnovation.com/" target="_blank" rel="noreferrer">
              términos del servicio
            </a>
            .
          </p>

          {/* Botones */}
          <div className="signup-actions">
            <Link to="/login" className="auth-back-btn">
              ← Volver
            </Link>
            <button type="submit" className="auth-pill-btn" disabled={loading}>
              {loading ? "Creando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}