import { useAuthContext } from "../../../auth/presentation/context/AuthContext";
import { getProfilePicUrl } from "../../../../shared/utils/profile";

export default function Bienvenida() {
  const { user } = useAuthContext();

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold text-white">
          ¡Bienvenido, {user?.first_name || user?.username || "Funcionario"}!
        </h1>
        <p className="text-blue-100 text-lg mt-2">
          Este es tu portal institucional. Aquí encontrarás información clave y recursos para tu gestión diaria.
        </p>
      </div>
      <img
        src={
          user?.profile_picture
            ? getProfilePicUrl(user.profile_picture) ?? undefined
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.username || "Usuario"
              )}&background=2563eb&color=fff&size=120`
        }
        alt="avatar"
        className="w-20 h-20 rounded-full border-4 border-white/30 shadow-lg object-cover"
      />
    </div>
  );
}