import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../assets/images/Imagologo_motion.svg";
import phoneImg from "../../../assets/images/Telefono-01.png";
import "../../../styles/WelcomePage.css";

// --- Subcomponentes ---
const WelcomeHeader = ({ onLogout }) => (
  <header className="welcome-header">
    <img src={logo} alt="Manager logo" className="welcome-logo" />
    <button className="welcome-logout-btn" onClick={onLogout}>Cerrar sesión</button>
  </header>
);

const FooterLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer" className="welcome-footer-link">
    {children}
  </a>
);

// --- Componente Principal ---
export default function WelcomePage() {
  const navigate = useNavigate();
  // Corregido: Extraemos 'logout' (que es como se llama en tu AuthContext)
  const { logout, isAdmin } = useAuth();

  // Función para manejar el logout y redirección
  const handleLogout = () => {
    logout(); 
    navigate("/login");
  };

  return (
    <div className="welcome-page">
      {/* Pasamos la función correcta */}
      <WelcomeHeader onLogout={handleLogout} />

      <div className="welcome-circles" aria-hidden="true">
        <div className="welcome-circle" />
      </div>

      <main className="welcome-main">
        <img src={phoneImg} alt="" className="welcome-phone" aria-hidden="true" />

        <div className="welcome-text">
          <h1 className="welcome-title">
            <span className="welcome-line1">BIENVENIDO A</span>
            <span className="welcome-line2">MONITORING INNOVATION</span>
          </h1>

          <button className="welcome-dashboard-btn" onClick={() => navigate("/dashboard")}>
            {isAdmin ? "Ir al Panel de Gestión →" : "Ver Vehículos →"}
          </button>
        </div>
      </main>

      <footer className="welcome-footer">
        <FooterLink href="https://monitoringinnovation.com/">MONITORINGINNOVATION</FooterLink>
        <FooterLink href="https://gpscontrol.co/">GPS CONTROL</FooterLink>
        <FooterLink href="https://github.com/Mava1521/AutoManager_Front">Link repo front</FooterLink>
        <FooterLink href="https://github.com/Mava1521/AutoManager_Back">Link repo back</FooterLink>
      </footer>
    </div>
  );
}