import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiNewspaper,
  HiCalendar,
  HiExclamationTriangle,
  HiArrowLeft,
  HiGlobeAlt,
  HiPlus
} from "react-icons/hi2";
import { HiSearch } from "react-icons/hi";
import { ContenidoService } from "../../application/services/ContenidoService"; // 👈 USAR SERVICE
import type { ContenidoInformativo, TipoContenido, CreateContenidoRequest } from "../../domain/types";
import CrudModal from "../components/CrudModal";
import { ContenidoCrudService } from "../../application/services/ContenidoCrudService";
import ContenidoForm from "../components/ContenidoForm";
import { useMenuPermissions } from "../hooks/useMenuPermissions";

export default function NoticiasPage() {
  const { id } = useParams();
  const [contenidos, setContenidos] = useState<ContenidoInformativo[]>([]);
  const [contenidoDetalle, setContenidoDetalle] = useState<ContenidoInformativo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<TipoContenido>('todos');
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [crudLoading, setCrudLoading] = useState(false);
  const contenidoCrudService = new ContenidoCrudService();
  const { isAdmin } = useMenuPermissions();

  const contenidoService = new ContenidoService(); // 👈 USAR SERVICE

  useEffect(() => {
    if (id) {
      fetchContenidoDetalle(parseInt(id));
    } else {
      fetchContenidos();
    }
  }, [id]);

  const fetchContenidos = async () => {
    try {
      setLoading(true);
      const data = await contenidoService.getAllContenidos(); // 👈 USAR SERVICE
      setContenidos(data);
    } catch (err: any) {
      setError(err.message); // 👈 USAR err.message para consistencia
      console.error('Error fetching contenidos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContenidoDetalle = async (contenidoId: number) => {
    try {
      setLoading(true);
      const data = await contenidoService.getContenidoById(contenidoId); // 👈 USAR SERVICE
      setContenidoDetalle(data);
    } catch (err: any) {
      setError(err.message); // 👈 USAR err.message para consistencia
      console.error('Error fetching contenido:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredContenidos = contenidoService.filterContenidos( // 👈 USAR SERVICE PARA FILTRAR
    contenidos,
    searchTerm,
    selectedTipo,
    showUrgentOnly
  );

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTipoColor = (tipo: string, urgente: boolean) => {
    if (urgente) return 'text-red-600 dark:text-red-400';
    return tipo === 'comunicado'
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-green-600 dark:text-green-400';
  };

  const getTipoBgColor = (tipo: string, urgente: boolean) => {
    if (urgente) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    return tipo === 'comunicado'
      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTipo('todos');
    setShowUrgentOnly(false);
  };

  const handleCreate = async (data: CreateContenidoRequest) => {
    setCrudLoading(true);
    const result = await contenidoCrudService.createContenido(data);
    if (result.success) {
      setShowCreateModal(false);
      fetchContenidos();
      // TODO: Mostrar toast de éxito
    } else {
      // TODO: Mostrar toast de error
      console.error(result.message);
    }
    setCrudLoading(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // Si estamos viendo un contenido específico
  if (id && contenidoDetalle) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/noticias"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 font-medium"
          >
            <HiArrowLeft className="w-4 h-4" />
            Volver a noticias
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <HiNewspaper className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`
                      px-3 py-1 text-sm font-medium rounded-full
                      ${getTipoBgColor(contenidoDetalle.tipo, contenidoDetalle.urgente)}
                    `}>
                      {contenidoDetalle.tipo === 'comunicado' ? 'Comunicado' : 'Noticia'}
                    </span>
                    {contenidoDetalle.urgente && (
                      <span className="px-3 py-1 text-sm font-bold bg-red-600 text-white rounded-full animate-pulse">
                        URGENTE
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {contenidoDetalle.titulo}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <HiCalendar className="w-4 h-4" />
                    {formatFecha(contenidoDetalle.fecha)}
                  </p>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none mb-8">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {contenidoDetalle.contenido}
                </div>
              </div>

              {contenidoDetalle.enlace && (
                <div className="flex gap-4">
                  <a
                    href={contenidoDetalle.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <HiGlobeAlt className="w-4 h-4" />
                    Ver enlace externo
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de lista de contenidos
  return (
    <div className="p-6">
      {/* Header y filtros */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <HiNewspaper className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Noticias y Comunicados
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Mantente informado con las últimas noticias y comunicados oficiales
              </p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <HiPlus className="w-5 h-5" />
              Agregar noticia
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Buscar noticias y comunicados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value as 'todos' | 'noticia' | 'comunicado')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="todos">Todos los tipos</option>
              <option value="noticia">Solo noticias</option>
              <option value="comunicado">Solo comunicados</option>
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showUrgentOnly}
                onChange={(e) => setShowUrgentOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Solo urgentes</span>
            </label>

            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de contenidos */}
      {filteredContenidos.length === 0 ? (
        <div className="text-center py-12">
          <HiNewspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Intenta ajustar los filtros de búsqueda.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredContenidos.map((contenido) => (
            <div
              key={contenido.id}
              className={`
                p-6 rounded-xl border transition-all duration-200 hover:shadow-md
                ${getTipoBgColor(contenido.tipo, contenido.urgente)}
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`
                  p-3 rounded-lg flex-shrink-0
                  ${contenido.urgente
                    ? 'bg-red-100 dark:bg-red-800'
                    : contenido.tipo === 'comunicado'
                      ? 'bg-blue-100 dark:bg-blue-800'
                      : 'bg-green-100 dark:bg-green-800'
                  }
                `}>
                  <HiNewspaper className={`w-5 h-5 ${getTipoColor(contenido.tipo, contenido.urgente)}`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${contenido.urgente
                        ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                        : contenido.tipo === 'comunicado'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                      }
                    `}>
                      {contenido.tipo === 'comunicado' ? 'Comunicado' : 'Noticia'}
                    </span>
                    {contenido.urgente && (
                      <span className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded-full animate-pulse">
                        URGENTE
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <HiCalendar className="w-3 h-3" />
                      {formatFecha(contenido.fecha)}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {contenido.titulo}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {contenido.contenido}
                  </p>

                  <div className="flex items-center justify-between">
                    <Link
                      to={`/noticias/${contenido.id}`}
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      Leer más
                    </Link>

                    {contenido.enlace && (
                      <a
                        href={contenido.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                      >
                        Enlace externo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modales CRUD */}
      <CrudModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Noticia o Comunicado"
        loading={crudLoading}
        submitText="Crear"
      >
        <ContenidoForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={crudLoading}
        />
      </CrudModal>
    </div>
  );
}