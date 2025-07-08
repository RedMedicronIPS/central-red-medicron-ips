import { Navigate, useRoutes } from "react-router-dom";
import { useAuthContext } from "../../apps/auth/presentation/context/AuthContext";
import AuthRoutes from "../../apps/auth/routes";
import ProveedoresRoutes from "../../apps/proveedores/routes";
import { AuthGuard } from "./authGuard";
import MainLayout from "../presentation/layouts/MainLayout";
import MenuPage from "../../apps/menu/presentation/pages/MenuPage";
import ProfilePage from "../../apps/auth/presentation/pages/ProfilePage";
import AuditoriasPage from "../../apps/auditorias/presentation/pages/AuditoriasPage";
import IndicadoresPage from "../../apps/indicadores/presentation/pages/IndicadoresPage";
import ProcesosPage from "../../apps/procesos/presentation/pages/ProcesosPage";
import ProveedoresPage from "../../apps/proveedores/presentation/pages/ProveedoresPage";
import AdministracionPage from "../../apps/administracion/presentation/pages/AdministracionPage";
import NoticiasPage from "../../apps/menu/presentation/pages/NoticiasPage";
import EventosPage from "../../apps/menu/presentation/pages/EventosPage";
import FuncionariosPage from "../../apps/menu/presentation/pages/FuncionariosPage";

export default function AppRouter() {
  const { isAuthenticated, roles } = useAuthContext();

  const routes = useRoutes([
    {
      path: "/auth/*",
      element: <AuthRoutes />,
    },
    {
      path: "/proveedores/*",
      element: (
        <AuthGuard isAuthenticated={isAuthenticated} redirectTo="/auth/login">
          {roles.includes("contabilidad") || roles.includes("admin") ? (
            <ProveedoresRoutes />
          ) : (
            <Navigate to="/menu" replace />
          )}
        </AuthGuard>
      ),
    },
    {
      path: "/",
      element: (
        <AuthGuard isAuthenticated={isAuthenticated} redirectTo="/auth/login">
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: "/",
          element: <Navigate to="/menu" replace />,
        },
        { path: "menu", element: <MenuPage /> },
        { path: "eventos", element: <EventosPage /> },
        { path: "eventos/:id", element: <EventosPage /> },
        { path: "noticias", element: <NoticiasPage /> },
        { path: "noticias/:id", element: <NoticiasPage /> },
        { path: "funcionarios", element: <FuncionariosPage /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "auditorias", element: <AuditoriasPage /> },
        { path: "indicadores", element: <IndicadoresPage /> },
        { path: "procesos", element: <ProcesosPage /> },
        { path: "proveedores", element: <ProveedoresPage /> },
        { path: "administracion", element: <AdministracionPage /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/auth/login" replace />,
    },
  ]);

  return routes;
}