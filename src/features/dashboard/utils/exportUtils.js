/**
 * Utilidades de Exportación
 */

// Helper interno para limpiar strings y evitar errores en CSV
const formatCsvValue = (val) => `"${String(val).replace(/"/g, '""')}"`;

export const exportToCSV = (data, filename) => {
  if (!data?.length) return alert("No hay datos para exportar");

  const headers = ["Marca", "Sucursal", "Aspirante", "Estado"];
  const csvContent = [
    headers.join(","),
    ...data.map(row => [row.marca, row.sucursal, row.aspirante, row.status].map(formatCsvValue).join(","))
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Creamos un link temporal y lo disparamos
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  
  URL.revokeObjectURL(link.href);
};

export const exportToPDF = async (data, filename) => {
  if (!data?.length) return alert("No hay datos para exportar");

  try {
    // Lazy loading optimizado
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ]);
    
    const doc = new jsPDF();
    
    // Header con estilo básico
    doc.setFontSize(16);
    doc.text(`Reporte de Vehículos`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 20);
    
    autoTable(doc, {
      head: [["Marca", "Sucursal", "Aspirante", "Estado"]],
      body: data.map(r => [r.marca, r.sucursal, r.aspirante, r.status]),
      startY: 25,
      theme: 'striped',
      headStyles: { fillColor: [198, 0, 126] }, // Tu color corporativo
    });
    
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error al generar PDF:", error);
    alert("Hubo un problema al generar el archivo PDF.");
  }
};