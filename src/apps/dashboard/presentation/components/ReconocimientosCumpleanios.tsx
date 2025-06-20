import { HiGift, HiStar, HiUserCircle } from "react-icons/hi2";

const RECONOCIMIENTOS = [
  {
    tipo: "cumpleaños",
    nombre: "Laura Gómez",
    fecha: "2024-06-21",
    mensaje: "¡Feliz cumpleaños! Gracias por tu dedicación y alegría en el equipo.",
    foto: "/fotos/laura.jpg",
  },
  {
    tipo: "cumpleaños",
    nombre: "Pedro Martínez",
    fecha: "2024-07-10",
    mensaje: "¡Feliz cumpleaños! Eres parte fundamental de nuestro equipo.",
    foto: "",
  },
  {
    tipo: "reconocimiento",
    nombre: "Carlos Ruiz",
    fecha: "2024-06-18",
    mensaje: "Reconocimiento por liderazgo y compromiso en el área administrativa.",
    foto: "/fotos/carlos.jpg",
  },
  {
    tipo: "reconocimiento",
    nombre: "Ana Torres",
    fecha: "2024-05-30",
    mensaje: "Reconocimiento por excelencia en atención al usuario.",
    foto: "",
  },
  // Agrega más reconocimientos/cumpleaños aquí
];

function getIcon(tipo: string) {
  if (tipo === "cumpleaños") return <HiGift className="w-8 h-8 text-pink-500" />;
  if (tipo === "reconocimiento") return <HiStar className="w-8 h-8 text-yellow-400" />;
  return <HiUserCircle className="w-8 h-8 text-blue-400" />;
}

const mesActual = new Date().getMonth();

const cumpleaniosMes = RECONOCIMIENTOS.filter(
  (item) =>
    item.tipo === "cumpleaños" &&
    new Date(item.fecha).getMonth() === mesActual
);

const reconocimientos = RECONOCIMIENTOS.filter(
  (item) => item.tipo === "reconocimiento"
);

export default function ReconocimientosCumpleanios() {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 backdrop-blur-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center tracking-tight">
        Reconocimientos y Cumpleaños
      </h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-pink-600 dark:text-pink-300 mb-4 text-center">
          Cumpleaños del mes
        </h3>
        {cumpleaniosMes.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">No hay cumpleaños este mes.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {cumpleaniosMes.map((item) => (
              <div
                key={item.nombre + item.fecha}
                className="flex flex-col items-center justify-between rounded-xl shadow-xl bg-gradient-to-br from-pink-50/80 to-pink-100/60 dark:from-pink-900/60 dark:to-pink-800/40 transition-transform hover:scale-105 hover:shadow-2xl focus:outline-none border border-white/30 dark:border-gray-800/40 p-6 min-h-[220px]"
              >
                <div className="mb-2">{getIcon(item.tipo)}</div>
                {item.foto ? (
                  <img
                    src={item.foto}
                    alt={item.nombre}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 mb-2 shadow"
                    onError={e => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nombre)}&background=2563eb&color=fff`)}
                  />
                ) : (
                  <HiUserCircle className="w-16 h-16 text-blue-400 mb-2" />
                )}
                <div className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 text-center">
                  {item.nombre}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {new Date(item.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
                </div>
                <div className="text-gray-700 dark:text-gray-200 text-center text-sm mb-2">{item.mensaje}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 mb-4 text-center">
          Reconocimientos recientes
        </h3>
        {reconocimientos.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">No hay reconocimientos recientes.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {reconocimientos.map((item) => (
              <div
                key={item.nombre + item.fecha}
                className="flex flex-col items-center justify-between rounded-xl shadow-xl bg-gradient-to-br from-yellow-50/80 to-yellow-100/60 dark:from-yellow-900/60 dark:to-yellow-800/40 transition-transform hover:scale-105 hover:shadow-2xl focus:outline-none border border-white/30 dark:border-gray-800/40 p-6 min-h-[220px]"
              >
                <div className="mb-2">{getIcon(item.tipo)}</div>
                {item.foto ? (
                  <img
                    src={item.foto}
                    alt={item.nombre}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 mb-2 shadow"
                    onError={e => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nombre)}&background=2563eb&color=fff`)}
                  />
                ) : (
                  <HiUserCircle className="w-16 h-16 text-blue-400 mb-2" />
                )}
                <div className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 text-center">
                  {item.nombre}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {new Date(item.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
                <div className="text-gray-700 dark:text-gray-200 text-center text-sm mb-2">{item.mensaje}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}