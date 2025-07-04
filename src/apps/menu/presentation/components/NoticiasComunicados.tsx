import { HiSpeakerphone, HiExclamationCircle } from "react-icons/hi";
import { useState } from "react";

const NOTICIAS = [
  {
    titulo: "Nueva política de vacaciones",
    fecha: "2024-06-20",
    resumen: "A partir de julio, entra en vigor la nueva política de vacaciones para todos los funcionarios.",
    link: "#",
    urgente: false,
  },
  {
    titulo: "Capacitación obligatoria",
    fecha: "2024-06-15",
    resumen: "Recuerda inscribirte a la capacitación sobre atención humanizada antes del 30 de junio.",
    link: "#",
    urgente: true,
  },
  // Agrega más noticias aquí
];

export default function NoticiasComunicados() {
  // Ordena por fecha descendente y toma las 4 más recientes
  const noticiasOrdenadas = [...NOTICIAS].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  const noticiasMostradas = noticiasOrdenadas.slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
        <HiSpeakerphone className="w-8 h-8 text-blue-600 dark:text-blue-300 animate-pulse" />
        Noticias y Comunicados
      </h2>
      <ol className="relative border-l-4 border-blue-200 dark:border-blue-800 ml-2">
        {noticiasMostradas.map((n) => (
          <li
            key={n.titulo}
            className={`mb-8 ml-6 group transition-all duration-300 ${
              n.urgente ? "bg-red-50 dark:bg-red-900/40" : "bg-blue-50/60 dark:bg-blue-900/40"
            } rounded-xl shadow hover:shadow-xl hover:scale-[1.02]`}
          >
            <span className="absolute -left-6 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-4 border-blue-300 dark:border-blue-700 shadow">
              {n.urgente ? (
                <HiExclamationCircle className="w-7 h-7 text-red-500 animate-bounce" />
              ) : (
                <HiSpeakerphone className="w-7 h-7 text-blue-500" />
              )}
            </span>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${n.urgente ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200" : "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"}`}>
                  {new Date(n.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
                {n.urgente && (
                  <span className="text-xs font-bold text-red-600 dark:text-red-300 animate-pulse ml-2">¡Urgente!</span>
                )}
              </div>
              <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-1">{n.titulo}</h3>
              <p className="text-gray-700 dark:text-gray-200 mb-2">{n.resumen}</p>
              {n.link && (
                <a
                  href={n.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-300 text-sm font-medium hover:underline"
                >
                  Ver más
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
      {NOTICIAS.length > 4 && (
        <div className="flex justify-end mt-2">
          <a
            href="/noticias"
            className="text-blue-600 dark:text-blue-300 font-semibold hover:underline text-sm"
          >
            Ver todas las noticias
          </a>
        </div>
      )}
    </div>
  );
}