// src/features/auth/pages/ResetPasswordPage.jsx
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";
import "../../../styles/ResetPasswordPage.css";

const PASSWORD_RULES = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecial: /[!@#$%^&*(),.?":{}|<>]/,
};

const STRENGTH_LABELS = ["", "Débil", "Regular", "Buena", "Fuerte"];
const STRENGTH_COLORS = ["", "#C6007E", "#E2A800", "#40CEE4", "#00249C"];

function validatePassword(password) {
  const errors = [];
  if (password.length < PASSWORD_RULES.minLength)
    errors.push(`Mínimo ${PASSWORD_RULES.minLength} caracteres`);
  if (!PASSWORD_RULES.hasUppercase.test(password))
    errors.push("Al menos una mayúscula");
  if (!PASSWORD_RULES.hasLowercase.test(password))
    errors.push("Al menos una minúscula");
  if (!PASSWORD_RULES.hasNumber.test(password))
    errors.push("Al menos un número");
  if (!PASSWORD_RULES.hasSpecial.test(password))
    errors.push("Al menos un carácter especial (!@#$%...)");
  return { valid: errors.length === 0, errors };
}

function strengthLevel(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= PASSWORD_RULES.minLength) score++;
  if (PASSWORD_RULES.hasUppercase.test(password) && PASSWORD_RULES.hasLowercase.test(password)) score++;
  if (PASSWORD_RULES.hasNumber.test(password)) score++;
  if (PASSWORD_RULES.hasSpecial.test(password)) score++;
  return score;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ password: [], confirm: "" });
  const [success, setSuccess] = useState(false);

  const passwordValidation = validatePassword(password);
  const level = strengthLevel(password);

  function validateForm() {
    const errors = { password: [], confirm: "" };

    if (!password) {
      errors.password = ["La contraseña es obligatoria"];
    } else {
      errors.password = passwordValidation.errors;
    }

    if (!confirm) {
      errors.confirm = "Confirma tu contraseña";
    } else if (password !== confirm) {
      errors.confirm = "Las contraseñas no coinciden";
    }

    setFieldErrors(errors);
    return errors.password.length === 0 && !errors.confirm;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    if (!token) {
      setServerError("El enlace es inválido o está incompleto. Solicita uno nuevo.");
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // ✅ Usando authService (que usa api.js)
      await resetPassword(token, password);
      
      setSuccess(true);
      setTimeout(() => navigate("/login", { state: { fromReset: true } }), 3000);
    } catch (err) {
      setServerError(err.response?.data?.detail || "Ocurrió un error. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rp-page">
        <div className="rp-card rp-card--success">
          <div className="rp-success-icon" aria-hidden="true">✓</div>
          <h2 className="rp-success-title">¡Contraseña actualizada!</h2>
          <p className="rp-success-msg">
            Tu contraseña fue restablecida correctamente.
            <br />
            Serás redirigido al inicio de sesión en unos segundos…
          </p>
          <Link to="/login" className="rp-btn rp-btn--primary">
            Ir al Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rp-page">
      <div className="rp-card">
        <header className="rp-header">
          <p className="rp-brand">MONITORING INNOVATION</p>
          <h1 className="rp-title">Nueva contraseña</h1>
          <p className="rp-subtitle">
            Ingresa y confirma tu nueva contraseña para recuperar el acceso.
          </p>
        </header>

        {serverError && (
          <div className="rp-alert rp-alert--error" role="alert">
            {serverError}
          </div>
        )}

        <form className="rp-form" onSubmit={handleSubmit} noValidate>
          <div className="rp-field">
            <label className="rp-label" htmlFor="password">
              Nueva contraseña
            </label>
            <div className="rp-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`rp-input ${fieldErrors.password.length ? "rp-input--error" : ""}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, password: [] }));
                }}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="rp-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {password && (
              <div className="rp-strength">
                <div className="rp-strength-bar">
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      className="rp-strength-seg"
                      style={{
                        background: seg <= level ? STRENGTH_COLORS[level] : "#e0e0e0",
                        transition: "background 0.3s",
                      }}
                    />
                  ))}
                </div>
                <span className="rp-strength-label" style={{ color: STRENGTH_COLORS[level] }}>
                  {STRENGTH_LABELS[level]}
                </span>
              </div>
            )}

            {fieldErrors.password.length > 0 && (
              <ul className="rp-error-list" role="alert">
                {fieldErrors.password.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="rp-field">
            <label className="rp-label" htmlFor="confirm">
              Confirmar contraseña
            </label>
            <div className="rp-input-wrapper">
              <input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                className={`rp-input ${fieldErrors.confirm ? "rp-input--error" : ""}`}
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, confirm: "" }));
                }}
                placeholder="Repite tu nueva contraseña"
                autoComplete="new-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="rp-eye-btn"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                tabIndex={-1}
              >
                {showConfirm ? "🙈" : "👁"}
              </button>
            </div>
            {fieldErrors.confirm && (
              <p className="rp-error-msg" role="alert">
                {fieldErrors.confirm}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="rp-btn rp-btn--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Actualizando…" : "Restablecer contraseña"}
          </button>

          <p className="rp-back">
            <Link to="/login" className="rp-back-link">
              ← Volver al inicio de sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}