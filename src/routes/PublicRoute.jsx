import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Mostrar estado de carga consistente con PrivateRoute
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="spinner">Validando sesión...</div>
      </div>
    );
  }

  // 2. Si el usuario ya está autenticado:
  // Si venía de una ruta privada (guardada en location.state), lo devolvemos allí.
  // Si no, lo mandamos al /home por defecto.
  const from = location.state?.from?.pathname || "/home";

  return !user ? <Outlet /> : <Navigate to={from} replace />;
}