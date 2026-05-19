// src/features/auth/pages/RecoveryPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestPasswordRecovery } from "../services/authService";
import logo from "../../../assets/images/Imagologo_motion.svg";
import carBg from "../../../assets/images/ImageBackground.png";
import "../../../styles/RecoveryPage.css";

export default function RecoveryPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }
    try {
      setLoading(true);
      await requestPasswordRecovery(email);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "No encontramos una cuenta con ese correo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recovery-page">
      {/* Fondo — misma foto pero con tinte cyan más intenso */}
      <img src={carBg} alt="" className="recovery-bg" aria-hidden="true" />
      <div className="recovery-overlay" />

      {/* Card */}
      <div className="recovery-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src={logo} alt="Logo Manager" />
          <div className="auth-logo-divider" />
          <span className="auth-logo-text">Manager</span>
        </div>

        {success ? (
          <div className="recovery-success">
            <p>
              ✅ Te enviamos un correo a <strong>{email}</strong> con las
              instrucciones para recuperar tu contraseña.
            </p>
            <button
              className="auth-back-btn"
              onClick={() => navigate("/login")}
              type="button"
            >
              ← Volver al inicio
            </button>
          </div>
        ) : (
          <>
            <p className="recovery-hint">
              Digite el correo electrónico con el que se registró la cuenta:
            </p>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label htmlFor="recovery-email">Email</label>
                <input
                  id="recovery-email"
                  name="email"
                  type="email"
                  placeholder="demo@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  autoComplete="email"
                />
              </div>

              <div className="recovery-actions">
                <button
                  type="submit"
                  className="auth-pill-btn"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar correo"}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Botón Volver */}
        {!success && (
          <div className="recovery-footer">
            <Link to="/login" className="auth-back-btn">
              ← Volver
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}