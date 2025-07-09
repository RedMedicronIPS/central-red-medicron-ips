import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { HiCalendarDays, HiMapPin, HiClock, HiGlobeAlt, HiStar, HiArrowLeft } from "react-icons/hi2";
import { HiSearch } from "react-icons/hi";
import { MenuApiService } from "../../infrastructure/services/MenuApiService";
import type { Evento } from "../../domain/types";
import { HiPlus } from "react-icons/hi2";
import CrudModal from "../components/CrudModal";
import { EventoCrudService } from "../../application/services/EventoCrudService";
import EventoForm from "../components/EventoForm";
import { useMenuPermissions } from "../hooks/useMenuPermissions";
import type { CreateEventoRequest } from "../../domain/types";

export default function EventosPage() {
  const { id } = useParams();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoDetalle, setEventoDetalle] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVirtualOnly, setShowVirtualOnly] = useState(false);
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [crudLoading, setCrudLoading] = useState(false);
  const eventoCrudService = new EventoCrudService();
  const { isAdmin } = useMenuPermissions();

  // Maneja la creación de un nuevo evento
  const handleCreate = (eventoData: CreateEventoRequest) => {
    setCrudLoading(true);
    setError(null);
    eventoCrudService.createEvento(eventoData)
      .then((nuevoEvento) => {
        // Si createEvento retorna un objeto tipo { data: Evento }, ajusta aquí:
        const eventoToAdd = (nuevoEvento as any).data
          ? (nuevoEvento as any).data as Evento
          : (nuevoEvento as unknown as Evento);
        setEventos((prev) => [eventoToAdd, ...prev]);
        setShowCreateModal(false);
      })
      .catch((err) => {
        setError("Error al crear el evento");
        console.error("Error creating evento:", err);
      })
      .finally(() => {
        setCrudLoading(false);
      });
  };

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
      const data = await MenuApiService.getEventosProximos();
      setEventos(data);
    } catch (err) {
      setError('Error al cargar eventos');
      console.error('Error fetching eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventoDetalle = async (eventoId: number) => {
    try {
      setLoading(true);
      const data = await MenuApiService.getEvento(eventoId);
      setEventoDetalle(data);
    } catch (err) {
      setError('Error al cargar el evento');
      console.error('Error fetching evento:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEventos = eventos.filter(evento => {
    const matchesSearch = evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.detalles.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVirtual = !showVirtualOnly || evento.es_virtual;
    const matchesImportant = !showImportantOnly || evento.importante;

    return matchesSearch && matchesVirtual && matchesImportant;
  });

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
    const today = new Date();
    const eventDate = new Date(fecha);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
      {/* Header y filtros - igual que antes */}
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
            </div>
          </div>
        </div>
      </div>

      {/* Loading, error y lista de eventos - igual que antes pero con filteredEventos */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-600 dark:text-red-400">
          <p className="text-lg font-medium">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEventos.map((evento) => (
            <div
              key={evento.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Contenido del evento - similar al anterior pero con datos reales */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <HiCalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {evento.importante && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold bg-amber-600 text-white rounded-full">
                          <HiStar className="w-3 h-3" />
                          IMPORTANTE
                        </span>
                      )}
                      {getDaysUntilEvent(evento.fecha) <= 1 && (
                        <span className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded-full animate-pulse">
                          {getDaysUntilEvent(evento.fecha) === 0 ? 'HOY' : 'MAÑANA'}
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
                            <span>Virtual</span>
                          </>
                        ) : (
                          <>
                            <HiMapPin className="w-4 h-4" />
                            <span>{evento.lugar || 'Presencial'}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
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
        title="Crear Evento"
        onSubmit={() => {}}
        loading={crudLoading}
        submitText="Crear"
      >
        <EventoForm
          onSubmit={handleCreate}
          loading={crudLoading}
        />
      </CrudModal>
    </div>
  );
}