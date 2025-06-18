const NOTICIAS = [
  {
    titulo: "Nueva política de vacaciones",
    fecha: "2024-06-20",
    resumen: "A partir de julio, entra en vigor la nueva política de vacaciones para todos los funcionarios.",
  },
  {
    titulo: "Capacitación obligatoria",
    fecha: "2024-06-15",
    resumen: "Recuerda inscribirte a la capacitación sobre atención humanizada antes del 30 de junio.",
  },
];

export default function NoticiasComunicados() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Noticias y Comunicados</h2>
      <ul className="space-y-4">
        {NOTICIAS.map((n) => (
          <li key={n.titulo}>
            <h3 className="font-semibold text-blue-700 dark:text-blue-300">{n.titulo}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{n.fecha}</p>
            <p className="text-gray-700 dark:text-gray-200">{n.resumen}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}