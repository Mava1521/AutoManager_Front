import { useState, useEffect, useMemo } from "react";
import * as service from "../services/vehiculosService";

export const useVehiculoDashboard = (isAdmin) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [form, setForm] = useState({ marca: "", sucursal: "", aspirante: "", status: "Pendiente" });
  const [mode, setMode] = useState("view");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await service.getVehiculos();
      setVehiculos(data);
    } catch (e) { setError("Error al cargar"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    let res = [...vehiculos];
    if (search) res = res.filter(v => v.aspirante.toLowerCase().includes(search.toLowerCase()));
    if (isAdmin && statusFilter !== "Todos") res = res.filter(v => v.status === statusFilter);
    return res;
  }, [search, statusFilter, vehiculos, isAdmin]);

  return { vehiculos, loading, search, setSearch, statusFilter, setStatusFilter, filtered, form, setForm, mode, setMode, editingId, setEditingId, error, setError, fetchData };
};