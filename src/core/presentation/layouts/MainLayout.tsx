import Sidebar from "../../../shared/components/Sidebar";
import Topbar from "../../../shared/components/Topbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:block md:w-64 xl:w-72 shrink-0">
        <Sidebar />
      </aside>

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Topbar />
        
        {/* Área de contenido principal */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}