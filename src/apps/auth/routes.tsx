import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./presentation/pages/LoginPage";

const AuthRoutes = () => (
  <Routes>
    <Route path="login" element={<LoginPage />} />
    <Route path="*" element={<Navigate to="login" />} />
  </Routes>
);

export default AuthRoutes;