import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../shared/components/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/users/password-reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      alert("Error al enviar correo");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-7"
      >
        <h2 className="text-3xl font-bold mb-4 text-blue-900 text-center">
          Recuperar contraseña
        </h2>
        {sent ? (
          <div className="text-green-600 text-center font-medium">
            Te hemos enviado un correo para restablecer tu contraseña.
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full border border-blue-200 p-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!email}
            >
              Enviar
            </Button>
          </>
        )}
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={() => navigate("/auth/login")}
        >
          Volver al inicio de sesión
        </Button>
      </form>
    </div>
  );
}
