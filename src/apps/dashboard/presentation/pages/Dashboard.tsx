import { HiUsers, HiDocumentText, HiChartBar, HiClock } from "react-icons/hi";
import { useAuthContext } from "../../../auth/presentation/context/AuthContext";
import { getProfilePicUrl } from "../../../../shared/utils/profile"; // Asegúrate de importar el helper

export default function Dashboard() {
  const { user } = useAuthContext();

  const stats = [
    {
      label: "Usuarios activos",
      value: "12",
      icon: HiUsers,
      color: "blue",
      trend: "+2.5%",
    },
    {
      label: "Proyectos",
      value: "25",
      icon: HiDocumentText,
      color: "green",
      trend: "+5.0%",
    },
    {
      label: "Reportes",
      value: "8",
      icon: HiChartBar,
      color: "yellow",
      trend: "+1.2%",
    },
    {
      label: "Tiempo total",
      value: "156h",
      icon: HiClock,
      color: "purple",
      trend: "+3.1%",
    },
  ];

  return (
    <div className="space-y-6 w-full h-full">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              ¡Bienvenido, {user?.username || "Usuario"}!
            </h1>
            <p className="text-blue-100 text-base md:text-lg mt-2">
              {user?.role === "admin"
                ? "Accede a todas las funciones administrativas desde tu dashboard."
                : "Aquí podrás ver un resumen de tu actividad."}
            </p>
          </div>
          <img
            src={
              user?.profile_picture
                ? getProfilePicUrl(user.profile_picture) ?? undefined
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.username || "Usuario"
                  )}&background=2563eb&color=fff&size=120`
            }
            alt="avatar"
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-white/30 shadow-lg object-cover"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className={`text-sm font-semibold px-2.5 py-1 rounded-full bg-${stat.color}-50 text-${stat.color}-700`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Actividad reciente
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {/* ... contenido de actividades ... */}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Tareas pendientes
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {/* ... contenido de tareas ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}