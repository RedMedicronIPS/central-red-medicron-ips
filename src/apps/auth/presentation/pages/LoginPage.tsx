import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Button from "../../../../shared/components/Button";
import Input from "../../../../shared/components/Input";

export default function LoginPage() {
  const { loginUser, loading, error } = useAuth();
  const [values, setValues] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginUser(values.username, values.password);
    if (result) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Panel izquierdo - Contenido principal */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="max-w-xl w-full">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-16">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-12 w-auto"
              />
              <h1 className="text-2xl font-bold text-white">
                Red Medicron IPS
              </h1>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Gestión médica <br/>
              
            </h2>
            <p className="text-xl text-blue-100 max-w-md">
              Accede a todas las herramientas necesarias para tu institución médica en un solo lugar.
            </p>
          </div>

          <div className="hidden md:block text-sm text-blue-200">
            © {currentYear} Red Medicron IPS. <br/>
            Todos los derechos reservados.
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="w-full md:max-w-md lg:max-w-lg xl:max-w-xl flex items-center justify-center p-4 md:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenido de nuevo
            </h2>
            <p className="text-gray-600">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <Input
                id="username"
                name="username"
                type="text"
                required
                label="Usuario"
                placeholder="Tu nombre de usuario"
                value={values.username}
                onChange={handleChange}
                autoComplete="username"
              />

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  label="Contraseña"
                  placeholder="Tu contraseña"
                  value={values.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <HiEyeOff className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
              </label>
              <a
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="py-2.5"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            ¿Necesitas ayuda?{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Contacta a soporte
            </a>
          </div>

          <div className="md:hidden text-center text-xs text-gray-500 pt-8">
            © {currentYear} Red Medicron IPS. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </div>
  );
}

