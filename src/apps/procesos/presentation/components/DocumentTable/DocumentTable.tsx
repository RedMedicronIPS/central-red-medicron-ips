import React from 'react';
import { FaFileAlt } from 'react-icons/fa';
import type { Document } from '../../../domain/entities/Document';
import type { Process } from '../../../domain/entities/Process';
import type { DocumentPermissions } from '../../../application/services/PermissionService';
import { PermissionService } from '../../../application/services/PermissionService';
import DocumentRow from './DocumentRow';

interface DocumentTableProps {
  documents: Document[];
  processes: Process[];
  permissions: DocumentPermissions;
  onView: (doc: Document) => void;
  onViewDocument: (doc: Document, type: 'oficial' | 'editable') => void;
  onDownload: (doc: Document, type: 'oficial' | 'editable', name: string) => void;
  onEdit: (doc: Document) => void;
  onDelete: (doc: Document) => void;
  loadingExcel: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function DocumentTable({
  documents,
  processes,
  permissions,
  onView,
  onViewDocument,
  onDownload,
  onEdit,
  onDelete,
  loadingExcel,
}: DocumentTableProps) {
  const getEmptyMessage = () => {
    const role = permissions.isAdmin ? 'admin' : permissions.isGestor ? 'gestor' : 'user';
    return PermissionService.getPermissionMessage(role, 'emptyState');
  };


  return (
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
              {permissions.isAdmin && (
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
            {documents.map((document) => (
              <DocumentRow
                key={document.id}
                document={document}
                processes={processes}
                permissions={permissions}
                onView={onView}
                onViewDocument={onViewDocument}
                onDownload={onDownload}
                onEdit={onEdit}
                onDelete={onDelete}
                loadingExcel={loadingExcel}
              />
            ))}
          </tbody>
        </table>
      </div>
      {documents.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
          <FaFileAlt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-lg font-medium">No se encontraron documentos</p>
          <p className="text-sm">{getEmptyMessage()}</p>
        </div>
      )}
    </div>
  );
}