import { Route, Routes, Navigate } from "react-router-dom";
import ProveedoresPage from "./presentation/pages/ProveedoresPage";
import FacturasPage from "./presentation/pages/FacturasPage";

const ProveedoresRoutes = () => (
  <Routes>
    <Route path="/proveedores" element={<ProveedoresPage />} />
    <Route path="/proveedores/facturas" element={<FacturasPage />} />
    <Route path="*" element={<Navigate to="/proveedores" replace />} />
  </Routes>
);

export default ProveedoresRoutes;
