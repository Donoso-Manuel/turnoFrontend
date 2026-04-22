export default function ErroresCarga({ errores }) {

  if (!errores || errores.length === 0) return null;

  return (
<div className="mt-6 rounded-2xl p-[1px] bg-gradient-to-r from-red-400 to-red-600 shadow-lg">

  <div className="bg-white rounded-2xl p-5">

    <div className="flex justify-between items-center mb-4">
      <h3 className="text-red-600 font-semibold text-lg flex items-center gap-2">
        ⚠️ Se detectaron {errores.length} errores
      </h3>
    </div>

    <div className="max-h-60 overflow-y-auto">

      <table className="w-full text-sm">
        <thead className="text-left text-gray-500 border-b">
          <tr>
            <th className="py-2">RUT</th>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Motivo</th>
          </tr>
        </thead>

        <tbody>
          {errores.map((e, i) => (
            <tr
              key={i}
              className="border-b last:border-0 hover:bg-red-50 transition"
            >
              <td className="py-2 font-medium">{e.rut}</td>
              <td>{e.nombre}</td>
              <td className="text-gray-500">{e.fecha}</td>
              <td className="text-red-500 font-semibold">
                {e.motivo}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>

  </div>
</div>
);
}