import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiChevronDown, HiLogout, HiUser } from "react-icons/hi";

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          {/* Botón de menú móvil aquí si lo necesitas */}
          <h1 className="text-xl font-semibold text-gray-900">
            Panel de Gestión
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.username || "U"
                )}&background=1e40af&color=fff`}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden md:block font-medium text-gray-700">
                {user?.username}
              </span>
              <HiChevronDown className="w-5 h-5 text-gray-500" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 text-left"
                >
                  <HiUser className="w-5 h-5" />
                  Mi Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 text-left"
                >
                  <HiLogout className="w-5 h-5" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}