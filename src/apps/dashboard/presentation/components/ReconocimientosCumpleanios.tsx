const RECONOCIMIENTOS = [
  { nombre: "Laura Gómez", motivo: "Mejor desempeño en atención al usuario" },
];
const CUMPLEANIOS = [
  { nombre: "Carlos Ruiz", fecha: "2024-06-21" },
];

export default function ReconocimientosCumpleanios() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Reconocimientos</h2>
        <ul className="space-y-2">
          {RECONOCIMIENTOS.map((r) => (
            <li key={r.nombre}>
              <span className="font-semibold text-blue-700 dark:text-blue-300">{r.nombre}</span>
              <span className="ml-2 text-gray-700 dark:text-gray-200">{r.motivo}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Cumpleaños del mes</h2>
        <ul className="space-y-2">
          {CUMPLEANIOS.map((c) => (
            <li key={c.nombre}>
              <span className="font-semibold text-blue-700 dark:text-blue-300">{c.nombre}</span>
              <span className="ml-2 text-gray-700 dark:text-gray-200">{c.fecha}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}