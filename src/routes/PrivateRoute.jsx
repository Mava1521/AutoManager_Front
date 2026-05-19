import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PrivateRoute protege rutas privadas.
 * @param {boolean} adminOnly 
 */
export default function PrivateRoute({ adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    // Aquí podrías usar tu componente <Spinner /> global
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="spinner">Cargando sesión...</div>
      </div>
    );
  }

  // 1. Si no está logueado, redirige al login guardando la ubicación actual
  // para poder retornar ahí después del login exitoso.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Si la ruta requiere ser admin y el usuario no lo es, redirige al home
  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // 3. Todo bien, renderiza la ruta hija
  return <Outlet />;
}