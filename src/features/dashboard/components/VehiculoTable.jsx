export default function VehiculoTable({ data }) {
  return (
    <table className="dash-table">
      <thead>
        <tr><th>Aspirante</th><th>Vehículo</th><th>Estado</th></tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.aspirante}</td>
            <td>{item.marca}</td>
            <td>{item.estado}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}