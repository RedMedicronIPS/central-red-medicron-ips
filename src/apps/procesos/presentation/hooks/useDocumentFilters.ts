import { useState, useMemo } from 'react';
import type { Document } from '../../domain/entities/Document';
import type { DocumentPermissions } from '../../application/services/PermissionService';

export interface DocumentFilters {
  searchTerm: string;
  selectedTipo: string;
  selectedEstado: string;
  selectedProceso: string;
}


export const useDocumentFilters = (documents: Document[], permissions: DocumentPermissions) => {
  const [filters, setFilters] = useState<DocumentFilters>({
    searchTerm: '',
    selectedTipo: '',
    selectedEstado: '',
    selectedProceso: ''
  });

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Filtro básico por búsqueda, tipo y proceso
      const matchesBasicFilters = (
        doc.nombre_documento.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
        doc.codigo_documento.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) &&
        (filters.selectedTipo === "" || doc.tipo_documento === filters.selectedTipo) &&
        (filters.selectedProceso === "" || doc.proceso.toString() === filters.selectedProceso);

      // Filtro por estado según el rol
      if (permissions.isUser || permissions.isGestor) {
        // Usuarios básicos y gestores solo ven documentos vigentes
        return matchesBasicFilters && doc.estado === 'VIG';
      } else if (permissions.isAdmin) {
        // Admin puede ver todos los estados (aplicar filtro de estado seleccionado)
        return matchesBasicFilters && (filters.selectedEstado === "" || doc.estado === filters.selectedEstado);
      }

      return false;
    });
  }, [documents, filters, permissions]);

  const updateFilter = (key: keyof DocumentFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      selectedTipo: '',
      selectedEstado: '',
      selectedProceso: ''
    });
  };

  return {
    filters,
    filteredDocuments,
    updateFilter,
    clearFilters
  };
};