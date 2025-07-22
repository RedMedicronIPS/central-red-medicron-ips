import { Route, Routes } from "react-router-dom";
import TercerosPage from "./presentation/pages/TercerosPage";

const ProveedoresRoutes = () => (
  <Routes>
    <Route path="/" element={<TercerosPage />} />
    <Route path="/terceros" element={<TercerosPage />} />
    <Route path="*" element={<div>Módulo de Terceros - Red Medicron IPS</div>} />
  </Routes>
);

export default ProveedoresRoutes;