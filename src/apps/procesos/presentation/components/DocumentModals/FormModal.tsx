import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import type { Document } from '../../../domain/entities/Document';
import type { Process } from '../../../domain/entities/Process';
import type { DocumentService } from '../../../application/services/DocumentService';
import { TIPOS_DOCUMENTO, ESTADOS } from '../../../domain/types';

interface FormModalProps {
  isEdit?: boolean;
  document?: Document;
  processes: Process[];
  documentService: DocumentService;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export default function FormModal({
  isEdit = false,
  document,
  processes,
  documentService,
  onSubmit,
  onCancel
}: FormModalProps) {
  const [form, setForm] = useState<Partial<Document>>({
    codigo_documento: document?.codigo_documento || "",
    nombre_documento: document?.nombre_documento || "",
    proceso: document?.proceso || 0,
    tipo_documento: document?.tipo_documento || "",
    version: document?.version || 1,
    estado: document?.estado || "VIG",
    activo: document?.activo ?? true,
    documento_padre: document?.documento_padre || null,
  });

  const [files, setFiles] = useState<{
    archivo_oficial: File | null;
    archivo_editable: File | null;
  }>({
    archivo_oficial: null,
    archivo_editable: null,
  });

  const [formError, setFormError] = useState("");

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
    if (!isEdit && !files.archivo_oficial) {
      setFormError("El archivo oficial es obligatorio.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!validateForm()) return;

    try {
      const formData = new FormData();

      if (isEdit && document) {
        // Para edición, solo agregar campos modificados
        const changedFields: Partial<Record<keyof Document, string | number | boolean | null>> = {};

        Object.keys(form).forEach(key => {
          const formValue = form[key as keyof Document];
          const originalValue = document[key as keyof Document];

          if (formValue !== originalValue && formValue !== undefined && formValue !== null && formValue !== "") {
            changedFields[key as keyof Document] = formValue as string | number | boolean | null;
          }
        });

        Object.keys(changedFields).forEach(key => {
          const value = changedFields[key as keyof Document];
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
      } else {
        // Para creación, agregar todos los campos
        Object.keys(form).forEach(key => {
          const value = form[key as keyof Document];
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value.toString());
          }
        });
      }

      if (files.archivo_oficial) {
        formData.append('archivo_oficial', files.archivo_oficial);
      }
      if (files.archivo_editable) {
        formData.append('archivo_editable', files.archivo_editable);
      }

      await onSubmit(formData);
    } catch (error: any) {
      setFormError(error.response?.data?.detail || "Error al guardar el documento.");
    }
  };

  const getDocumentosDisponiblesComoPadre = () => {
    if (isEdit && document) {
      // Excluir el documento actual y sus versiones relacionadas
      return documentService.getDocumentosDisponiblesComoPadre([], document);
    }
    return [];
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl w-full max-w-2xl mx-auto my-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? "Editar" : "Subir"} Documento
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-600 dark:text-red-200">
              {formError}
            </div>
          )}

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Código del Documento
              </label>
              <input
                type="text"
                name="codigo_documento"
                value={form.codigo_documento || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Versión
              </label>
              <input
                type="number"
                name="version"
                value={form.version || 1}
                onChange={handleChange}
                min="1"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Nombre del Documento
              </label>
              <input
                type="text"
                name="nombre_documento"
                value={form.nombre_documento || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Proceso
              </label>
              <select
                name="proceso"
                value={form.proceso || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                required
              >
                <option value="">Seleccione un proceso</option>
                {processes.map(proceso => (
                  <option key={proceso.id} value={proceso.id}>
                    {proceso.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Tipo de Documento
              </label>
              <select
                name="tipo_documento"
                value={form.tipo_documento || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                required
              >
                <option value="">Seleccione un tipo</option>
                {TIPOS_DOCUMENTO.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={form.estado || "VIG"}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                required
              >
                {ESTADOS.map(estado => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Documento Padre (Opcional)
              </label>
              <select
                name="documento_padre"
                value={form.documento_padre || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              >
                <option value="">Sin documento padre</option>
                {getDocumentosDisponiblesComoPadre().map(documento => (
                  <option key={documento.id} value={documento.id}>
                    {documento.codigo_documento} v{documento.version} - {documento.nombre_documento}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Seleccione un documento padre si esta es una nueva versión
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Archivo Oficial {!isEdit && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                name="archivo_oficial"
                onChange={handleFileChange}
                accept=".doc,.docx,.pdf,.xls,.xlsx"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
                {...(!isEdit && { required: true })}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Formatos permitidos: PDF, Excel, Word
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Archivo Editable (Opcional)
              </label>
              <input
                type="file"
                name="archivo_editable"
                onChange={handleFileChange}
                accept=".doc,.docx,.xls,.xlsx"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900 dark:file:text-green-200"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Formatos permitidos: Word, Excel
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {isEdit ? "Actualizar" : "Subir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}