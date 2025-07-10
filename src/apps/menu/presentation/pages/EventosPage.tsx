import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiCalendarDays,
  HiClock,
  HiMapPin,
  HiGlobeAlt,
  HiArrowLeft,
  HiExclamationTriangle,
  HiStar,
  HiPlus,
  HiPencil,
  HiTrash
} from "react-icons/hi2";
import { HiSearch } from "react-icons/hi";
import { EventoService } from "../../application/services/EventoService";
import { EventoCrudService } from "../../application/services/EventoCrudService"; // 👈 AGREGAR
import type { Evento, CreateEventoRequest, UpdateEventoRequest } from "../../domain/types";
import CrudModal from "../components/CrudModal";
import EventoForm from "../components/EventoForm";
import DeleteConfirmModal from "../components/DeleteConfirmModal"; // 👈 AGREGAR
import { useMenuPermissions } from "../hooks/useMenuPermissions";

export default function EventosPage() {
  const { id } = useParams();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoDetalle, setEventoDetalle] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVirtualOnly, setShowVirtualOnly] = useState(false);
  const [showImportantOnly, setShowImportantOnly] = useState(false);

  // 👈 AGREGAR: Estados para CRUD
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [crudLoading, setCrudLoading] = useState(false);

  // 👈 AGREGAR: Servicios
  const eventoCrudService = new EventoCrudService();
  const { isAdmin } = useMenuPermissions();

  const eventoService = new EventoService();

  useEffect(() => {
    if (id) {
      fetchEventoDetalle(parseInt(id));
    } else {
      fetchEventos();
    }
  }, [id]);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const data = await eventoService.getAllEventos(); // 👈 CAMBIAR: usar getAllEventos en lugar de getEventosProximos
      setEventos(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventoDetalle = async (eventoId: number) => {
    try {
      setLoading(true);
      const data = await eventoService.getEventoById(eventoId);
      setEventoDetalle(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching evento:', err);
    } finally {
      setLoading(false);
    }
  };

  // 👈 AGREGAR: Handler genérico para CRUD
  const handleSubmit = async (data: CreateEventoRequest | UpdateEventoRequest) => {
    setCrudLoading(true);
    
    let result;
    if ('id' in data) {
      // Es una actualización
      result = await eventoCrudService.updateEvento(data as UpdateEventoRequest);
      if (result.success) {
        setShowEditModal(false);
        setSelectedEvento(null);
        fetchEventos();
      }
    } else {
      // Es una creación
      result = await eventoCrudService.createEvento(data as CreateEventoRequest);
      if (result.success) {
        setShowCreateModal(false);
        fetchEventos();
      }
    }
    
    if (!result.success) {
      console.error(result.message);
      // TODO: Mostrar toast de error
    }
    
    setCrudLoading(false);
  };

  // 👈 AGREGAR: Handler para eliminar
  const handleDelete = async () => {
    if (!selectedEvento) return;

    setCrudLoading(true);
    const result = await eventoCrudService.deleteEvento(selectedEvento.id);

    if (result.success) {
      setShowDeleteModal(false);
      setSelectedEvento(null);
      fetchEventos();
      // TODO: Mostrar toast de éxito
    } else {
      // TODO: Mostrar toast de error
      console.error(result.message);
    }
    setCrudLoading(false);
  };

  // 👈 AGREGAR: Handlers para abrir modales
  const openEditModal = (evento: Evento) => {
    setSelectedEvento(evento);
    setShowEditModal(true);
  };

  const openDeleteModal = (evento: Evento) => {
    setSelectedEvento(evento);
    setShowDeleteModal(true);
  };

  const filteredEventos = eventoService.filterEventos(
    eventos,
    searchTerm,
    showVirtualOnly,
    showImportantOnly
  );

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatHora = (hora: string) => {
    return new Date(`2000-01-01T${hora}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilEvent = (fecha: string) => {
    return eventoService.getDaysUntilEvent(fecha);
  };

  const getEventColor = (importante: boolean, daysUntil: number) => {
    if (importante) return {
      bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
      icon: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-800'
    };
    
    if (daysUntil <= 1) return {
      bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-800'
    };
    
    if (daysUntil <= 7) return {
      bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
      icon: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-100 dark:bg-orange-800'
    };
    
    return {
      bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-800'
    };
  };

  const clearFilters = () => {
    setSearchTerm('');
    setShowVirtualOnly(false);
    setShowImportantOnly(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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

  // Si estamos viendo un evento específico
  if (id && eventoDetalle) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/eventos"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 font-medium"
          >
            <HiArrowLeft className="w-4 h-4" />
            Volver a eventos
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <HiCalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {eventoDetalle.importante && (
                      <span className="flex items-center gap-1 px-3 py-1 text-sm font-bold bg-amber-600 text-white rounded-full">
                        <HiStar className="w-4 h-4" />
                        IMPORTANTE
                      </span>
                    )}
                    {getDaysUntilEvent(eventoDetalle.fecha) <= 1 && (
                      <span className="px-3 py-1 text-sm font-bold bg-red-600 text-white rounded-full animate-pulse">
                        {getDaysUntilEvent(eventoDetalle.fecha) === 0 ? 'HOY' : 'MAÑANA'}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {eventoDetalle.titulo}
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <HiCalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatFecha(eventoDetalle.fecha)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <HiClock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hora</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatHora(eventoDetalle.hora)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {eventoDetalle.es_virtual ? (
                    <>
                      <HiGlobeAlt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Modalidad</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Virtual</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <HiMapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Lugar</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {eventoDetalle.lugar || 'Presencial'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Detalles del evento
                </h2>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {eventoDetalle.detalles}
                </div>
              </div>

              {eventoDetalle.enlace && (
                <div className="flex gap-4">
                  <a
                    href={eventoDetalle.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {eventoDetalle.es_virtual ? 'Unirse al evento' : 'Más información'}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de lista de eventos
  return (
    <div className="p-6">
      {/* Header y filtros */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <HiCalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Eventos y Actividades
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Mantente informado sobre las próximas actividades institucionales
              </p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <HiPlus className="w-5 h-5" />
              Agregar evento
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
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showVirtualOnly}
                  onChange={(e) => setShowVirtualOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Solo virtuales</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showImportantOnly}
                  onChange={(e) => setShowImportantOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Solo importantes</span>
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
      </div>

      {/* Lista de eventos */}
      {filteredEventos.length === 0 ? (
        <div className="text-center py-12">
          <HiCalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Intenta ajustar los filtros de búsqueda.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEventos.map((evento) => {
            const daysUntil = getDaysUntilEvent(evento.fecha);
            const colors = getEventColor(evento.importante, daysUntil);
            
            return (
              <div
                key={evento.id}
                className={`
                  p-6 rounded-xl border transition-all duration-200 hover:shadow-md
                  ${colors.bg}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${colors.iconBg}`}>
                    <HiCalendarDays className={`w-5 h-5 ${colors.icon}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {evento.importante && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold bg-amber-600 text-white rounded-full">
                          <HiStar className="w-3 h-3" />
                          IMPORTANTE
                        </span>
                      )}
                      {daysUntil <= 1 && (
                        <span className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded-full animate-pulse">
                          {daysUntil === 0 ? 'HOY' : 'MAÑANA'}
                        </span>
                      )}
                      {daysUntil > 1 && daysUntil <= 7 && (
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200 rounded-full">
                          En {daysUntil} días
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {evento.titulo}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {evento.detalles}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <HiCalendarDays className="w-4 h-4" />
                        <span>{formatFecha(evento.fecha)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <HiClock className="w-4 h-4" />
                        <span>{formatHora(evento.hora)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        {evento.es_virtual ? (
                          <>
                            <HiGlobeAlt className="w-4 h-4" />
                            Virtual
                          </>
                        ) : (
                          <>
                            <HiMapPin className="w-4 h-4" />
                            {evento.lugar || 'Presencial'}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Link
                          to={`/eventos/${evento.id}`}
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          Ver detalles
                        </Link>

                        {evento.enlace && (
                          <a
                            href={evento.enlace}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                          >
                            {evento.es_virtual ? 'Unirse' : 'Más info'}
                          </a>
                        )}
                      </div>

                      {/* 👈 AGREGAR: Botones CRUD */}
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(evento)}
                            className="flex items-center gap-1 px-3 py-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                          >
                            <HiPencil className="w-3 h-3" />
                            Editar
                          </button>
                          <button
                            onClick={() => openDeleteModal(evento)}
                            className="flex items-center gap-1 px-3 py-2 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                          >
                            <HiTrash className="w-3 h-3" />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 👈 AGREGAR: Modales CRUD */}
      <CrudModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Evento"
        loading={crudLoading}
        submitText="Crear"
      >
        <EventoForm
          onSubmit={handleSubmit}
          loading={crudLoading}
        />
      </CrudModal>

      <CrudModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEvento(null);
        }}
        title="Editar Evento"
        loading={crudLoading}
        submitText="Actualizar"
      >
        <EventoForm
          evento={selectedEvento}
          onSubmit={handleSubmit}
          loading={crudLoading}
        />
      </CrudModal>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEvento(null);
        }}
        onConfirm={handleDelete}
        loading={crudLoading}
        title="Eliminar Evento"
        message="¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer."
        itemName={selectedEvento ? selectedEvento.titulo : ''}
      />
    </div>
  );
}