import { useEffect, useState } from "react";
import axiosInstance from "../../../../core/infrastructure/http/axiosInstance";
import { 
  FaEye, 
  FaDownload, 
  FaUpload, 
  FaTrash, 
  FaEdit, 
  FaFileAlt, 
  FaFilePdf, 
  FaFileExcel, 
  FaFileWord,
  FaSearch,
  FaFilter,
  FaTimes
} from "react-icons/fa";
import { HiOutlineDocumentText, HiOutlineCollection } from "react-icons/hi";

interface Process {
  id: number;
  name: string;
}

interface Documento {
  id: number;
  documento_padre: number | null;
  codigo_documento: string;
  nombre_documento: string;
  proceso: number;
  tipo_documento: string;
  version: number;
  estado: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  archivo_oficial: string;
  archivo_editable: string | null;
}

const TIPOS_DOCUMENTO = [
  { value: 'FC', label: 'Ficha de caracterización' },
  { value: 'MA', label: 'Matriz' },
  { value: 'PR', label: 'Procedimiento' },
  { value: 'DI', label: 'Documento interno' },
  { value: 'GU', label: 'Guía' },
  { value: 'PT', label: 'Protocolo' },
  { value: 'PL', label: 'Plan' },
  { value: 'IN', label: 'Instructivo' },
  { value: 'FR', label: 'Formato' },
  { value: 'DE', label: 'Documento externo' },
];

const ESTADOS = [
  { value: 'VIG', label: 'Vigente', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { value: 'OBS', label: 'Obsoleto', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
];

export default function ProcesosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [selectedProceso, setSelectedProceso] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewResult, setViewResult] = useState<Documento | null>(null);
  const [mensaje, setMensaje] = useState("");

  // Estados del formulario
  const [form, setForm] = useState<Partial<Documento>>({
    codigo_documento: "",
    nombre_documento: "",
    proceso: 0,
    tipo_documento: "",
    version: 1,
    estado: "VIG",
    activo: true,
  });

  useEffect(() => {
    fetchDocumentos();
    fetchProcesses();
  }, []);

  const fetchDocumentos = async () => {
    try {
      const response = await axiosInstance.get("/processes/documentos/");
      setDocumentos(response.data);
      setLoading(false);
    } catch (err) {
      setError("No se pudieron cargar los documentos");
      setLoading(false);
    }
  };

  const fetchProcesses = async () => {
    try {
      const response = await axiosInstance.get("/companies/processes/");
      setProcesses(response.data);
    } catch (err) {
      console.error("Error al cargar procesos:", err);
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename?.toLowerCase().split('.').pop();
    switch (ext) {
      case 'pdf': return <FaFilePdf className="text-red-500" />;
      case 'xls':
      case 'xlsx': return <FaFileExcel className="text-green-500" />;
      case 'doc':
      case 'docx': return <FaFileWord className="text-blue-500" />;
      default: return <FaFileAlt className="text-gray-500" />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    return TIPOS_DOCUMENTO.find(t => t.value === tipo)?.label || tipo;
  };

  const getEstadoStyle = (estado: string) => {
    return ESTADOS.find(e => e.value === estado)?.color || 'bg-gray-100 text-gray-800';
  };

  const getProcessName = (processId: number) => {
    return processes.find(p => p.id === processId)?.name || 'N/A';
  };

  const filteredDocumentos = documentos.filter(doc => {
    return (
      doc.nombre_documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.codigo_documento.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (selectedTipo === "" || doc.tipo_documento === selectedTipo) &&
    (selectedEstado === "" || doc.estado === selectedEstado) &&
    (selectedProceso === "" || doc.proceso.toString() === selectedProceso);
  });

  const handleView = (documento: Documento) => {
    setViewResult(documento);
    setIsViewModalOpen(true);
  };

  const handleDownload = (url: string, nombre: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <HiOutlineDocumentText className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Documentos de Procesos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestión de documentos del sistema de calidad
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FaUpload size={16} />
          Subir Documento
        </button>
      </div>

      {mensaje && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg dark:bg-green-900 dark:border-green-600 dark:text-green-200">
          {mensaje}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Todos los tipos</option>
            {TIPOS_DOCUMENTO.map(tipo => (
              <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
            ))}
          </select>
          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map(estado => (
              <option key={estado.value} value={estado.value}>{estado.label}</option>
            ))}
          </select>
          <select
            value={selectedProceso}
            onChange={(e) => setSelectedProceso(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Todos los procesos</option>
            {processes.map(proceso => (
              <option key={proceso.id} value={proceso.id}>{proceso.name}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedTipo("");
              setSelectedEstado("");
              setSelectedProceso("");
            }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <FaTimes size={14} />
            Limpiar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center">
            <HiOutlineCollection className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Total Documentos</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{filteredDocumentos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3">
              <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Vigentes</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {filteredDocumentos.filter(d => d.estado === 'VIG').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mr-3">
              <div className="w-3 h-3 bg-red-600 dark:bg-red-400 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-red-600 dark:text-red-400">Obsoletos</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {filteredDocumentos.filter(d => d.estado === 'OBS').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de documentos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Proceso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Versión
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Archivos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDocumentos.map((documento) => (
                <tr key={documento.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {documento.codigo_documento}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {documento.nombre_documento}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {getProcessName(documento.proceso)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {getTipoLabel(documento.tipo_documento)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      v{documento.version}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoStyle(documento.estado)}`}>
                      {ESTADOS.find(e => e.value === documento.estado)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <div className="flex items-center">
                        {getFileIcon(documento.archivo_oficial)}
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">Oficial</span>
                      </div>
                      {documento.archivo_editable && (
                        <div className="flex items-center">
                          {getFileIcon(documento.archivo_editable)}
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">Editable</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(documento)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Ver detalles"
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownload(documento.archivo_oficial, `${documento.codigo_documento}_oficial`)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="Descargar archivo oficial"
                      >
                        <FaDownload size={16} />
                      </button>
                      {documento.archivo_editable && (
                        <button
                          onClick={() => handleDownload(documento.archivo_editable!, `${documento.codigo_documento}_editable`)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="Descargar archivo editable"
                        >
                          <FaDownload size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDocumentos.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No se encontraron documentos que coincidan con los filtros aplicados.
          </div>
        )}
      </div>

      {/* Modal de visualización */}
      {isViewModalOpen && viewResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Detalles del Documento
              </h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Código:</span>
                <span className="text-gray-900 dark:text-gray-100">{viewResult.codigo_documento}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Nombre:</span>
                <span className="text-gray-900 dark:text-gray-100 text-right max-w-xs">
                  {viewResult.nombre_documento}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Proceso:</span>
                <span className="text-gray-900 dark:text-gray-100">{getProcessName(viewResult.proceso)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Tipo:</span>
                <span className="text-gray-900 dark:text-gray-100">{getTipoLabel(viewResult.tipo_documento)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Versión:</span>
                <span className="text-gray-900 dark:text-gray-100">v{viewResult.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Estado:</span>
                <span className={`px-2 py-1 rounded text-xs ${getEstadoStyle(viewResult.estado)}`}>
                  {ESTADOS.find(e => e.value === viewResult.estado)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Fecha de creación:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {new Date(viewResult.fecha_creacion).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}