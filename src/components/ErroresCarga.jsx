export default function ErroresCarga({ errores }) {

  if (!errores || errores.length === 0) return null;

  return (
    <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">

      <div className="flex justify-between items-center mb-3">
        <h3 className="text-red-700 font-semibold">
          ⚠️ Se detectaron {errores.length} errores en la carga
        </h3>
      </div>

      <div className="max-h-60 overflow-y-auto">

        <table className="w-full text-sm">
          <thead className="text-left text-red-800 border-b">
            <tr>
              <th className="py-1">RUT</th>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Motivo</th>
            </tr>
          </thead>

          <tbody>
            {errores.map((e, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-1">{e.rut}</td>
                <td>{e.nombre}</td>
                <td>{e.fecha}</td>
                <td className="text-red-600 font-medium">
                  {e.motivo}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}