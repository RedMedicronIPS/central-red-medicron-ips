const EVENTOS = [
  { fecha: "2024-06-25", evento: "Reunión general de funcionarios" },
  { fecha: "2024-07-01", evento: "Inicio nueva política de vacaciones" },
  { fecha: "2024-07-10", evento: "Auditoría interna" },
];

export default function CalendarioEventos() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Próximos Eventos</h2>
      <ul className="space-y-2">
        {EVENTOS.map((e) => (
          <li key={e.fecha} className="flex items-center gap-3">
            <span className="font-mono text-blue-700 dark:text-blue-300">{e.fecha}</span>
            <span className="text-gray-700 dark:text-gray-200">{e.evento}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}