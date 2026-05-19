export default function KPICards({ vehiculos }) {
  return (
    <div className="dash-kpi-container">
      <div className="dash-card">
        <p>Total Aspirantes</p>
        <strong>{vehiculos.length}</strong>
      </div>
    </div>
  );
}