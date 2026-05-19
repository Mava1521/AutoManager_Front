import api from './api'; // Asumiendo que esta es tu instancia de axios configurada

/**
 * Envía una solicitud de soporte al servidor real
 * @param {Object} formData - Los datos del mensaje (nombre, email, mensaje, etc.)
 */
export const sendSupportContact = async (formData) => {
  try {
    // La URL debe coincidir con tu endpoint de backend
    const response = await api.post('/support/contact', formData);
    return response.data;
  } catch (error) {
    // Aquí gestionamos el error real del servidor
    console.error("Error al enviar mensaje de soporte:", error.response?.data || error.message);
    throw error.response?.data || new Error("No se pudo contactar con el servidor");
  }
};