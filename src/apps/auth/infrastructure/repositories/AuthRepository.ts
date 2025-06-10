import { AuthService } from "../../application/services/AuthService";

export const login = async (email: string, password: string) => {
  const data = await AuthService.login(email, password) as { token?: string; user?: unknown };
  // Django por defecto usa sesiones, pero si tu backend retorna un token, guárdalo aquí
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  localStorage.setItem("user", JSON.stringify(data.user || {}));
  return data;
};
