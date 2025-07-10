import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiExclamationTriangle, HiArrowRight, HiCalendar, HiEye } from "react-icons/hi2";
import { HiSpeakerphone } from "react-icons/hi";
import { ContenidoService } from "../../application/services/ContenidoService"; // 👈 USAR SERVICE
import type { ContenidoInformativo } from "../../domain/types";
import { formatDisplayDate } from "../../../../shared/utils/dateUtils";

export default function NoticiasComunicados() {
  const [contenidos, setContenidos] = useState<ContenidoInformativo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contenidoService = new ContenidoService(); // 👈 USAR SERVICE

  useEffect(() => {
    const fetchContenidos = async () => {
      try {
        setLoading(true);
        const data = await contenidoService.getAllContenidos(); // 👈 USAR SERVICE
        // Tomar los primeros 5
        const sortedData = data.slice(0, 5);
        setContenidos(sortedData);
      } catch (err: any) {
        setError(err.message); // 👈 USAR err.message para consistencia
        console.error('Error fetching contenidos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContenidos();
  }, []);

  const formatFecha = (fecha: string) => {
    return formatDisplayDate(fecha, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }); // 👈 USAR UTILIDAD
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === 'comunicado' ? HiSpeakerphone : HiSpeakerphone;
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

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 backdrop-blur-md">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          Noticias y Comunicados
        </h2>
        <Link
          to="/noticias"
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
        >
          Ver todas
          <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {contenidos.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <HiSpeakerphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No hay noticias o comunicados disponibles</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contenidos.map((contenido) => {
            const IconComponent = getTipoIcon(contenido.tipo);
            return (
              <div
                key={contenido.id}
                className={`
                  p-4 rounded-xl border transition-all duration-200 hover:shadow-md
                  ${getTipoBgColor(contenido.tipo, contenido.urgente)}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    p-2 rounded-lg flex-shrink-0
                    ${contenido.urgente 
                      ? 'bg-red-100 dark:bg-red-800' 
                      : contenido.tipo === 'comunicado' 
                        ? 'bg-blue-100 dark:bg-blue-800' 
                        : 'bg-green-100 dark:bg-green-800'
                    }
                  `}>
                    <IconComponent className={`w-5 h-5 ${getTipoColor(contenido.tipo, contenido.urgente)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
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
                    
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                      {contenido.titulo}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                      {contenido.contenido}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/noticias/${contenido.id}`}
                        className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        <HiEye className="w-4 h-4" />
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
            );
          })}
        </div>
      )}
    </div>
  );
}