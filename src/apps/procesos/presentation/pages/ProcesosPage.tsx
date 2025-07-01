import { useEffect, useState } from "react";
//import { Document, Page, pdfjs } from 'react-pdf';
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
import { useAuthContext } from "../../../auth/presentation/context/AuthContext";

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
  const { user, roles } = useAuthContext();
  const isAdmin = roles.includes("admin");
  
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [selectedProceso, setSelectedProceso] = useState("");
  
  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  const [viewResult, setViewResult] = useState<Documento | null>(null);
  const [editingDocument, setEditingDocument] = useState<Documento | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Documento | null>(null);
  const [currentDocumentUrl, setCurrentDocumentUrl] = useState<string>("");
  const [mensaje, setMensaje] = useState("");
  const [formError, setFormError] = useState("");

  // Estados del formulario
  const [form, setForm] = useState<Partial<Documento>>({
    codigo_documento: "",
    nombre_documento: "",
    proceso: 0,
    tipo_documento: "",
    version: 1,
    estado: "VIG",
    activo: true,
    documento_padre: null,
  });

  const [files, setFiles] = useState<{
    archivo_oficial: File | null;
    archivo_editable: File | null;
  }>({
    archivo_oficial: null,
    archivo_editable: null,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles(prev => ({
        ...prev,
        [name]: selectedFiles[0]
      }));
    }
  };

  const validateForm = () => {
    if (!form.codigo_documento || !form.nombre_documento || !form.proceso || !form.tipo_documento) {
      setFormError("Todos los campos obligatorios deben estar completos.");
      return false;
    }
    if (!isEditModalOpen && !files.archivo_oficial) {
      setFormError("El archivo oficial es obligatorio.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setMensaje("");
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        const value = form[key as keyof Documento];
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value.toString());
        }
      });

      if (files.archivo_oficial) {
        formData.append('archivo_oficial', files.archivo_oficial);
      }
      if (files.archivo_editable) {
        formData.append('archivo_editable', files.archivo_editable);
      }

      if (isEditModalOpen && editingDocument) {
        const response = await axiosInstance.put(`/processes/documentos/${editingDocument.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setDocumentos(prev => prev.map(doc => doc.id === editingDocument.id ? response.data : doc));
        setMensaje("Documento actualizado exitosamente");
      } else {
        const response = await axiosInstance.post("/processes/documentos/", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setDocumentos(prev => [...prev, response.data]);
        setMensaje("Documento creado exitosamente");
      }
      
      resetForm();
      setIsModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error: any) {
      setFormError(error.response?.data?.detail || "Error al guardar el documento.");
    }
  };

  const handleEdit = (documento: Documento) => {
    if (!isAdmin) return;
    setEditingDocument(documento);
    setForm({
      codigo_documento: documento.codigo_documento,
      nombre_documento: documento.nombre_documento,
      proceso: documento.proceso,
      tipo_documento: documento.tipo_documento,
      version: documento.version,
      estado: documento.estado,
      activo: documento.activo,
      documento_padre: documento.documento_padre,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (documento: Documento) => {
    if (!isAdmin) return;
    setDocumentToDelete(documento);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;
    try {
      await axiosInstance.delete(`/processes/documentos/${documentToDelete.id}/`);
      setDocumentos(prev => prev.filter(doc => doc.id !== documentToDelete.id));
      setMensaje("Documento eliminado exitosamente");
    } catch {
      setFormError("Error al eliminar el documento.");
    } finally {
      setDocumentToDelete(null);
      setIsConfirmDeleteOpen(false);
    }
  };

  const resetForm = () => {
    setForm({
      codigo_documento: "",
      nombre_documento: "",
      proceso: 0,
      tipo_documento: "",
      version: 1,
      estado: "VIG",
      activo: true,
      documento_padre: null,
    });
    setFiles({
      archivo_oficial: null,
      archivo_editable: null,
    });
    setEditingDocument(null);
    setFormError("");
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

  const getDocumentPadreName = (documentoId: number | null) => {
    if (!documentoId) return 'N/A';
    const documento = documentos.find(d => d.id === documentoId);
    return documento ? `${documento.codigo_documento} v${documento.version}` : 'N/A';
  };

  const getDocumentosDisponiblesComoPadre = () => {
    if (isEditModalOpen && editingDocument) {
      // Excluir el documento actual y sus versiones relacionadas
      return documentos.filter(doc => 
        doc.id !== editingDocument.id && 
        doc.codigo_documento !== editingDocument.codigo_documento
      );
    }
    return documentos;
  };

  const handleView = (documento: Documento) => {
    setViewResult(documento);
    setIsViewModalOpen(true);
  };

  // Reemplaza el enfoque del iframe con abrir en una nueva pestaña
const handleViewDocument = (url: string) => {
  const fullUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${url}`;
  window.open(fullUrl, '_blank', 'noopener,noreferrer');
};


// Configurar el worker con protocolo HTTPS
//pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

//const handleViewDocument = (url: string) => {
//  const fullUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${url}`;
  
//  if (url.toLowerCase().endsWith('.pdf')) {
//    setCurrentDocumentUrl(fullUrl);
//    setIsDocumentViewerOpen(true);
//  } else {
//    window.open(fullUrl, '_blank', 'noopener,noreferrer');
//  }
//};

  const handleDownload = (url: string, nombre: string) => {
    if (!isAdmin) {
      setFormError("Solo los administradores pueden descargar documentos.");
      return;
    }
    
    const fullUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${url}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = nombre;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaUpload size={16} />
            Subir Documento
          </button>
        )}
      </div>

      {mensaje && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg dark:bg-green-900 dark:border-green-600 dark:text-green-200">
          {mensaje}
        </div>
      )}

      {formError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-600 dark:text-red-200">
          {formError}
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
                      
                      {/* Ver documento oficial */}
                      <button
                        onClick={() => handleViewDocument(documento.archivo_oficial)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="Ver documento oficial"
                      >
                        <FaFileAlt size={16} />
                      </button>
                      
                      {/* Ver documento editable (solo si existe) */}
                      {documento.archivo_editable && (
                        <button
                          onClick={() => handleViewDocument(documento.archivo_editable!)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="Ver documento editable"
                        >
                          <FaEdit size={16} />
                        </button>
                      )}
                      
                      {/* Descargar - solo admin */}
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleDownload(documento.archivo_oficial, `${documento.codigo_documento}_oficial`)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            title="Descargar archivo oficial"
                          >
                            <FaDownload size={16} />
                          </button>
                          
                          {/* Descargar archivo editable (solo si existe) */}
                          {documento.archivo_editable && (
                            <button
                              onClick={() => handleDownload(documento.archivo_editable!, `${documento.codigo_documento}_editable`)}
                              className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                              title="Descargar archivo editable"
                            >
                              <FaDownload size={16} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleEdit(documento)}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                            title="Editar documento"
                          >
                            <FaEdit size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(documento)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Eliminar documento"
                          >
                            <FaTrash size={16} />
                          </button>
                        </>
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

      {/* Modal de formulario (crear/editar) */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl w-full max-w-2xl mx-auto my-4">
            <h2 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
              {isEditModalOpen ? "Editar" : "Subir"} Documento
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && <div className="text-red-600 dark:text-red-400">{formError}</div>}
              
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Código del Documento</label>
                  <input
                    type="text"
                    name="codigo_documento"
                    value={form.codigo_documento || ""}
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Versión</label>
                  <input
                    type="number"
                    name="version"
                    value={form.version || 1}
                    onChange={handleChange}
                    min="1"
                    className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre del Documento</label>
                  <input
                    type="text"
                    name="nombre_documento"
                    value={form.nombre_documento || ""}
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Proceso</label>
                  <select
                    name="proceso"
                    value={form.proceso || ""}
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="">Seleccione un proceso</option>
                    {processes.map(proceso => (
                      <option key={proceso.id} value={proceso.id}>{proceso.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tipo de Documento</label>
                  <select
                    name="tipo_documento"
                    value={form.tipo_documento || ""}
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    {TIPOS_DOCUMENTO.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Estado</label>
                  <select
                    name="estado"
                    value={form.estado || "VIG"}
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  >
                    {ESTADOS.map(estado => (
                      <option key={estado.value} value={estado.value}>{estado.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Documento Padre (Opcional)</label>
                  <select
                    name="documento_padre"
                    value={form.documento_padre || ""}
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Sin documento padre</option>
                    {getDocumentosDisponiblesComoPadre().map(documento => (
                      <option key={documento.id} value={documento.id}>
                        {documento.codigo_documento} v{documento.version} - {documento.nombre_documento}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Seleccione un documento padre si esta es una nueva versión
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Archivo Oficial {!isEditModalOpen && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="file"
                    name="archivo_oficial"
                    onChange={handleFileChange}
                    accept=".pdf,.xls,.xlsx"
                    className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    {...(!isEditModalOpen && { required: true })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Formatos permitidos: PDF, Excel</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Archivo Editable (Opcional)</label>
                  <input
                    type="file"
                    name="archivo_editable"
                    onChange={handleFileChange}
                    accept=".doc,.docx,.xls,.xlsx"
                    className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Formatos permitidos: Word, Excel</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {isEditModalOpen ? "Actualizar" : "Subir"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de visualización de detalles */}
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
                <span className="font-medium text-gray-700 dark:text-gray-300">Documento Padre:</span>
                <span className="text-gray-900 dark:text-gray-100 text-right max-w-xs">
                  {getDocumentPadreName(viewResult.documento_padre)}
                </span>
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
                  {new Date(viewResult.fecha_creacion).toLocaleDateString("es-CO")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Última actualización:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {new Date(viewResult.fecha_actualizacion).toLocaleDateString("es-CO")}
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

      {/* Modal de visualización de documentos */}
      {isDocumentViewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Visor de Documento
              </h3>
              <button
                onClick={() => setIsDocumentViewerOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className="flex-1 p-4">
              {currentDocumentUrl.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={currentDocumentUrl}
                  className="w-full h-full border-0 rounded"
                  title="Documento PDF"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-center mb-4">
                    <FaFileAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Este tipo de archivo no se puede visualizar en línea.
                    </p>
                    {isAdmin && (
                      <button
                        onClick={() => window.open(currentDocumentUrl, '_blank')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Abrir archivo
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {isConfirmDeleteOpen && documentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl w-full max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Confirmar Eliminación</h3>
            <p className="mb-6 text-gray-700 dark:text-gray-200">
              ¿Estás seguro de que deseas eliminar el documento "{documentToDelete.nombre_documento}"? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                onClick={() => {
                  setIsConfirmDeleteOpen(false);
                  setDocumentToDelete(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}