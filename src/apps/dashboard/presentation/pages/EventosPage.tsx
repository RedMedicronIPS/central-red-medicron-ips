// src/apps/dashboard/presentation/pages/NoticiasPage.tsx
import { useEffect, useState } from "react";
import { HiCalendarDays, HiPlus } from "react-icons/hi2";
import { useAuthContext } from "../../../auth/presentation/context/AuthContext";

type Evento = {
  id: string;
  titulo: string;
  fecha: string;
  descripcion: string;
  importante?: boolean;
};

export default function EventosPage() {
  const { user } = useAuthContext();
  const isAdmin =
    user?.role === "admin" ||
    (typeof user?.role === "object" && "name" in user.role && user.role.name === "admin");
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de fetch, reemplaza por fetch real a /api/dashboard/eventos
    setLoading(true);
    setTimeout(() => {
      setEventos([
        {
          id: "1",
          titulo: "Reunión general de funcionarios",
          fecha: "2024-06-25",
          descripcion: "Encuentro institucional para socializar avances y novedades.",
          importante: true,
        },
        {
          id: "2",
          titulo: "Inicio nueva política de vacaciones",
          fecha: "2024-07-01",
          descripcion: "Entra en vigencia la nueva política de vacaciones.",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 min-h-[60vh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <HiCalendarDays className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          Eventos Institucionales
        </h1>
        {isAdmin && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            // onClick={...} // Aquí abrirías el modal o formulario de creación
          >
            <HiPlus className="w-5 h-5" />
            Agregar evento
          </button>
        )}
      </div>
      {loading ? (
        <div className="text-center text-blue-600 dark:text-blue-300">Cargando eventos...</div>
      ) : eventos.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">No hay eventos registrados.</div>
      ) : (
        <ol className="relative border-l-4 border-blue-200 dark:border-blue-800 ml-2">
          {eventos.map((e) => (
            <li
              key={e.id}
              className={`mb-8 ml-6 group transition-all duration-300 ${
                e.importante ? "bg-yellow-50 dark:bg-yellow-900/40" : "bg-blue-50/60 dark:bg-blue-900/40"
              } rounded-xl shadow hover:shadow-xl hover:scale-[1.02]`}
            >
              <span className="absolute -left-6 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-4 border-blue-300 dark:border-blue-700 shadow">
                <HiCalendarDays className="w-7 h-7 text-blue-500" />
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