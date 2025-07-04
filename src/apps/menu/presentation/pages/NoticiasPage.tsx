import { useEffect, useState } from "react";
import { HiSpeakerphone } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useAuthContext } from "../../../auth/presentation/context/AuthContext";

type Noticia = {
  id: string;
  titulo: string;
  fecha: string;
  resumen: string;
  urgente?: boolean;
  link?: string;
};

export default function NoticiasPage() {
  const { user } = useAuthContext();
  const isAdmin =
    user?.role === "admin" ||
    (typeof user?.role === "object" && "name" in user.role && user.role.name === "admin");
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de fetch, reemplaza por fetch real a /api/dashboard/noticias
    setLoading(true);
    setTimeout(() => {
      setNoticias([
        {
          id: "1",
          titulo: "Nueva política de vacaciones",
          fecha: "2024-06-20",
          resumen: "A partir de julio, entra en vigor la nueva política de vacaciones para todos los funcionarios.",
        },
        {
          id: "2",
          titulo: "Capacitación obligatoria",
          fecha: "2024-06-15",
          resumen: "Recuerda inscribirte a la capacitación sobre atención humanizada antes del 30 de junio.",
          urgente: true,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 min-h-[60vh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <HiSpeakerphone className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          Noticias Institucionales
        </h1>
        {isAdmin && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            // onClick={...} // Aquí abrirías el modal o formulario de creación
          >
            <HiPlus className="w-5 h-5" />
            Agregar noticia
          </button>
        )}
      </div>
      {loading ? (
        <div className="text-center text-blue-600 dark:text-blue-300">Cargando noticias...</div>
      ) : noticias.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">No hay noticias registradas.</div>
      ) : (
        <ol className="relative border-l-4 border-blue-200 dark:border-blue-800 ml-2">
          {noticias.map((n) => (
            <li
              key={n.id}
              className={`mb-8 ml-6 group transition-all duration-300 ${
                n.urgente ? "bg-red-50 dark:bg-red-900/40" : "bg-blue-50/60 dark:bg-blue-900/40"
              } rounded-xl shadow hover:shadow-xl hover:scale-[1.02]`}
            >
              <span className="absolute -left-6 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-4 border-blue-300 dark:border-blue-700 shadow">
                <HiSpeakerphone className="w-7 h-7 text-blue-500" />
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
                {isAdmin && (
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Editar</button>
                    <button className="text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">Eliminar</button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}