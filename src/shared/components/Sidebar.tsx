import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiHome, HiUser, HiCog, HiLogout, HiClipboardList, HiChartBar, HiDocumentText, HiOfficeBuilding } from "react-icons/hi";
import { useAuthContext } from "../../apps/auth/presentation/context/AuthContext";
import { getProfilePicUrl } from "../utils/profile";

export default function Sidebar() {
  const { user, logout, roles } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { to: "/dashboard", label: "Inicio", icon: <HiHome className="w-5 h-5" /> },
    { to: "/auditorias", label: "Auditorías", icon: <HiClipboardList className="w-5 h-5" /> },
    { to: "/indicadores", label: "Indicadores", icon: <HiChartBar className="w-5 h-5" /> },
    { to: "/procesos", label: "Procesos", icon: <HiDocumentText className="w-5 h-5" /> },
    { to: "/proveedores", label: "Proveedores", icon: <HiOfficeBuilding className="w-5 h-5" /> },
    { to: "/profile", label: "Mi perfil", icon: <HiUser className="w-5 h-5" /> },
    ...(roles.includes("admin")
      ? [{ to: "/administracion", label: "Administración", icon: <HiCog className="w-5 h-5" /> }]
      : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  const username = typeof user?.username === "string" ? user.username : "Usuario";
  const role = typeof user?.role === "string" ? user.role : user?.role?.name || "usuario";

  return (
    <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">Red Medicron IPS</h1>
      </div>

      <div className="px-4 py-6 border-y border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <img
            src={
              user?.profile_picture
                ? getProfilePicUrl(user.profile_picture) ?? undefined
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0369a1&color=ffffff`
            }
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{username}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname.startsWith(item.to)
                    ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-200"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
        >
          <HiLogout className="w-5 h-5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}