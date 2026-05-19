import { useState } from "react";

export const useVehiculoForm = () => {
  const [form, setForm] = useState({ marca: "", sucursal: "", aspirante: "", status: "Pendiente" });
  const [mode, setMode] = useState("view");
  const [editingId, setEditingId] = useState(null);

  const setEditMode = (vehiculo) => {
    setForm(vehiculo);
    setEditingId(vehiculo.id);
    setMode("edit");
  };

  const setCreateMode = () => {
    setForm({ marca: "", sucursal: "", aspirante: "", status: "Pendiente" });
    setEditingId(null);
    setMode("create");
  };

  return { form, setForm, mode, setMode, editingId, setEditMode, setCreateMode };
};