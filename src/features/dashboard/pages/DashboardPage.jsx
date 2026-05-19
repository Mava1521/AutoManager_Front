// src/features/dashboard/pages/DashboardPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  getVehiculos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
  updateVehiculoStatus,
  getUniqueMarcas,
  getUniqueSucursales,
} from "../services/vehiculosService";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";
import "../../../styles/DashboardPage.css";

import iconEdit   from "../../../assets/images/Icon_editar1.svg";
import iconDelete from "../../../assets/images/Icon_eliminar1.svg";
import iconCreate from "../../../assets/images/Icon_crear.svg";
import logoMotion from "../../../assets/images/Imagologotipo_motion.svg";

import iconCar      from "../../../assets/images/Icon_vehiculo1.svg";     
import iconLocation from "../../../assets/images/Icon_puntoubicacion1.svg"; 
import iconUser     from "../../../assets/images/Icon_persona1.svg";     
import iconCheckRound from "../../../assets/images/Icon_confirmar.svg"; 
import iconXRound     from "../../../assets/images/Icon_cancelar.svg";    

const EMPTY_FORM = { marca: "", sucursal: "", aspirante: "", status: "Pendiente" };

const STATUS_OPTIONS = [
  { value: "Pendiente",   label: "Pendiente",   color: "#F59E0B", bgColor: "#FEF3C7" },
  { value: "En Revisión", label: "En Revisión", color: "#3B82F6", bgColor: "#DBEAFE" },
  { value: "Aprobado",    label: "Aprobado",    color: "#10B981", bgColor: "#D1FAE5" },
  { value: "Rechazado",   label: "Rechazado",   color: "#EF4444", bgColor: "#FEE2E2" },
];

/* ── Iconos SVG inline profesionales para exportación ───────────────────── */
const IconCSV = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconPDF = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <path d="M9 15v-4h2a2 2 0 0 1 0 4H9z"/>
    <line x1="14" y1="11" x2="14" y2="15"/>
    <line x1="17" y1="11" x2="17" y2="15"/>
    <line x1="14" y1="13" x2="17" y2="13"/>
  </svg>
);

/* ── Estilos base reutilizables ─────────────────────────────────────────── */
const INPUT_STYLE = {
  width: "100%",
  padding: "0.45rem 1rem",
  marginBottom: "0.65rem",
  border: "1px solid #e8e8e8",
  borderRadius: "20px",
  fontSize: "0.85rem",
  outline: "none",
  boxSizing: "border-box",
  background: "#fafafa",
  fontFamily: "Montserrat, sans-serif",
  color: "#333",
};

const BTN_EXPORT = (color) => ({
  padding: "0.28rem 0.8rem",
  borderRadius: "20px",
  border: `1.5px solid ${color}`,
  background: "transparent",
  color,
  cursor: "pointer",
  fontSize: "0.76rem",
  fontWeight: 600,
  fontFamily: "Montserrat, sans-serif",
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
  transition: "background 0.18s, color 0.18s",
});

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();

  const [vehiculos, setVehiculos]               = useState([]);
  const [marcasOptions, setMarcasOptions]       = useState([]);
  const [sucursalesOptions, setSucursalesOptions] = useState([]);
  const [form, setForm]                         = useState(EMPTY_FORM);
  const [editingId, setEditingId]               = useState(null);
  const [mode, setMode]                         = useState("view");
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState("");
  const [search, setSearch]                     = useState("");
  const [statusFilter, setStatusFilter]         = useState("Todos");

  useEffect(() => {
    fetchVehiculos();
    fetchOptions();
  }, [isAdmin]);

  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      const data = await getVehiculos();
      setVehiculos(data);
    } catch (err) {
      setError("Error al cargar los vehículos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [marcas, sucursales] = await Promise.all([
        getUniqueMarcas(),
        getUniqueSucursales(),
      ]);
      setMarcasOptions(marcas);
      setSucursalesOptions(sucursales);
    } catch (err) {
      console.error("Error fetching options:", err);
    }
  };

  const filtered = useMemo(() => {
    let result = [...vehiculos];
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (v) =>
          v.marca.toLowerCase().includes(q) ||
          v.sucursal.toLowerCase().includes(q) ||
          v.aspirante.toLowerCase().includes(q)
      );
    }
    if (isAdmin && statusFilter !== "Todos") {
      result = result.filter((v) => v.status === statusFilter);
    }
    return result;
  }, [search, statusFilter, vehiculos, isAdmin]);

  const kpis = useMemo(() => {
    if (!isAdmin) return null;
    const total = vehiculos.length;

    const sucursalCount = {};
    vehiculos.forEach((v) => { sucursalCount[v.sucursal] = (sucursalCount[v.sucursal] || 0) + 1; });
    const topSucursal = Object.entries(sucursalCount).sort((a, b) => b[1] - a[1])[0];

    const marcaCount = {};
    vehiculos.forEach((v) => { marcaCount[v.marca] = (marcaCount[v.marca] || 0) + 1; });
    const topMarca = Object.entries(marcaCount).sort((a, b) => b[1] - a[1])[0];

    const statusCount = {};
    vehiculos.forEach((v) => { statusCount[v.status] = (statusCount[v.status] || 0) + 1; });
    const topStatus = Object.entries(statusCount).sort((a, b) => b[1] - a[1])[0];

    return { total, topSucursal, topMarca, topStatus };
  }, [vehiculos, isAdmin]);

  const isFormValid = useMemo(
    () => form.marca.trim() && form.sucursal.trim() && form.aspirante.trim(),
    [form]
  );

  const handleChange    = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };
  const handleNewClick  = () => { if (!isAdmin) return; setForm(EMPTY_FORM); setEditingId(null); setMode("create"); };
  const handleEditClick = (v) => { if (!isAdmin) return; setForm({ marca: v.marca, sucursal: v.sucursal, aspirante: v.aspirante, status: v.status }); setEditingId(v.id); setMode("edit"); };
  const handleCancel    = () => { setForm(EMPTY_FORM); setEditingId(null); setMode("view"); };
  const handleLogout    = () => { logout(); navigate("/login"); };
  const handleExportCSV = () => exportToCSV(filtered, `vehiculos_${new Date().toISOString().split("T")[0]}`);
  const handleExportPDF = () => exportToPDF(filtered, `vehiculos_${new Date().toISOString().split("T")[0]}`);

  const handleStatusChange = async (id, newStatus) => {
    if (!isAdmin) return;
    try {
      await updateVehiculoStatus(id, newStatus);
      setVehiculos(vehiculos.map((v) => (v.id === id ? { ...v, status: newStatus } : v)));
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  const handleSave = async () => {
    if (!isFormValid) { setError("Completa todos los campos."); return; }
    try {
      setLoading(true);
      if (mode === "create") await createVehiculo(form);
      else await updateVehiculo(editingId, form);
      await fetchVehiculos();
      handleCancel();
    } catch (err) {
      setError(err.response?.data?.detail || "Error al guardar.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("¿Eliminar este registro?")) return;
    try {
      setLoading(true);
      await deleteVehiculo(id);
      await fetchVehiculos();
      if (editingId === id) handleCancel();
    } catch {
      setError("Error al eliminar.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) =>
    STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];

  /* ─── RENDER ──────────────────────────────────────────────────────────── */
  return (
    <div className="dash-page">

      {/* ── Topbar ── */}
      <header className="dash-topbar">
        <button className="dash-back-btn" onClick={() => navigate("/home")}>
          ← Volver
        </button>
        <button className="dash-logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      {/* ── Panel izquierdo: formulario (solo admin) ── */}
      {isAdmin && (
        <aside className="dash-form-panel">

          {/*
            Botón "+" sin círculo visible:
            El CSS de .dash-add-btn ya tiene border redondeado y background blanco,
            aquí lo sobreescribimos para que sea solo el ícono, sin borde ni fondo.
          */}
          <button
            onClick={handleNewClick}
            title="Nuevo registro"
            style={{
              position: "absolute",
              top: "-14px",
              left: "-14px",
              width: "30px",
              height: "30px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={iconCreate} alt="Crear nuevo" width="24" height="24" />
          </button>

          {error && <p className="dash-form-error">{error}</p>}

          <div className="dash-form-field">
            <input
              name="marca"
              placeholder="Marca"
              value={form.marca}
              onChange={handleChange}
              disabled={mode === "view"}
              list="marcasList"
              className="dash-input"
              style={INPUT_STYLE}
            />
          </div>
          <datalist id="marcasList">
            {marcasOptions.map((m) => <option key={m} value={m} />)}
          </datalist>

          <div className="dash-form-field">
            <input
              name="sucursal"
              placeholder="Sucursal"
              value={form.sucursal}
              onChange={handleChange}
              disabled={mode === "view"}
              list="sucursalesList"
              className="dash-input"
              style={INPUT_STYLE}
            />
          </div>
          <datalist id="sucursalesList">
            {sucursalesOptions.map((s) => <option key={s} value={s} />)}
          </datalist>

          <div className="dash-form-field">
            <input
              name="aspirante"
              placeholder="Aspirante"
              value={form.aspirante}
              onChange={handleChange}
              disabled={mode === "view"}
              className="dash-input"
              style={INPUT_STYLE}
            />
          </div>

          {mode !== "view" && (
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="dash-input"
              style={{ ...INPUT_STYLE, cursor: "pointer" }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          {mode !== "view" && (
            <div className="dash-form-actions">
              <button className="dash-btn dash-btn--cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button
                className="dash-btn dash-btn--primary"
                onClick={handleSave}
                disabled={loading || !isFormValid}
              >
                {loading ? "..." : mode === "create" ? "Crear" : "Actualizar"}
              </button>
            </div>
          )}
        </aside>
      )}

      {/* ── Panel derecho: KPIs + tabla ── */}
      <main className="dash-table-panel">

        {/* KPIs sutiles */}
        {isAdmin && kpis && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0.75rem",
              marginBottom: "1.25rem",
            }}
          >
            {[
              { label: "Total Aspirantes",    value: kpis.total,        accent: "#00249C" },
              { label: "Sucursal más activa", value: kpis.topSucursal ? `${kpis.topSucursal[0]} (${kpis.topSucursal[1]})` : "-", accent: "#40CEE4" },
              { label: "Marca líder",         value: kpis.topMarca    ? `${kpis.topMarca[0]} (${kpis.topMarca[1]})`        : "-", accent: "#C6007E" },
              { label: "Estado más común",    value: kpis.topStatus   ? `${kpis.topStatus[0]} (${kpis.topStatus[1]})`      : "-", accent: "#10B981" },
            ].map(({ label, value, accent }) => (
              <div
                key={label}
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  padding: "0.75rem 1rem",
                  border: "1px solid #f0f0f0",
                  borderLeft: `3px solid ${accent}`,
                }}
              >
                <p style={{ fontSize: "0.65rem", color: "#999", margin: "0 0 0.2rem", fontFamily: "Montserrat, sans-serif" }}>{label}</p>
                <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#222", margin: 0, fontFamily: "Montserrat, sans-serif" }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Buscador + filtros + exportar */}
        <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>

          {/* Buscador */}
          <div className="dash-search-wrapper" style={{ flex: 1, maxWidth: "none" }}>
            <svg className="dash-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por marca, sucursal o aspirante..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="dash-search-input"
            />
            {search && (
              <button className="dash-search-clear" onClick={() => setSearch("")} title="Limpiar">✕</button>
            )}
          </div>

          {/* Filtros de estado */}
          {isAdmin && (
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {["Todos", ...STATUS_OPTIONS.map((o) => o.value)].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: "0.28rem 0.7rem",
                    borderRadius: "20px",
                    border: `1.5px solid ${statusFilter === s ? "#c6007e" : "#e0e0e0"}`,
                    background: statusFilter === s ? "#c6007e" : "white",
                    color: statusFilter === s ? "white" : "#666",
                    cursor: "pointer",
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    fontFamily: "Montserrat, sans-serif",
                    transition: "all 0.18s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Botones exportar con iconos SVG profesionales */}
          {isAdmin && (
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button onClick={handleExportCSV} style={BTN_EXPORT("#40CEE4")} title="Exportar a CSV">
                <IconCSV /> CSV
              </button>
              <button onClick={handleExportPDF} style={BTN_EXPORT("#C6007E")} title="Exportar a PDF">
                <IconPDF /> PDF
              </button>
            </div>
          )}
        </div>

        {/* Tabla principal */}
        <div style={{ borderRadius: "10px", overflow: "auto", border: "1px solid #f0f0f0" }}>
          <table className="dash-table" style={{ minWidth: "480px" }}>
            <thead>
              <tr>
                <th>Marca</th>
                <th>Sucursal</th>
                <th>Aspirante</th>
                {isAdmin && <th>Estado</th>}
                {isAdmin && <th style={{ textAlign: "center", width: "90px" }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="dash-table-empty" colSpan={isAdmin ? 5 : 3}>Cargando...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="dash-table-empty" colSpan={isAdmin ? 5 : 3}>
                    {search ? `No hay resultados para "${search}"` : "No hay registros."}
                  </td>
                </tr>
              ) : (
                filtered.map((v) => {
                  const st = getStatusStyle(v.status);
                  return (
                    <tr key={v.id} className={editingId === v.id ? "dash-row--active" : ""}>
                      <td>{v.marca}</td>
                      <td>{v.sucursal}</td>
                      <td>{v.aspirante}</td>

                      {isAdmin && (
                        <td>
                          <select
                            value={v.status}
                            onChange={(e) => handleStatusChange(v.id, e.target.value)}
                            style={{
                              padding: "3px 8px",
                              borderRadius: "20px",
                              border: `1px solid ${st.color}`,
                              background: st.bgColor,
                              color: st.color,
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              outline: "none",
                              fontFamily: "Montserrat, sans-serif",
                            }}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </td>
                      )}

                      {isAdmin && (
                        <td className="dash-row-actions">
                          <button
                            className="dash-row-btn dash-row-btn--edit"
                            onClick={() => handleEditClick(v)}
                            title="Editar"
                          >
                            <img src={iconEdit} alt="Editar" width="16" height="16" />
                          </button>
                          <button
                            className="dash-row-btn dash-row-btn--delete"
                            onClick={() => handleDelete(v.id)}
                            title="Eliminar"
                          >
                            <img src={iconDelete} alt="Eliminar" width="16" height="16" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── Footer con logo Motion ── */}
      <footer className="dash-footer">
        <img
          src={logoMotion}
          alt="Motion"
          className="dash-footer-logo"
        />
      </footer>

    </div>
  );
}