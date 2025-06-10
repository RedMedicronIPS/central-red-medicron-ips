import { Route, Routes, Navigate } from "react-router-dom";

// Aquí deberías importar tus páginas reales de proveedores
// import ProveedoresDashboard from "./presentation/pages/ProveedoresDashboard";

const ProveedoresRoutes = () => (
  <Routes>
    {/* Ejemplo de ruta protegida */}
    {/* <Route path="dashboard" element={<ProveedoresDashboard />} /> */}
    <Route path="*" element={<div>Bienvenido al módulo de Proveedores</div>} />
  </Routes>
);

export default ProveedoresRoutes;