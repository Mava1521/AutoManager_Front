import api from "../../../services/api";

const BASE_URL = "/vehiculos";

/**
 * Servicio de Vehículos
 */

export const getVehiculos = async () => {
  const { data } = await api.get(BASE_URL);
  return data;
};

export const getVehiculo = async (id) => {
  const { data } = await api.get(`${BASE_URL}/${id}`);
  return data;
};

export const createVehiculo = async (data) => {
  const { data: response } = await api.post(BASE_URL, data);
  return response;
};

export const updateVehiculo = async (id, data) => {
  const { data: response } = await api.put(`${BASE_URL}/${id}`, data);
  return response;
};

export const deleteVehiculo = async (id) => {
  const { data } = await api.delete(`${BASE_URL}/${id}`);
  return data;
};

export const updateVehiculoStatus = async (id, status) => {
  const { data } = await api.patch(`${BASE_URL}/${id}/status`, { status });
  return data;
};

/**
 * En lugar de variables globales, calculamos los únicos bajo demanda.
 * Si esto se vuelve lento, la solución profesional es implementar React Query.
 */
export const getUniqueMarcas = async () => {
  const vehiculos = await getVehiculos();
  return [...new Set(vehiculos.map((v) => v.marca))];
};

export const getUniqueSucursales = async () => {
  const vehiculos = await getVehiculos();
  return [...new Set(vehiculos.map((v) => v.sucursal))];
};