import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../../../../shared/components/Button";
import Input from "../../../../shared/components/Input";
import { disable2FA, getProfile, updateProfile } from "../../infrastructure/repositories/AuthRepository";
import { notify } from '../../../../shared/utils/notifications';
import { useAuthContext } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, setUser } = useAuthContext();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState({
    username: user?.username || "",
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    role: typeof user?.role === "string" ? user.role : user?.role?.name || "",
  });
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.is_2fa_enabled || false);
  const [loading2FA, setLoading2FA] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error2FA, setError2FA] = useState("");
  const [success2FA, setSuccess2FA] = useState("");

  // Traer datos frescos del perfil al montar
  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const profile = await getProfile();
        setValues({
          username: profile.username,
          email: profile.email,
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          role: typeof profile.role === "string" ? profile.role : profile.role?.name || "",
        });
        setIs2FAEnabled(profile.is_2fa_enabled);
        setUser(profile); // Actualiza el contexto y localStorage
      } catch (err: any) {
        notify.error("No se pudo cargar el perfil");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (location.state?.is2FAEnabled !== undefined) {
      setIs2FAEnabled(location.state.is2FAEnabled);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const updated = await updateProfile({
        username: values.username,
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
      });
      setUser(updated);
      setIsEditing(false);
      notify.success("Perfil actualizado correctamente");
    } catch (err: any) {
      notify.error(err.message || "Error al actualizar el perfil");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm("¿Estás seguro de que deseas desactivar la autenticación de dos factores?")) {
      return;
    }
    setLoading2FA(true);
    try {
      await disable2FA();
      setIs2FAEnabled(false);
      setUser({ ...user, is_2fa_enabled: false });
      notify.success("Autenticación de dos factores desactivada exitosamente");
    } catch (err: any) {
      notify.error(err.message || "Error al desactivar 2FA");
    } finally {
      setLoading2FA(false);
    }
  };

  useEffect(() => {
    if (location.state?.successMessage) {
      notify.success(location.state.successMessage);
    }
  }, [location.state]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <Button
            variant={isEditing ? "secondary" : "primary"}
            onClick={() => setIsEditing(!isEditing)}
            disabled={loadingProfile}
          >
            {isEditing ? "Cancelar" : "Editar Perfil"}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 flex flex-col items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                values.first_name + " " + values.last_name || values.username || "U"
              )}&background=1e40af&color=fff&size=200`}
              alt="avatar"
              className="w-48 h-48 rounded-full border-4 border-blue-100"
            />
            <p className="mt-4 text-sm text-gray-500">
              Miembro desde: {user?.joinDate || "No disponible"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="md:w-2/3 space-y-6">
            <Input
              label="Nombre"
              value={values.first_name}
              onChange={(e) =>
                setValues({ ...values, first_name: e.target.value })
              }
              disabled={!isEditing || loadingProfile}
            />
            <Input
              label="Apellido"
              value={values.last_name}
              onChange={(e) =>
                setValues({ ...values, last_name: e.target.value })
              }
              disabled={!isEditing || loadingProfile}
            />
            <Input
              label="Nombre de usuario"
              value={values.username}
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
              disabled={!isEditing || loadingProfile}
            />
            <Input
              label="Correo electrónico"
              type="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              disabled={!isEditing || loadingProfile}
            />
            <Input label="Rol" value={values.role} disabled={true} />

            {isEditing && (
              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary" loading={loadingProfile}>
                  Guardar cambios
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                  disabled={loadingProfile}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Nueva sección de seguridad */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Seguridad
        </h2>

        {success2FA && (
          <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm">
            {success2FA}
          </div>
        )}

        {error2FA && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error2FA}
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">
                Autenticación de dos factores
              </h3>
              <p className="text-sm text-gray-600">
                {is2FAEnabled
                  ? "La autenticación de dos factores está activada"
                  : "Añade una capa extra de seguridad a tu cuenta"}
              </p>
            </div>
            {is2FAEnabled ? (
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={handleDisable2FA}
                  loading={loading2FA}
                >
                  {loading2FA ? "Desactivando..." : "Desactivar 2FA"}
                </Button>
                <Link
                  to="/auth/configure-2fa"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Reconfigurar 2FA
                </Link>
              </div>
            ) : (
              <Link
                to="/auth/configure-2fa"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Configurar 2FA
              </Link>
            )}
          </div>

          {/* Separador */}
          <div className="border-t border-gray-200" />

          {/* Sección de cambio de contraseña */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Cambiar contraseña</h3>
            <form className="space-y-4 max-w-md">
              <Input
                type="password"
                label="Contraseña actual"
                placeholder="Ingresa tu contraseña actual"
                disabled
              />
              <Input
                type="password"
                label="Nueva contraseña"
                placeholder="Ingresa tu nueva contraseña"
                disabled
              />
              <Input
                type="password"
                label="Confirmar contraseña"
                placeholder="Confirma tu nueva contraseña"
                disabled
              />
              <Button variant="primary" disabled>
                Actualizar contraseña
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}