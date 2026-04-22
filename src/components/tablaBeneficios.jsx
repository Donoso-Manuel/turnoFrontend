export default function TablaBeneficios({ data, seleccionados, setSeleccionados }) {

  const toggle = (id) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter(i => i !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  return (
<table className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">

  <thead className="bg-gray-800 text-gray-300 text-sm">
  <tr>

    {/* SELECT ALL */}
    <th className="p-3 text-center">
      <input
        type="checkbox"
        checked={
          data.length > 0 &&
          data
            .filter(b => b.estado?.toUpperCase() === 'PENDIENTE')
            .every(b => seleccionados.includes(b.id))
        }
        onChange={(e) => {
          if (e.target.checked) {
            const pendientes = data
              .filter(b => b.estado?.toUpperCase() === 'PENDIENTE')
              .map(b => b.id);

            setSeleccionados(pendientes);
          } else {
            setSeleccionados([]);
          }
        }}
        className="w-4 h-4 accent-indigo-500 cursor-pointer"
      />
    </th>

    <th className="p-3 text-left">RUT</th>
    <th className="p-3 text-left">Nombre</th>
    <th className="p-3 text-left">Fecha</th>
    <th className="p-3 text-left">Estado</th>
  </tr>
</thead>

  <tbody className="text-sm bg-white">
    {data.map(b => (
      <tr
        key={b.id}
        className="border-t hover:bg-gray-50 hover:scale-[1.01] transition-all"
      >

        <td className="p-3 text-center">
          <input
            type="checkbox"
            disabled={b.estado?.toUpperCase() !== 'PENDIENTE'}
            checked={seleccionados.includes(b.id)}
            onChange={() => toggle(b.id)}
            className="w-4 h-4 accent-indigo-500"
          />
        </td>

        <td className="p-3 font-medium">{b.rut}</td>
        <td className="p-3 text-gray-700">{b.nombre}</td>

        <td className="p-3 text-gray-500">
          {new Date(b.fecha_generacion).toLocaleDateString('es-CL')}
        </td>

        <td className="p-3">
          <span className={
            b.estado === 'pendiente'
              ? 'bg-yellow-200/70 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold'
              : 'bg-green-200/70 text-green-800 px-3 py-1 rounded-full text-xs font-semibold'
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