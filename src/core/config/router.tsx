import { Navigate, useRoutes } from "react-router-dom";
import { useAuth } from "../../apps/auth/presentation/hooks/useAuth";
import AuthRoutes from "../../apps/auth/routes";
import ProveedoresRoutes from "../../apps/proveedores/routes";
import { AuthGuard } from "./authGuard";
import MainLayout from "../presentation/layouts/MainLayout";
import Dashboard from "../../apps/dashboard/presentation/pages/Dashboard";
import ProfilePage from "../../apps/auth/presentation/pages/ProfilePage";

export default function AppRouter() {
  const { isAuthenticated, roles = [] } = useAuth(); // Proporcionamos un valor por defecto

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
            <Navigate to="/dashboard" replace />
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
          element: <Navigate to="/dashboard" replace />,
        },
        { path: "dashboard", element: <Dashboard /> },
        { path: "profile", element: <ProfilePage /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/auth/login" replace />,
    },
  ]);

  return routes;
}
