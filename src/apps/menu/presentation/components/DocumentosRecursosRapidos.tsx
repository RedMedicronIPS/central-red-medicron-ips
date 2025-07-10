import React, { useState } from "react";
import { HiDocumentText, HiOutlineDocumentText, HiOutlineClipboard, HiCalendarDays, HiSparkles, HiFolder, HiEye, HiArrowTopRightOnSquare } from "react-icons/hi2";
import { HiDownload, HiExternalLink } from "react-icons/hi";

const DOCUMENTOS = [
  {
    id: 1,
    nombre: "Reglamento Interno de Trabajo",
    url: "https://drive.google.com/file/d/1cQNXCgqIVhfINusXTFOAlRnSSEZPwY23/view?usp=sharing",
    tipo: "reglamento",
    descripcion: "Normas y políticas internas de la institución para el correcto funcionamiento laboral.",
    actualizado: "2024-06-01",
    tamano: "2.5 MB",
    popular: true,
    categoria: "Legal"
  },
  {
    id: 2,
    nombre: "Manual de Convivencia",
    url: "#",
    tipo: "manual",
    descripcion: "Guía completa para la sana convivencia laboral y resolución de conflictos.",
    actualizado: "2024-05-15",
    tamano: "1.8 MB",
    popular: false,
    categoria: "Recursos Humanos"
  },
  {
    id: 3,
    nombre: "Formato de Permiso",
    url: "#",
    tipo: "formato",
    descripcion: "Solicitud oficial de permisos laborales y procedimientos administrativos.",
    actualizado: "2024-04-10",
    tamano: "245 KB",
    popular: true,
    categoria: "Formularios"
  },
  {
    id: 4,
    nombre: "Protocolo de Seguridad",
    url: "#",
    tipo: "protocolo",
    descripcion: "Procedimientos de seguridad y salud ocupacional en el trabajo.",
    actualizado: "2024-07-01",
    tamano: "3.2 MB",
    popular: false,
    categoria: "Seguridad"
  },
  {
    id: 5,
    nombre: "Código de Ética",
    url: "#",
    tipo: "codigo",
    descripcion: "Principios éticos y conducta profesional en la institución.",
    actualizado: "2024-03-20",
    tamano: "1.1 MB",
    popular: true,
    categoria: "Ética"
  },
  {
    id: 6,
    nombre: "Manual de Procedimientos",
    url: "#",
    tipo: "manual",
    descripcion: "Guía detallada de todos los procedimientos operativos internos.",
    actualizado: "2024-06-25",
    tamano: "4.7 MB",
    popular: false,
    categoria: "Operaciones"
  }
];

interface DocumentoProps {
  tipo: string;
  popular?: boolean;
}

function getIcon(tipo: string, popular: boolean = false) {
  const iconClass = `w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${popular ? 'animate-pulse' : ''}`;
  
  switch (tipo) {
    case "reglamento":
      return <HiOutlineClipboard className={`${iconClass} text-white`} />;
    case "manual":
      return <HiOutlineDocumentText className={`${iconClass} text-white`} />;
    case "formato":
      return <HiDocumentText className={`${iconClass} text-white`} />;
    case "protocolo":
      return <HiFolder className={`${iconClass} text-white`} />;
    case "codigo":
      return <HiOutlineClipboard className={`${iconClass} text-white`} />;
    default:
      return <HiDocumentText className={`${iconClass} text-white`} />;
  }
}

function getTipoColor(tipo: string) {
  switch (tipo) {
    case "reglamento":
      return "from-blue-400 to-blue-500";
    case "manual":
      return "from-green-400 to-green-500";
    case "formato":
      return "from-amber-400 to-amber-500";
    case "protocolo":
      return "from-purple-400 to-purple-500";
    case "codigo":
      return "from-rose-400 to-rose-500";
    default:
      return "from-gray-400 to-gray-500";
  }
}

function getTipoBgColor(tipo: string) {
  switch (tipo) {
    case "reglamento":
      return "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/25 border-blue-200 dark:border-blue-700";
    case "manual":
      return "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/25 border-green-200 dark:border-green-700";
    case "formato":
      return "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/25 border-amber-200 dark:border-amber-700";
    case "protocolo":
      return "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/25 border-purple-200 dark:border-purple-700";
    case "codigo":
      return "from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/25 border-rose-200 dark:border-rose-700";
    default:
      return "from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/25 border-gray-200 dark:border-gray-700";
  }
}

function getTipoTextColor(tipo: string) {
  switch (tipo) {
    case "reglamento":
      return "text-blue-700 dark:text-blue-300";
    case "manual":
      return "text-green-700 dark:text-green-300";
    case "formato":
      return "text-amber-700 dark:text-amber-300";
    case "protocolo":
      return "text-purple-700 dark:text-purple-300";
    case "codigo":
      return "text-rose-700 dark:text-rose-300";
    default:
      return "text-gray-700 dark:text-gray-300";
  }
}

export default function DocumentosRecursosRapidos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categorias = ["Todos", ...new Set(DOCUMENTOS.map(doc => doc.categoria))];
  
  const filteredDocuments = DOCUMENTOS.filter(doc => {
    const matchesSearch = doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || doc.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="relative overflow-hidden">
      {/* Fondo decorativo suave */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-300/5 to-purple-300/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-300/5 to-blue-300/5 rounded-full blur-3xl"></div>
      
      <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
        {/* Header suave */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl shadow-lg">
              <HiFolder className="w-8 h-8 text-white" />
            </div>
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <HiSparkles className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-700 via-gray-700 to-slate-600 dark:from-slate-200 dark:via-gray-200 dark:to-slate-300 bg-clip-text text-transparent mb-2">
            Documentos y Recursos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Accede rápidamente a todos los documentos importantes de la institución
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiDocumentText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 dark:focus:border-slate-500 transition-all duration-300 shadow-sm"
            />
          </div>

          {/* Filtros por categoría */}
          <div className="flex flex-wrap gap-2">
            {categorias.map(categoria => (
              <button
                key={categoria}
                onClick={() => setSelectedCategory(categoria)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === categoria
                    ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-md hover:shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de documentos mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className={`
                group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer
                bg-gradient-to-br ${getTipoBgColor(doc.tipo)} shadow-md
              `}
            >
              {/* Efecto de brillo en hover más sutil */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
              
              {/* Badge de popular */}
              {doc.popular && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-semibold rounded-full shadow-sm animate-pulse">
                    <HiSparkles className="w-3 h-3" />
                    Popular
                  </div>
                </div>
              )}

              {/* Línea de acento superior más suave */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getTipoColor(doc.tipo)} opacity-80`}></div>

              <div className="relative p-6">
                {/* Icono y categoría */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl shadow-md bg-gradient-to-br ${getTipoColor(doc.tipo)} transition-transform duration-300 group-hover:scale-105`}>
                      {getIcon(doc.tipo, doc.popular)}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${getTipoColor(doc.tipo)} text-white shadow-sm`}>
                      {doc.categoria}
                    </span>
                  </div>
                </div>

                {/* Título */}
                <h3 className={`text-lg font-bold mb-2 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors duration-300 line-clamp-2 ${getTipoTextColor(doc.tipo)}`}>
                  {doc.nombre}
                </h3>

                {/* Descripción */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {doc.descripcion}
                </p>

                {/* Información adicional */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <HiCalendarDays className="w-4 h-4" />
                    <span className="font-medium">Actualizado: {formatDate(doc.actualizado)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <HiDocumentText className="w-4 h-4" />
                    <span className="font-medium">Tamaño: {doc.tamano}</span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      group/btn flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg
                      bg-gradient-to-r ${getTipoColor(doc.tipo)} text-white hover:opacity-90
                    `}
                  >
                    <HiEye className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                    <span>Ver</span>
                  </a>
                  
                  <a
                    href={doc.url}
                    download
                    className="flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                    title="Descargar"
                  >
                    <HiDownload className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <HiDocumentText className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No se encontraron documentos
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Intenta ajustar los filtros de búsqueda o la categoría seleccionada
            </p>
          </div>
        )}

      </div>
    </div>
  );
}