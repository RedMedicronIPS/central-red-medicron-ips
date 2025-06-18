import { HiCalendarDays, HiStar } from "react-icons/hi2";

const EVENTOS = [
  {
    titulo: "Reunión general de funcionarios",
    fecha: "2024-06-25",
    descripcion: "Encuentro institucional para socializar avances y novedades.",
    importante: true,
  },
  {
    titulo: "Inicio nueva política de vacaciones",
    fecha: "2024-07-01",
    descripcion: "Entra en vigencia la nueva política de vacaciones.",
    importante: false,
  },
  {
    titulo: "Auditoría interna",
    fecha: "2024-07-10",
    descripcion: "Revisión de procesos y cumplimiento de estándares.",
    importante: false,
  },
  {
    titulo: "Reunión general de funcionarios 2",
    fecha: "2024-06-25",
    descripcion: "Encuentro institucional para socializar avances y novedades.",
    importante: true,
  },
  {
    titulo: "Inicio nueva política de vacaciones 2",
    fecha: "2024-07-01",
    descripcion: "Entra en vigencia la nueva política de vacaciones.",
    importante: false,
  },
  {
    titulo: "Auditoría interna 2",
    fecha: "2024-07-10",
    descripcion: "Revisión de procesos y cumplimiento de estándares.",
    importante: false,
  },
  // Agrega más eventos aquí
];

export default function CalendarioEventos() {
  // Ordena por fecha descendente y toma los 4 más próximos
  const eventosOrdenados = [...EVENTOS].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  const eventosMostrados = eventosOrdenados.slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
        <HiCalendarDays className="w-8 h-8 text-blue-600 dark:text-blue-300" />
        Calendario de Eventos
      </h2>
      <ol className="relative border-l-4 border-blue-200 dark:border-blue-800 ml-2">
        {eventosMostrados.map((e) => (
          <li
            key={e.titulo + e.fecha}
            className={`mb-8 ml-6 group transition-all duration-300 ${
              e.importante ? "bg-yellow-50 dark:bg-yellow-900/40" : "bg-blue-50/60 dark:bg-blue-900/40"
            } rounded-xl shadow hover:shadow-xl hover:scale-[1.02]`}
          >
            <span className="absolute -left-6 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-4 border-blue-300 dark:border-blue-700 shadow">
              {e.importante ? (
                <HiStar className="w-7 h-7 text-yellow-400 animate-bounce" />
              ) : (
                <HiCalendarDays className="w-7 h-7 text-blue-500" />
              )}
            </span>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${e.importante ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200" : "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"}`}>
                  {new Date(e.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
                {e.importante && (
                  <span className="text-xs font-bold text-yellow-600 dark:text-yellow-300 animate-pulse ml-2">¡Importante!</span>
                )}
              </div>
              <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-1">{e.titulo}</h3>
              <p className="text-gray-700 dark:text-gray-200">{e.descripcion}</p>
            </div>
          </li>
        ))}
      </ol>
      {EVENTOS.length > 4 && (
        <div className="flex justify-end mt-2">
          <a
            href="/eventos"
            className="text-blue-600 dark:text-blue-300 font-semibold hover:underline text-sm"
          >
            Ver todos los eventos
          </a>
        </div>
      )}
    </div>
  );
}