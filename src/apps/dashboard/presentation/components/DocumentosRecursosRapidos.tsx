import { HiDocumentText, HiOutlineDocumentText, HiOutlineClipboard } from "react-icons/hi2";
import { HiDownload } from "react-icons/hi";

const DOCUMENTOS = [
  {
    nombre: "Reglamento Interno de Trabajo",
    url: "https://drive.google.com/file/d/1cQNXCgqIVhfINusXTFOAlRnSSEZPwY23/view?usp=sharing",
    tipo: "reglamento",
    descripcion: "Normas y políticas internas de la institución.",
    actualizado: "2024-06-01",
  },
  {
    nombre: "Manual de Convivencia",
    url: "#",
    tipo: "manual",
    descripcion: "Guía para la sana convivencia laboral.",
    actualizado: "2024-05-15",
  },
  {
    nombre: "Formato de Permiso",
    url: "#",
    tipo: "formato",
    descripcion: "Solicitud de permisos laborales.",
    actualizado: "2024-04-10",
  },
  // Agrega más documentos aquí
];

function getIcon(tipo: string) {
  switch (tipo) {
    case "reglamento":
      return <HiOutlineClipboard className="w-8 h-8 text-blue-600" />;
    case "manual":
      return <HiOutlineDocumentText className="w-8 h-8 text-green-600" />;
    case "formato":
      return <HiDocumentText className="w-8 h-8 text-yellow-600" />;
    default:
      return <HiDocumentText className="w-8 h-8 text-gray-500" />;
  }
}

export default function DocumentosRecursosRapidos() {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 backdrop-blur-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center tracking-tight">
        Documentos y Recursos Rápidos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {DOCUMENTOS.map((doc) => (
          <a
            key={doc.nombre}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-between rounded-xl shadow-xl bg-gradient-to-br from-blue-50/80 to-blue-100/60 dark:from-blue-900/60 dark:to-blue-800/40 transition-transform hover:scale-105 hover:shadow-2xl focus:outline-none border border-white/30 dark:border-gray-800/40 p-6 cursor-pointer min-h-[200px]"
          >
            <div className="mb-3">{getIcon(doc.tipo)}</div>
            <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1 text-center">
              {doc.nombre}
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm text-center mb-2">{doc.descripcion}</div>
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {doc.actualizado && `Actualizado: ${new Date(doc.actualizado).toLocaleDateString("es-CO")}`}
              </span>
              <span className="ml-2 px-3 py-1 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-700 dark:text-blue-200 text-xs font-medium shadow group-hover:bg-blue-200 group-hover:text-blue-900 transition flex items-center gap-1">
                Descargar <HiDownload className="w-4 h-4" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}