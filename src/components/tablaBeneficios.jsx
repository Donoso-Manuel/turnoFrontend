export default function TablaBeneficios({ data, seleccionados, setSeleccionados }) {

  const toggle = (id) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter(i => i !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  return (
<table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">

  <thead className="bg-gray-100 text-gray-700">
    <tr>
      <th className="p-2"></th>
      <th className="p-2 text-left">RUT</th>
      <th className="p-2 text-left">Nombre</th>
      <th className="p-2 text-left">Fecha</th>
      <th className="p-2 text-left">Estado</th>
    </tr>
  </thead>

  <tbody>
    {data.map(b => (
      <tr key={b.id} className="border-t hover:bg-gray-50 transition">

        <td className="p-2 text-center">
          <input
            type="checkbox"
            disabled={b.estado?.toUpperCase() !== 'PENDIENTE'}
            checked={seleccionados.includes(b.id)}
            onChange={() => toggle(b.id)}
          />
        </td>

        <td className="p-2">{b.rut}</td>
        <td className="p-2">{b.nombre}</td>

        <td className="p-2">
          {new Date(b.fecha_generacion).toLocaleDateString('es-CL')}
        </td>

        <td className="p-2">
          <span className={
            b.estado === 'PENDIENTE'
              ? 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs'
              : 'bg-green-100 text-green-700 px-2 py-1 rounded text-xs'
          }>
            {b.estado}
          </span>
        </td>

      </tr>
    ))}
  </tbody>

</table>
  );
}