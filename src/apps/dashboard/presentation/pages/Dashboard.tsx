import { useAuthContext } from "../../../auth/presentation/context/AuthContext";
import { getProfilePicUrl } from "../../../../shared/utils/profile";
import Bienvenida from "../components/Bienvenida";
import MisionVisionValores from "../components/MisionVisionValores";
import IndicadoresKPI from "../components/IndicadoresKPI";
import NoticiasComunicados from "../components/NoticiasComunicados";
import CalendarioEventos from "../components/CalendarioEventos";
import EstructuraOrganizacional from "../components/EstructuraOrganizacional";
import DirectorioFuncionarios from "../components/DirectorioFuncionarios";
import DocumentosRecursosRapidos from "../components/DocumentosRecursosRapidos";
import ReconocimientosCumpleanios from "../components/ReconocimientosCumpleanios";
import SoporteContacto from "../components/SoporteContacto";

const DIRECTORIO = [
  {
    nombre: "Carlos Ruiz",
    cargo: "Auxiliar Administrativo",
    email: "carlos@redmedicronips.com.co",
    tel: "304 456 7890",
    foto: "/fotos/carlos.jpg",
  },
  {
    nombre: "María Torres",
    cargo: "Recepcionista",
    email: "maria@redmedicronips.com.co",
    tel: "305 567 8901",
    foto: "/fotos/maria.jpg",
  },
  // ...agrega más funcionarios
];

export default function Dashboard() {
  const { user } = useAuthContext();

  return (
    <div className="space-y-8 w-full h-full">
      <Bienvenida />
      <MisionVisionValores />
      <IndicadoresKPI />
      <NoticiasComunicados />
      <CalendarioEventos />
      <EstructuraOrganizacional />
      <DirectorioFuncionarios funcionarios={DIRECTORIO} />
      <DocumentosRecursosRapidos />
      <ReconocimientosCumpleanios />
      <SoporteContacto />
    </div>
  );
}