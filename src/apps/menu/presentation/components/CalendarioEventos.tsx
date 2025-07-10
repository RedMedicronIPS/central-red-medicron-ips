import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  HiCalendarDays, 
  HiClock, 
  HiMapPin, 
  HiGlobeAlt, 
  HiArrowRight,
  HiExclamationTriangle,
  HiStar
} from "react-icons/hi2";
import { EventoService } from "../../application/services/EventoService"; // 👈 USAR SERVICE
import type { Evento } from "../../domain/types";
import { formatDisplayDate, getDaysUntilDate } from "../../../../shared/utils/dateUtils";

export default function CalendarioEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const eventoService = new EventoService(); // 👈 USAR SERVICE

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        const data = await eventoService.getEventosProximos(); // 👈 USAR SERVICE
        // Ordenar por fecha ascendente y tomar los primeros 5
        const sortedData = data.slice(0, 5);
        setEventos(sortedData);
      } catch (err: any) {
        setError(err.message); // 👈 USAR err.message para consistencia
        console.error('Error fetching eventos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  const formatFecha = (fecha: string) => {
    return formatDisplayDate(fecha, {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }); // 👈 USAR UTILIDAD
  };

  const formatHora = (hora: string) => {
    return new Date(`2000-01-01T${hora}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilEvent = (fecha: string) => {
    return getDaysUntilDate(fecha); // 👈 USAR UTILIDAD
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

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 backdrop-blur-md">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 backdrop-blur-md">
        <div className="text-center text-red-600 dark:text-red-400">
          <HiExclamationTriangle className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Próximos Eventos
        </h2>
        <Link
          to="/eventos"
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
        >
          Ver todos
          <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {eventos.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <HiCalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No hay eventos próximos programados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {eventos.map((evento) => {
            const daysUntil = getDaysUntilEvent(evento.fecha);
            const colors = getEventColor(evento.importante, daysUntil);
            
            return (
              <div
                key={evento.id}
                className={`
                  p-4 rounded-xl border transition-all duration-200 hover:shadow-md
                  ${colors.bg}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${colors.iconBg}`}>
                    <HiCalendarDays className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
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
                    
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {evento.titulo}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {evento.detalles}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <HiCalendarDays className="w-3 h-3" />
                        {formatFecha(evento.fecha)}
                      </div>
                      
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <HiClock className="w-3 h-3" />
                        {formatHora(evento.hora)}
                      </div>
                      
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        {evento.es_virtual ? (
                          <>
                            <HiGlobeAlt className="w-3 h-3" />
                            Virtual
                          </>
                        ) : (
                          <>
                            <HiMapPin className="w-3 h-3" />
                            {evento.lugar || 'Presencial'}
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
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
            );
          })}
        </div>
      )}
    </div>
  );
}