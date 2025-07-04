import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import type { Process } from '../../../domain/entities/Process';
import type { DocumentPermissions } from '../../../application/services/PermissionService';
import type { DocumentFilters as IDocumentFilters } from '../../hooks/useDocumentFilters';
import { TIPOS_DOCUMENTO, ESTADOS } from '../../../domain/types';

interface DocumentFiltersProps {
  filters: IDocumentFilters;
  processes: Process[];
  permissions: DocumentPermissions;
  onUpdateFilter: (key: keyof IDocumentFilters, value: string) => void;
  onClearFilters: () => void;
}

export default function DocumentFilters({
  filters,
  processes,
  permissions,
  onUpdateFilter,
  onClearFilters
}: DocumentFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${permissions.isAdmin ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={filters.searchTerm}
            onChange={(e) => onUpdateFilter('searchTerm', e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          />
        </div>
        <select
          value={filters.selectedTipo}
          onChange={(e) => onUpdateFilter('selectedTipo', e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
        >
          <option value="">Todos los tipos</option>
          {TIPOS_DOCUMENTO.map(tipo => (
            <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
          ))}
        </select>

        {/* Filtro de estado solo para admin */}
        {permissions.isAdmin && (
          <select
            value={filters.selectedEstado}
            onChange={(e) => onUpdateFilter('selectedEstado', e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map(estado => (
              <option key={estado.value} value={estado.value}>{estado.label}</option>
            ))}
          </select>
        )}

        <select
          value={filters.selectedProceso}
          onChange={(e) => onUpdateFilter('selectedProceso', e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
        >
          <option value="">Todos los procesos</option>
          {processes.map(proceso => (
            <option key={proceso.id} value={proceso.id}>{proceso.name}</option>
          ))}
        </select>
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 justify-center"
        >
          <FaTimes size={14} />
          Limpiar
        </button>
      </div>
    </div>
  );
}