import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useVehiculoForm } from "../hooks/useVehiculoForm";
import * as vehiculoService from "../services/vehiculosService";


import VehiculoForm from "../components/VehiculoForm";
import VehiculoTable from "../components/VehiculoTable";

export default function HomePage() {
  const { isAdmin } = useAuth();
  const { form, setForm, mode, setEditMode, setCreateMode, setMode, editingId } = useVehiculoForm();
  
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchVehiculos(); }, []);

  const fetchVehiculos = async () => {
    setLoading(true);
    try {
      const data = await vehiculoService.getVehiculos();
      setVehiculos(data);
    } catch {
      setError("Error al cargar.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      mode === "create" 
        ? await vehiculoService.createVehiculo(form) 
        : await vehiculoService.updateVehiculo(editingId, form);
      await fetchVehiculos();
      setMode("view");
    } catch {
      setError("Error al guardar.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;
    await vehiculoService.deleteVehiculo(id);
    fetchVehiculos();
  };

  return (
    <div className="dash-page">
      {/* 1. Formulario extraído */}
      {isAdmin && mode !== "view" && (
        <VehiculoForm 
          mode={mode} 
          data={form} 
          setForm={setForm} 
          onSave={handleSave} 
          onCancel={() => setMode("view")} 
        />
      )}

      {/* 2. Tabla extraída */}
      <section className="dash-table-panel">
        {error && <p className="dash-form-error">{error}</p>}
        <VehiculoTable 
          data={vehiculos} 
          loading={loading}
          isAdmin={isAdmin}
          onEdit={setEditMode}
          onDelete={handleDelete}
        />
      </section>

      {/* 3. Footer constante */}
      <footer className="dash-footer">...</footer>
    </div>
  );
}