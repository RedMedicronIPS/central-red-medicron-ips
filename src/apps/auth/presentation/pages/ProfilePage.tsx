import { useState } from "react";
import Button from "../../../../shared/components/Button";
import Input from "../../../../shared/components/Input";

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState({
    username: user.username || "",
    email: user.email || "",
    fullName: user.fullName || "",
    role: user.role || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí implementarías la lógica para actualizar el perfil
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <Button
            variant={isEditing ? "secondary" : "primary"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancelar" : "Editar Perfil"}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 flex flex-col items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.username || "U"
              )}&background=1e40af&color=fff&size=200`}
              alt="avatar"
              className="w-48 h-48 rounded-full border-4 border-blue-100"
            />
            <p className="mt-4 text-sm text-gray-500">
              Miembro desde: {user.joinDate || "No disponible"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="md:w-2/3 space-y-6">
            <Input
              label="Nombre completo"
              value={values.fullName}
              onChange={(e) =>
                setValues({ ...values, fullName: e.target.value })
              }
              disabled={!isEditing}
            />
            <Input
              label="Nombre de usuario"
              value={values.username}
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
              disabled={!isEditing}
            />
            <Input
              label="Correo electrónico"
              type="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              disabled={!isEditing}
            />
            <Input
              label="Rol"
              value={values.role}
              disabled={true}
            />

            {isEditing && (
              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary">
                  Guardar cambios
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Cambiar contraseña
        </h2>
        <form className="space-y-4 max-w-md">
          <Input
            type="password"
            label="Contraseña actual"
            placeholder="Ingresa tu contraseña actual"
          />
          <Input
            type="password"
            label="Nueva contraseña"
            placeholder="Ingresa tu nueva contraseña"
          />
          <Input
            type="password"
            label="Confirmar contraseña"
            placeholder="Confirma tu nueva contraseña"
          />
          <Button variant="primary">Actualizar contraseña</Button>
        </form>
      </div>
    </div>
  );
}