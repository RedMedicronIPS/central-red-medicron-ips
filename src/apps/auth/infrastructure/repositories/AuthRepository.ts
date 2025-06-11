import axiosInstance from "../../../../core/infrastructure/http/axiosInstance";

export const login = async (username: string, password: string) => {
  try {
    // Primera fase de autenticación
    const response = await axiosInstance.post("/token/", {
      username,
      password,
    });

    const data = response.data;
    console.log('Login response:', data); // Para debug

    // Si el usuario tiene 2FA activado
    if (data.is_2fa_enabled) {
      return {
        require_2fa: true,
        temp_token: data.temp_token,
        username: username,
        message: "Se requiere verificación 2FA"
      };
    }

    // Si no tiene 2FA, procedemos con el login normal
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);

    const userResponse = await axiosInstance.get("/users/me/");
    localStorage.setItem('user', JSON.stringify(userResponse.data));
    
    return {
      user: userResponse.data,
      token: data.access
    };
  } catch (error: any) {
    console.error('Login error:', error.response?.data); // Para debug
    throw new Error(error.response?.data?.detail || 'Error en el inicio de sesión');
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axiosInstance.post("/users/password-reset/", { 
      email,
      // Asegúrate de que el frontend base_url esté configurado correctamente
      reset_url: `${window.location.origin}/auth/reset-password` 
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Error al solicitar el reset de contraseña');
  }
};

export const resetPassword = async (userId: string, token: string, password: string) => {
  try {
    return await axiosInstance.post(`/users/password-reset-confirm/${userId}/${token}/`, {
      password
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Error al restablecer la contraseña');
  }
};

export const enable2FA = async () => {
  try {
    const response = await axiosInstance.post("/users/2fa/toggle/", {
      enable_2fa: true
    });
    
    console.log('Enable 2FA response:', response.data);
    
    // Guardamos el estado temporal
    if (response.data.temp_token) {
      localStorage.setItem('temp_2fa_token', response.data.temp_token);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Enable 2FA error:', error.response?.data);
    throw new Error(error.response?.data?.detail || 'Error al activar 2FA');
  }
};

export const verify2FA = async ({ code, temp_token }: { code: string, temp_token: string }) => {
  try {
    const response = await axiosInstance.post("/users/verify-otp/", {
      temp_token: temp_token,
      otp_code: code  // Cambiamos 'code' por 'otp_code' para coincidir con el backend
    });

    console.log('Verify 2FA response:', response.data);

    // Si la verificación es exitosa, guardamos los tokens y datos del usuario
    if (response.data.access && response.data.refresh) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify({
          ...response.data.user,
          is_2fa_enabled: true
        }));
      }
    }

    return response.data;
  } catch (error: any) {
    console.error('Verify 2FA error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Error en la verificación 2FA');
  }
};

export const toggle2FA = async () => {
  try {
    const response = await axiosInstance.post("/users/2fa/toggle/");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Error al cambiar estado de 2FA');
  }
};

export const disable2FA = async () => {
  try {
    const response = await axiosInstance.post("/users/2fa/toggle/", {
      enable_2fa: false
    });
    
    // Actualizar el estado del usuario en localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({
      ...currentUser,
      is_2fa_enabled: false
    }));

    return response.data;
  } catch (error: any) {
    console.error('Error al desactivar 2FA:', error.response?.data);
    throw new Error(error.response?.data?.detail || 'Error al desactivar 2FA');
  }
};
