import { useState } from "react";
import { login, logout } from "../../infrastructure/repositories/AuthRepository";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../../shared/utils/notifications";

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get user data from localStorage
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const loginUser = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await login(username, password);
      console.log('Login response in useAuth:', response);
      
      // Si requiere 2FA
      if (response.require_2fa) {
        navigate("/auth/verify-2fa", { 
          state: { 
            tempToken: response.temp_token,
            username: response.username
          }
        });
        return;
      }

      // Si no requiere 2FA
      notify.success("Inicio de sesión exitoso");
      navigate("/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Error en el inicio de sesión";
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    logout();
    navigate("/auth/login");
  };

  return {
    loginUser,
    logoutUser,
    error,
    loading,
    isAuthenticated: !!localStorage.getItem('access_token'),
    roles: user?.roles || [],
    user
  };
};
