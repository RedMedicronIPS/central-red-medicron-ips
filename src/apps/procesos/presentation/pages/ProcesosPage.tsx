import { useEffect, useState } from "react";
import * as XLSX from 'xlsx'; // Agregar import para Excel
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

// Agregar constantes para mensajes
const ROLE_MESSAGES = {
  user: {
    noPermission: "No tienes permisos para realizar esta acción. Contacta al gestor o administrador.",
    description: "Consulta de documentos del sistema de calidad",
    emptyState: "No hay documentos disponibles para consulta"
  },
  gestor: {
    noPermission: "No tienes permisos para gestionar documentos. Contacta al administrador.",
    description: "Consulta y descarga de documentos del sistema de calidad",
    emptyState: "No hay documentos disponibles para consulta y descarga"
  },
  admin: {
    description: "Gestión completa de documentos del sistema de calidad",
    emptyState: "Intenta ajustar los filtros de búsqueda"
  }
};

export default function ProcesosPage() {
  const { user, roles } = useAuthContext();

  // Definir los roles y permisos
  const isAdmin = roles.includes("admin");
  const isGestor = roles.includes("gestor");
  const isUser = roles.includes("user");

  // Permisos específicos
  const canViewDocuments = isAdmin || isGestor || isUser; // Todos pueden ver
  const canDownload = isAdmin || isGestor || isUser; // Solo admin y gestor pueden descargar
  const canManage = isAdmin; // Solo admin puede crear/editar/eliminar

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
  const [currentDocumentTitle, setCurrentDocumentTitle] = useState<string>("");
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

  // Nuevos estados para vista previa de Excel
  const [isExcelViewerOpen, setIsExcelViewerOpen] = useState(false);
  const [excelData, setExcelData] = useState<{ [key: string]: any[][] }>({});
  const [excelSheets, setExcelSheets] = useState<string[]>([]);
  const [currentSheet, setCurrentSheet] = useState<string>("");
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [currentExcelDocument, setCurrentExcelDocument] = useState<Documento | null>(null);
  const [currentExcelType, setCurrentExcelType] = useState<'oficial' | 'editable' | null>(null);

  // Agregar estos nuevos estados al inicio del componente
  const [isWordViewerOpen, setIsWordViewerOpen] = useState(false);
  const [currentWordDocument, setCurrentWordDocument] = useState<Documento | null>(null);
  const [currentWordType, setCurrentWordType] = useState<'oficial' | 'editable' | null>(null);

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

      // Solo agregar campos que han cambiado en modo edición
      if (isEditModalOpen && editingDocument) {
        // Crear un objeto con solo los campos modificados
        const changedFields: Partial<Record<keyof Documento, string | number | boolean | null>> = {};

        Object.keys(form).forEach(key => {
          const formValue = form[key as keyof Documento];
          const originalValue = editingDocument[key as keyof Documento];

          // Solo incluir si el valor ha cambiado
          if (formValue !== originalValue && formValue !== undefined && formValue !== null && formValue !== "") {
            changedFields[key as keyof Documento] = formValue as string | number | boolean | null;
          }
        });

        // Agregar solo campos modificados al FormData
        Object.keys(changedFields).forEach(key => {
          const value = changedFields[key as keyof Documento];
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        // Agregar archivos solo si se seleccionaron nuevos
        if (files.archivo_oficial) {
          formData.append('archivo_oficial', files.archivo_oficial);
        }
        if (files.archivo_editable) {
          formData.append('archivo_editable', files.archivo_editable);
        }

        // Usar PATCH en lugar de PUT
        const response = await axiosInstance.patch(`/processes/documentos/${editingDocument.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setDocumentos(prev => prev.map(doc => doc.id === editingDocument.id ? response.data : doc));
        setMensaje("Documento actualizado exitosamente");

      } else {
        // Para creación, agregar todos los campos (mantener lógica actual)
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

  // Función actualizada para manejar mejor los archivos Word
  const handleViewDocument = (documento: Documento, tipoArchivo: 'oficial' | 'editable' = 'oficial') => {
    const archivoUrl = tipoArchivo === 'oficial' ? documento.archivo_oficial : documento.archivo_editable;
    if (!archivoUrl) {
      setMensaje("No hay archivo disponible para visualizar");
      return;
    }

    const fileName = archivoUrl.toLowerCase();
    const token = localStorage.getItem('access_token');

    // Usar el endpoint de preview SIN token en query params
    const previewUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/processes/documentos/${documento.id}/preview/?tipo=${tipoArchivo}`;

    if (fileName.endsWith('.pdf')) {
      // Para PDFs, usar el visor integrado
      handleViewPDF(previewUrl, documento, tipoArchivo);
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      // Para Excel, usar el visor personalizado CON tipo de archivo
      handleViewExcel(previewUrl, documento, tipoArchivo);
    } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      // Para Word, abrir en nueva pestaña con descarga automática
      handleViewWord(previewUrl, documento, tipoArchivo);
    } else {
      // Para otros tipos de archivo
      handleViewOtherFile(previewUrl, fileName);
    }
  };

  // Función corregida para visualizar archivos Word
  const handleViewWord = async (previewUrl: string, documento: Documento, tipoArchivo: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(previewUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al cargar el archivo Word');

      const blob = await response.blob();
      const wordUrl = URL.createObjectURL(blob);

      // Configurar para el modal de Word
      setCurrentDocumentUrl(wordUrl);
      setCurrentDocumentTitle(`${documento.codigo_documento} v${documento.version} - ${documento.nombre_documento}`);
      setCurrentWordDocument(documento);
      setCurrentWordType(tipoArchivo as 'oficial' | 'editable');
      setIsWordViewerOpen(true);

    } catch (error) {
      console.error('Error al cargar archivo Word:', error);
      setFormError('Error al cargar el archivo Word. Inténtalo nuevamente.');
    }
  };

  // Función para visualizar archivos Excel
  const handleViewExcel = async (previewUrl: string, documento: Documento, tipoArchivo: 'oficial' | 'editable' = 'oficial') => {
    setLoadingExcel(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(previewUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) throw new Error('Error al cargar el archivo Excel');
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheets: string[] = workbook.SheetNames;
      const data: { [key: string]: any[][] } = {};
      sheets.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        data[sheetName] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      });
      setExcelData(data);
      setExcelSheets(sheets);
      setCurrentSheet(sheets[0]);
      setCurrentExcelDocument(documento); // Guardar referencia al documento
      setCurrentExcelType(tipoArchivo); // Guardar tipo de archivo
      setIsExcelViewerOpen(true);
    } catch (error) {
      console.error('Error al cargar Excel:', error);
      setFormError('Error al cargar el archivo Excel');
    } finally {
      setLoadingExcel(false);
    }
  };

  // Nueva función para manejar PDFs correctamente
  const handleViewPDF = async (previewUrl: string, documento: Documento, tipoArchivo: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(previewUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/pdf'
        }
      });

      if (!response.ok) throw new Error('Error al cargar el PDF');

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);

      setCurrentDocumentUrl(pdfUrl);
      setCurrentDocumentTitle(`${documento.codigo_documento} v${documento.version} - ${documento.nombre_documento} (${tipoArchivo})`);
      setIsDocumentViewerOpen(true);
    } catch (error) {
      console.error('Error al cargar PDF:', error);
      setFormError('Error al cargar el archivo PDF');
    }
  };

  // Función para visualizar otros tipos de archivos (Word, etc.)
  const handleViewOtherFile = async (previewUrl: string, fileName: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(previewUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al cargar el archivo');

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);

      // Para archivos Word, abrir en nueva pestaña ya que no se pueden previsualizar en iframe
      window.open(fileUrl, '_blank', 'noopener,noreferrer');

      // Opcional: mostrar mensaje informativo
      setMensaje("Archivo abierto en nueva pestaña. Nota: Los archivos Word se descargan automáticamente para su visualización.");

    } catch (error) {
      console.error('Error al cargar archivo:', error);
      setFormError('Error al cargar el archivo');
    }
  };

  // Función corregida para descarga con permisos por rol y formato
  const handleDownload = async (documento: Documento, tipoArchivo: 'oficial' | 'editable', nombre: string) => {
    // Verificar permisos de descarga
    if (!canDownload) {
      setFormError("No tienes permisos para descargar documentos. Contacta al administrador.");
      return;
    }

    // Verificar que el archivo sea descargable (Word/Excel)
    const archivoUrl = tipoArchivo === 'oficial' ? documento.archivo_oficial : documento.archivo_editable;
    if (!isFileDownloadable(archivoUrl ?? "")) {
      setFormError("Solo se pueden descargar archivos de Word y Excel para su diligenciamiento.");
      return;
    }

    // Solo admin puede descargar archivos editables
    if (tipoArchivo === 'editable' && !isAdmin) {
      setFormError("Solo los administradores pueden descargar archivos editables.");
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const downloadUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/processes/documentos/${documento.id}/download/?tipo=${tipoArchivo}`;

      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al descargar el archivo');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = nombre;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar el objeto URL
      URL.revokeObjectURL(url);

      setMensaje(`Archivo descargado: ${nombre}`);
    } catch (error) {
      console.error('Error al descargar:', error);
      setFormError('Error al descargar el archivo');
    }
  };

  // Función para verificar si un archivo es descargable
  const isFileDownloadable = (filename: string) => {
    const ext = filename?.toLowerCase().split('.').pop();
    return ['doc', 'docx', 'xls', 'xlsx'].includes(ext || '');
  };

  // Actualizar la función de filtrado para todos los roles (solo documentos vigentes para usuarios normales)
  const filteredDocumentos = documentos.filter(doc => {
    // Filtro básico por búsqueda, tipo y proceso
    const matchesBasicFilters = (
      doc.nombre_documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.codigo_documento.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
      (selectedTipo === "" || doc.tipo_documento === selectedTipo) &&
      (selectedProceso === "" || doc.proceso.toString() === selectedProceso);

    // Filtro por estado según el rol
    if (isUser) {
      // Usuarios básicos solo ven documentos vigentes
      return matchesBasicFilters && doc.estado === 'VIG';
    } else if (isGestor) {
      // Gestores solo ven documentos vigentes
      return matchesBasicFilters && doc.estado === 'VIG';
    } else if (isAdmin) {
      // Admin puede ver todos los estados (aplicar filtro de estado seleccionado)
      return matchesBasicFilters && (selectedEstado === "" || doc.estado === selectedEstado);
    }

    return false;
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
      {/* Header con permisos */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <HiOutlineDocumentText className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Documentos de Procesos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isAdmin ? 'Gestión completa de documentos del sistema de calidad' :
                isGestor ? 'Consulta y descarga de documentos del sistema de calidad' :
                  'Consulta de documentos del sistema de calidad'}
            </p>
          </div>
        </div>
        {/* Botón de subir solo para admin */}
        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaUpload size={16} />
            Subir Documento
          </button>
        )}
      </div>

      {/* Mensajes de estado */}
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

      {/* Filtros - Solo mostrar filtro de estado para admin */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${isAdmin ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            />
          </div>
          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          >
            <option value="">Todos los tipos</option>
            {TIPOS_DOCUMENTO.map(tipo => (
              <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
            ))}
          </select>

          {/* Filtro de estado solo para admin */}
          {isAdmin && (
            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            >
              <option value="">Todos los estados</option>
              {ESTADOS.map(estado => (
                <option key={estado.value} value={estado.value}>{estado.label}</option>
              ))}
            </select>
          )}

          <select
            value={selectedProceso}
            onChange={(e) => setSelectedProceso(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
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
              if (isAdmin) setSelectedEstado("");
              setSelectedProceso("");
            }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 justify-center"
          >
            <FaTimes size={14} />
            Limpiar
          </button>
        </div>
      </div>

      {/* Estadísticas según el rol */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors">
          <div className="flex items-center">
            <HiOutlineCollection className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {isAdmin ? 'Total Documentos' : 'Documentos Vigentes'}
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{filteredDocumentos.length}</p>
            </div>
          </div>
        </div>

        {/* Estadísticas específicas por rol */}
        {isAdmin && (
          <>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3">
                  <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Vigentes</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {documentos.filter(d => d.estado === 'VIG').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mr-3">
                  <div className="w-3 h-3 bg-red-600 dark:bg-red-400 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">Obsoletos</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {documentos.filter(d => d.estado === 'OBS').length}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Para gestores y usuarios */}
        {!isAdmin && (
          <>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center mr-3">
                  <FaFileAlt className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Tipos Disponibles</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {new Set(filteredDocumentos.map(d => d.tipo_documento)).size}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mr-3">
                  <HiOutlineCollection className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Procesos Activos</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {new Set(filteredDocumentos.map(d => d.proceso)).size}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tabla con permisos por rol */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                {/* Solo mostrar columna de estado para admin */}
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                )}
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
                <tr key={documento.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
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
                  {/* Columna de estado solo para admin */}
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoStyle(documento.estado)}`}>
                        {ESTADOS.find(e => e.value === documento.estado)?.label}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <div className="flex items-center">
                        {getFileIcon(documento.archivo_oficial)}
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                          Oficial
                          {(documento.archivo_oficial.toLowerCase().endsWith('.doc') ||
                            documento.archivo_oficial.toLowerCase().endsWith('.docx')) &&
                            <span className="block text-xs text-blue-500">(Descarga)</span>
                          }
                        </span>
                      </div>
                      {/* Solo mostrar archivo editable para admin */}
                      {isAdmin && documento.archivo_editable && (
                        <div className="flex items-center">
                          {getFileIcon(documento.archivo_editable)}
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">Editable</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {/* Ver detalles - Todos los roles */}
                      {canViewDocuments && (
                        <button
                          onClick={() => handleView(documento)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Ver detalles"
                        >
                          <FaEye size={16} />
                        </button>
                      )}

                      {/* Ver documento oficial - Todos los roles */}
                      {canViewDocuments && (
                        <button
                          onClick={() => handleViewDocument(documento, 'oficial')}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Ver documento oficial"
                          disabled={loadingExcel}
                        >
                          {loadingExcel ? (
                            <div className="animate-spin w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full"></div>
                          ) : (
                            <FaFileAlt size={16} />
                          )}
                        </button>
                      )}

                      {/* Descargar documento oficial - Solo gestor y admin, y solo para Word/Excel */}
                      {canDownload && isFileDownloadable(documento.archivo_oficial) && (
                        <button
                          onClick={() => handleDownload(documento, 'oficial', `${documento.codigo_documento}_oficial`)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="Descargar archivo oficial"
                        >
                          <FaDownload size={16} />
                        </button>
                      )}

                      {/* Acciones solo para admin */}
                      {isAdmin && (
                        <>
                          {/* Ver documento editable */}
                          {documento.archivo_editable && (
                            <button
                              onClick={() => handleViewDocument(documento, 'editable')}
                              className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                              title="Ver documento editable"
                              disabled={loadingExcel}
                            >
                              {loadingExcel ? (
                                <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                              ) : (
                                <FaEdit size={16} />
                              )}
                            </button>
                          )}

                          {/* Descargar archivo editable - Solo Word/Excel */}
                          {documento.archivo_editable && isFileDownloadable(documento.archivo_editable) && (
                            <button
                              onClick={() => handleDownload(documento, 'editable', `${documento.codigo_documento}_editable`)}
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
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
            <FaFileAlt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-lg font-medium">No se encontraron documentos</p>
            <p className="text-sm">
              {isUser ? 'No hay documentos disponibles para consulta' :
                isGestor ? 'No hay documentos disponibles para consulta y descarga' :
                  'Intenta ajustar los filtros de búsqueda'}
            </p>
          </div>
        )}
      </div>

      {/* Modales - Solo mostrar modales de gestión para admin */}
      {canManage && (isModalOpen || isEditModalOpen) && (
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
                    accept=".doc,.docx,.pdf,.xls,.xlsx"
                    className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    {...(!isEditModalOpen && { required: true })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Formatos permitidos: PDF, Excel, Word</p>
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

      {/* Modal de visualización de detalles - Mejorado */}
      {isViewModalOpen && viewResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 modal-backdrop">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl w-full max-w-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <FaFileAlt className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                Detalles del Documento
              </h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Código:</span>
                <span className="text-gray-900 dark:text-gray-100 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {viewResult.codigo_documento}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Nombre:</span>
                <span className="text-gray-900 dark:text-gray-100 text-right max-w-xs">
                  {viewResult.nombre_documento}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Proceso:</span>
                <span className="text-gray-900 dark:text-gray-100">{getProcessName(viewResult.proceso)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Tipo:</span>
                <span className="text-gray-900 dark:text-gray-100">{getTipoLabel(viewResult.tipo_documento)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Versión:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  v{viewResult.version}
                </span>
              </div>
              {isAdmin && (
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Documento Padre:</span>
                  <span className="text-gray-900 dark:text-gray-100 text-right max-w-xs">
                    {getDocumentPadreName(viewResult.documento_padre)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Estado:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoStyle(viewResult.estado)}`}>
                  {ESTADOS.find(e => e.value === viewResult.estado)?.label}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Fecha de creación:</span>
                <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
                  {new Date(viewResult.fecha_creacion).toLocaleDateString("es-CO")}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Última actualización:</span>
                <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
                  {new Date(viewResult.fecha_actualizacion).toLocaleDateString("es-CO")}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANTENER SOLO ESTE MODAL - Modal de visualización de documentos */}
      {isDocumentViewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {currentDocumentTitle || "Vista previa del documento"}
              </h3>
              <div className="flex space-x-2">
                {/* Botón "Abrir en nueva pestaña" ELIMINADO completamente */}
                <button
                  onClick={() => {
                    // Limpiar blob URL si existe
                    if (currentDocumentUrl.startsWith('blob:')) {
                      URL.revokeObjectURL(currentDocumentUrl);
                    }
                    setIsDocumentViewerOpen(false);
                    setCurrentDocumentUrl("");
                    setCurrentDocumentTitle("");
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={currentDocumentUrl}
                className="w-full h-full border-0 rounded"
                title={currentDocumentTitle}
                style={{ height: 'calc(100% - 60px)' }}
              />
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

      {/* Modal de visualización de Excel - Con botón de descarga */}
      {isExcelViewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700">
            {/* Header mejorado */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaFileExcel className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Vista Previa Excel
                  </h3>
                </div>
                {excelSheets.length > 1 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Hoja:</span>
                    <select
                      value={currentSheet}
                      onChange={(e) => setCurrentSheet(e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                    >
                      {excelSheets.map(sheet => (
                        <option key={sheet} value={sheet}>{sheet}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setIsExcelViewerOpen(false);
                  setExcelData({});
                  setExcelSheets([]);
                  setCurrentSheet("");
                  setCurrentExcelDocument(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Contenido de la tabla mejorado */}
            <div className="flex-1 p-4 overflow-auto bg-gray-50 dark:bg-gray-900">
              {excelData[currentSheet] && excelData[currentSheet].length > 0 ? (
                <div className="overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                  {/* Contenedor con scroll personalizado */}
                  <div className="excel-table-container max-h-[calc(90vh-200px)] overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {excelData[currentSheet].slice(0, 100).map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className={`transition-colors ${rowIndex === 0
                              ? 'bg-blue-50 dark:bg-blue-900/30 font-semibold sticky top-0 z-10'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                              }`}
                          >
                            {row.map((cell, colIndex) => (
                              <td
                                key={colIndex}
                                className={`px-4 py-3 text-sm border-r border-gray-200 dark:border-gray-600 max-w-xs ${rowIndex === 0
                                  ? 'text-blue-900 dark:text-blue-100 font-semibold bg-blue-50 dark:bg-blue-900/30'
                                  : 'text-gray-900 dark:text-gray-100'
                                  }`}
                                title={String(cell || '')}
                              >
                                <div className="truncate max-w-[200px]">
                                  {cell !== undefined && cell !== null ? String(cell) : ""}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mensaje de limitación mejorado */}
                  {excelData[currentSheet].length > 100 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5">
                          ⚠️
                        </div>
                        <div>
                          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                            <strong>Vista limitada:</strong> Se muestran las primeras 100 filas de {excelData[currentSheet].length} total.
                          </p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                            Para ver el contenido completo, descarga el archivo.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <FaFileExcel className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    No se pudo cargar el contenido
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                    El archivo Excel no contiene datos válidos
                  </p>
                </div>
              )}
            </div>

            {/* Footer mejorado con botón de descarga */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm">
                  {excelData[currentSheet] && (
                    <>
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Filas:</span>
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md font-mono">
                          {excelData[currentSheet].length}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Columnas:</span>
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded-md font-mono">
                          {excelData[currentSheet][0]?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Hoja:</span>
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-md font-mono">
                          {currentSheet}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex space-x-2">
                  {/* Botón de descarga - Solo si hay permisos */}
                  {/* {canDownload && */} {currentExcelDocument && (
                    <button
                      onClick={() => {
                        const tipoArchivo = currentExcelType || 'oficial';
                        handleDownload(currentExcelDocument, tipoArchivo, `${currentExcelDocument.codigo_documento}_${tipoArchivo}`);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 flex items-center gap-2"
                    >
                      <FaDownload size={16} />
                      Descargar Excel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsExcelViewerOpen(false);
                      setExcelData({});
                      setExcelSheets([]);
                      setCurrentSheet("");
                      setCurrentExcelDocument(null);
                    }}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal específico para documentos Word */}
      {isWordViewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl h-auto max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <FaFileWord className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Documento Word
                </h3>
              </div>
              <button
                onClick={() => {
                  if (currentDocumentUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(currentDocumentUrl);
                  }
                  setIsWordViewerOpen(false);
                  setCurrentDocumentUrl("");
                  setCurrentDocumentTitle("");
                  setCurrentWordDocument(null);
                  setCurrentWordType(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <FaFileWord className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {currentDocumentTitle}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Los documentos de Word no se pueden previsualizar directamente en el navegador.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>💡 Sugerencia:</strong>
                      {canDownload ? (
                        <span> Descarga el documento para abrirlo en Microsoft Word o un editor compatible.</span>
                      ) : (
                        <span> Contacta al administrador para obtener permisos de descarga.</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con botones */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  {currentWordDocument && (
                    <>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Código:</span>
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md font-mono">
                          {currentWordDocument.codigo_documento}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Versión:</span>
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded-md font-mono">
                          v{currentWordDocument.version}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Tipo:</span>
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-md font-mono">
                          {currentWordType}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex space-x-2">
                  {/* Botón de descarga - Solo si hay permisos */}
                  {currentWordDocument && (
                    <button
                      onClick={() => {
                        const tipoArchivo = currentWordType || 'oficial';
                        handleDownload(currentWordDocument, tipoArchivo, `${currentWordDocument.codigo_documento}_${tipoArchivo}`);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                    >
                      <FaDownload size={16} />
                      Descargar Word
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (currentDocumentUrl.startsWith('blob:')) {

                        URL.revokeObjectURL(currentDocumentUrl);
                      }
                      setIsWordViewerOpen(false);
                      setCurrentDocumentUrl("");
                      setCurrentDocumentTitle("");
                      setCurrentWordDocument(null);
                      setCurrentWordType(null);
                    }}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}