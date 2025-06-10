export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const stats = [
    { label: "Usuarios activos", value: "12", color: "bg-blue-100", text: "text-blue-700" },
    { label: "Proyectos", value: "25", color: "bg-green-100", text: "text-green-700" },
    { label: "Reportes", value: "8", color: "bg-yellow-100", text: "text-yellow-700" },
    { label: "Tiempo total", value: "156h", color: "bg-purple-100", text: "text-purple-700" },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            ¡Bienvenido, {user?.username || "Usuario"}!
          </h1>
          <p className="text-blue-100 text-lg">
            {user?.role === "admin"
              ? "Accede a todas las funciones administrativas desde tu dashboard."
              : "Aquí podrás ver un resumen de tu actividad."}
          </p>
        </div>
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "Usuario")}&background=2563eb&color=fff&size=96`}
          alt="avatar"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg mt-6 md:mt-0"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl shadow bg-white p-6 flex flex-col items-center hover:scale-105 transition-transform border-t-4 ${stat.color}`}
          >
            <div className={`text-4xl font-extrabold mb-2 ${stat.text}`}>{stat.value}</div>
            <div className="text-gray-700 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}