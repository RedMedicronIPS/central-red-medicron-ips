import { useState } from "react";
import { login } from "../../infrastructure/repositories/AuthRepository";

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loginUser = async (username: string, password: string) => {
    setLoading(true);
    try {
      const data = await login(username, password); // Usa username
      setError(null);
      return data;
    } catch (err: any) {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  // Puedes agregar aquí isAuthenticated, roles, etc.
  const user = localStorage.getItem("user");
  const isAuthenticated = !!user;
  const roles = user ? JSON.parse(user).roles || [] : [];

  return {
    loginUser,
    error,
    loading,
    isAuthenticated,
    roles,
  };
};
