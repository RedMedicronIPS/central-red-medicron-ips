import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiHome,
  HiUser,
  HiCog,
  HiArrowLeftOnRectangle,
  HiClipboardDocumentList,
  HiChartBar,
  HiDocumentText,
  HiBuildingOffice2,
  HiXMark,
  HiCalendarDays,
  HiNewspaper,
  HiChevronDown,
  HiChevronRight,
  HiUsers,
  HiStar,
  HiGift,
  HiTableCells,
  HiPresentationChartBar,
  HiInformationCircle
} from "react-icons/hi2";
import { useAuthContext } from "../../apps/auth/presentation/context/AuthContext";
import { getProfilePicUrl } from "../utils/profile";

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

function hasAppAccess(roles: any[], appName: string) {
  return roles.some(r => r.app?.name?.toLowerCase() === appName.toLowerCase());
}
export default function Sidebar({ isOpen = false, onToggle }: SidebarProps) {
  const { user, logout, roles } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['menu']); // 'menu' expandido por defecto

  const navItems = [
    {
      to: "/menu",
      label: "Inicio",
      icon: <HiHome className="w-5 h-5" />,
      hasSubmenu: true,
      submenu: [
        { to: "/eventos", label: "Eventos", icon: <HiCalendarDays className="w-4 h-4" /> },
        { to: "/noticias", label: "Noticias", icon: <HiNewspaper className="w-4 h-4" /> },
        { to: "/funcionarios", label: "Funcionarios", icon: <HiUsers className="w-4 h-4" /> },
        { to: "/reconocimientos", label: "Reconocimientos", icon: <HiStar className="w-4 h-4" /> },
        { to: "/felicitaciones", label: "Felicitaciones", icon: <HiGift className="w-4 h-4" /> }
        // Reconocimientos y Felicitaciones: cualquier rol en "menu"
        //...(hasAppAccess(roles, "menu")
        //  ? [
        //      { to: "/reconocimientos", label: "Reconocimientos", icon: <HiStar className="w-4 h-4" /> },
        //      { to: "/felicitaciones", label: "Felicitaciones", icon: <HiGift className="w-4 h-4" /> }
        //    ]
        //  : []
        //)
      ]
    },
    // Auditorías: cualquier rol en "auditorias"
    ...(hasAppAccess(roles, "auditorias")
      ? [{ to: "/auditorias", label: "Auditorías", icon: <HiClipboardDocumentList className="w-5 h-5" /> }]
      : []),
    {
      to: "/dashboard",
      label: "Indicadores",
      icon: <HiChartBar className="w-5 h-5" />,
      hasSubmenu: true,
      submenu: [
        { to: "/dashboard", label: "Dashboard", icon: <HiPresentationChartBar className="w-4 h-4" /> },
        ...(hasAppAccess(roles, "indicadores")
          ? [
            { to: "/indicators", label: "Indicadores", icon: <HiChartBar className="w-4 h-4" /> },
            { to: "/results", label: "Resultados", icon: <HiTableCells className="w-4 h-4" /> }
          ]
          : []
        )
      ]
    },
    // Procesos: cualquier rol en "procesos"
    ...(hasAppAccess(roles, "procesos")
      ? [{ to: "/procesos", label: "Procesos", icon: <HiDocumentText className="w-5 h-5" /> }]
      : []),
    // Proveedores: cualquier rol en "proveedores"
    ...(hasAppAccess(roles, "proveedores")
      ? [{ to: "/proveedores", label: "Proveedores", icon: <HiBuildingOffice2 className="w-5 h-5" /> }]
      : []),
    { to: "/profile", label: "Mi perfil", icon: <HiUser className="w-5 h-5" /> },
    // Administración: cualquier rol en "administracion"
    ...(hasAppAccess(roles, "administracion")
      ? [{ to: "/administracion", label: "Administración", icon: <HiCog className="w-5 h-5" /> }]
      : []),
  ];



  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const handleAbout = () => {
    navigate("/acerca_de");
  };

  const handleNavClick = () => {
    // Cerrar el sidebar en móviles cuando se hace click en un enlace
    if (onToggle && window.innerWidth < 1024) {
      onToggle();
    }
  };

  const toggleSubmenu = (itemTo: string) => {
    setExpandedMenus(prev =>
      prev.includes(itemTo)
        ? prev.filter(item => item !== itemTo)
        : [...prev, itemTo]
    );
  };

  const isSubmenuActive = (submenu: any[]) => {
    return submenu.some(item => location.pathname === item.to);
  };

  const username = typeof user?.username === "string" ? user.username : "Usuario";
  const role = typeof user?.role === "string" ? user.role : user?.role?.name || "usuario";

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 xl:w-72
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
        h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col
      `}>
        {/* Header con logo y botón cerrar (móvil) */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <img
            src="/logo.png"
            alt="Red Medicron IPS"
            className="h-10 sm:h-12 w-auto"
          />
          {/* Botón cerrar solo en móviles */}
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
            aria-label="Cerrar menú"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Información del usuario */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.profile_picture
                  ? getProfilePicUrl(user.profile_picture) ?? undefined
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0369a1&color=ffffff`
              }
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                {role}
              </p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const isSubmenuExpanded = expandedMenus.includes(item.to);
            const hasActiveSubmenu = item.submenu ? isSubmenuActive(item.submenu) : false;

            return (
              <div key={item.to}>
                {/* Item principal */}
                <div className="flex items-center">
                  <Link
                    to={item.to}
                    onClick={item.hasSubmenu ? undefined : handleNavClick}
                    className={`
                      flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive || hasActiveSubmenu
                        ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                      }
                    `}
                  >
                    <span className={isActive || hasActiveSubmenu ? "text-blue-600 dark:text-blue-400" : ""}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>

                  {/* Botón para expandir/contraer submenú */}
                  {item.hasSubmenu && (
                    <button
                      onClick={() => toggleSubmenu(item.to)}
                      className={`
                        p-2 rounded-lg text-sm transition-all duration-200 ml-1
                        ${isActive || hasActiveSubmenu
                          ? "text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }
                      `}
                    >
                      {isSubmenuExpanded ? (
                        <HiChevronDown className="w-4 h-4 transition-transform duration-200" />
                      ) : (
                        <HiChevronRight className="w-4 h-4 transition-transform duration-200" />
                      )}
                    </button>
                  )}
                </div>

                {/* Submenú */}
                {item.hasSubmenu && item.submenu && (
                  <div className={`
                    ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out
                    ${isSubmenuExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    {item.submenu.map((subItem) => {
                      const isSubActive = location.pathname === subItem.to;
                      return (
                        <Link
                          key={subItem.to}
                          to={subItem.to}
                          onClick={handleNavClick}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-l-2
                            ${isSubActive
                              ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 border-gray-200 dark:border-gray-700"
                            }
                          `}
                        >
                          <span className={isSubActive ? "text-blue-600 dark:text-blue-400" : ""}>
                            {subItem.icon}
                          </span>
                          <span className="truncate">{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Botón de cerrar sesión */}
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleAbout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-gray-900 dark:text-gray-100 hover:bg-red-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors text-sm font-medium"
          >
            <HiInformationCircle className="w-5 h-5" />
            <span>Acerca de</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors text-sm font-medium"
          >
            <HiArrowLeftOnRectangle className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </>
  );
}