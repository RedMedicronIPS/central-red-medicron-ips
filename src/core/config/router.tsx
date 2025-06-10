import { Navigate, useRoutes } from "react-router-dom";
// Update the path below to the correct relative path if alias is not configured
import { useAuth } from "../../apps/auth/presentation/hooks/useAuth";
// If AuthRoutes is a default export, use:
import AuthRoutes from "../../apps/auth/routes";
// Or, if the export has a different name, adjust accordingly:
// import { CorrectExportName } from "../../apps/auth/routes";
// If ProveedoresRoutes is a default export:
import ProveedoresRoutes from "../../apps/proveedores/routes";
// Or, if the export has a different name, adjust accordingly:
// import { CorrectExportName } from "../../apps/proveedores/routes";
import { AuthGuard } from "./authGuard";
import MainLayout from "../presentation/layouts/MainLayout";
import Dashboard from "../../apps/dashboard/presentation/pages/Dashboard";
import ProfilePage from "../../apps/auth/presentation/pages/ProfilePage";

export default function AppRouter() {
  // Debes implementar isAuthenticated y roles en tu hook useAuth
  const { isAuthenticated, roles } = useAuth();

  const routes = useRoutes([
    {
      path: "/auth/*",
      element: <AuthRoutes />,
    },
    {
      path: "/proveedores/*",
      element: (
        <AuthGuard isAuthenticated={isAuthenticated}>
          {roles.includes("contabilidad") ? (
            <ProveedoresRoutes />
          ) : (
            <Navigate to="/auth/login" />
          )}
        </AuthGuard>
      ),
    },
    {
      path: "/",
      element: (
        <AuthGuard isAuthenticated={isAuthenticated}>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "profile", element: <ProfilePage /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/auth/login" />,
    },
  ]);

  return routes;
}
