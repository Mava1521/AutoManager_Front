import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import AppRoutes from "./routes/AppRoutes";
import './index.css'; // Asegúrate de apuntar a tu hoja de estilos principal

/**
 * App Component
 * Punto de entrada: Definición de proveedores de alto nivel.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}