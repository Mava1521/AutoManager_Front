import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Importaciones estáticas para los componentes que siempre se usan al inicio
import LoginPage from "../features/auth/pages/LoginPage";

// Lazy loading para el resto: se cargan en "chunks" bajo demanda
const RecoveryPage = lazy(() => import("../features/auth/pages/RecoveryPage"));
const ResetPasswordPage = lazy(() => import("../features/auth/pages/ResetPasswordPage"));
const SignupPage = lazy(() => import("../features/auth/pages/SignupPage"));
const WelcomePage = lazy(() => import("../features/dashboard/pages/WelcomePage"));
const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage"));

// Un pequeño componente de carga para envolver los lazy
const LoadingFallback = () => <div className="loading-spinner">Cargando...</div>;

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas Públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recovery" element={<RecoveryPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Rutas Privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<WelcomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}