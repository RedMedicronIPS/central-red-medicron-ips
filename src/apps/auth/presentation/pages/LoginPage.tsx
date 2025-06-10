import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../../../../shared/components/Button";
import Input from "../../../../shared/components/Input";

interface LoginFormValues {
  username: string;
  password: string;
}

const initialValues: LoginFormValues = {
  username: "",
  password: "",
};

export default function LoginPage() {
  const { loginUser, loading, error } = useAuth();
  const [values, setValues] = useState(initialValues);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginUser(values.username, values.password);
    if (result) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-7"
      >
        <div className="flex flex-col items-center gap-2">
          <img
            src="/logo192.png"
            alt="Logo"
            className="w-20 h-20 mb-2"
          />
          <h2 className="text-3xl font-bold text-blue-900 text-center">
            Iniciar sesión
          </h2>
          <p className="text-gray-500 text-center">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>
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
        <Input
          id="password"
          name="password"
          type="password"
          required
          label="Contraseña"
          placeholder="Tu contraseña"
          value={values.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
        <div className="text-center">
          <a
            href="/auth/forgot-password"
            className="text-blue-600 hover:underline text-sm"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </form>
    </div>
  );
}

