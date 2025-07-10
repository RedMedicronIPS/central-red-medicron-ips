import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiGift, HiStar, HiUserCircle, HiArrowRight, HiExclamationTriangle } from "react-icons/hi2";
import { MenuApiService } from "../../infrastructure/services/MenuApiService";
import type { FelicitacionCumpleanios, Reconocimiento } from "../../domain/types";
import { formatBirthdayDate, formatDisplayDate } from "../../../../shared/utils/dateUtils";

export default function ReconocimientosCumpleanios() {
  const [felicitaciones, setFelicitaciones] = useState<FelicitacionCumpleanios[]>([]);
  const [reconocimientos, setReconocimientos] = useState<Reconocimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [felicitacionesData, reconocimientosData] = await Promise.all([
          MenuApiService.getFelicitacionesMes(),
          MenuApiService.getReconocimientosPublicados()
        ]);
        
        setFelicitaciones(felicitacionesData.slice(0, 5));
        setReconocimientos(reconocimientosData.slice(0, 5));
      } catch (err) {
        setError('Error al cargar reconocimientos y cumpleaños');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProfilePicUrl = (foto: string | undefined) => {
    if (!foto) return null;
    if (foto.startsWith('http')) return foto;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    return `${baseUrl}${foto}`;
  };

  const formatFecha = (fecha: string) => {
    return formatBirthdayDate(fecha);
  };

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 backdrop-blur-md">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
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
          Reconocimientos y Cumpleaños
        </h2>
        <Link
          to="/funcionarios"
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
        >
          Ver funcionarios
          <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cumpleaños del mes */}
        <div>
          <h3 className="text-xl font-semibold text-pink-600 dark:text-pink-300 mb-4 flex items-center gap-2">
            <HiGift className="w-5 h-5" />
            Cumpleaños del mes
          </h3>
          
          {felicitaciones.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <HiGift className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay cumpleaños este mes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {felicitaciones.map((felicitacion) => {
                const funcionario = felicitacion.funcionario; // 👈 CAMBIAR: usar directamente
                const photoUrl = getProfilePicUrl(funcionario?.foto);
                
                return (
                  <div
                    key={felicitacion.id}
                    className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/20 border border-pink-200 dark:border-pink-700 transition-transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={funcionario?.nombres}
                          className="w-12 h-12 rounded-full object-cover border-2 border-pink-300 dark:border-pink-600"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <HiUserCircle 
                        className={`w-12 h-12 text-pink-400 ${photoUrl ? 'hidden' : ''}`} 
                      />
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-pink-900 dark:text-pink-100">
                          {funcionario ? `${funcionario.nombres} ${funcionario.apellidos}` : 'Funcionario'}
                        </h4>
                        <p className="text-sm text-pink-700 dark:text-pink-300">
                          {funcionario?.cargo || 'Cargo no disponible'} - {funcionario?.sede.name || 'Sede no disponible'}
                        </p>
                        <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">
                          {felicitacion.mensaje}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs text-pink-600 dark:text-pink-400 font-medium">
                          {funcionario?.fecha_nacimiento && formatFecha(funcionario.fecha_nacimiento)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reconocimientos recientes */}
        <div>
          <h3 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 mb-4 flex items-center gap-2">
            <HiStar className="w-5 h-5" />
            Reconocimientos recientes
          </h3>
          
          {reconocimientos.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <HiStar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay reconocimientos recientes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reconocimientos.map((reconocimiento) => {
                const funcionario = reconocimiento.funcionario; // 👈 CAMBIAR: usar directamente
                const photoUrl = getProfilePicUrl(funcionario?.foto);
                
                return (
                  <div
                    key={reconocimiento.id}
                    className="p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700 transition-transform hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-3">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={funcionario?.nombres}
                          className="w-12 h-12 rounded-full object-cover border-2 border-yellow-300 dark:border-yellow-600"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <HiUserCircle 
                        className={`w-12 h-12 text-yellow-400 ${photoUrl ? 'hidden' : ''}`} 
                      />
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                          {reconocimiento.titulo}
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                          {funcionario ? `${funcionario.nombres} ${funcionario.apellidos}` : 'Funcionario'}
                        </p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 line-clamp-2">
                          {reconocimiento.descripcion}
                        </p>
                        {reconocimiento.tipo && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full">
                            {reconocimiento.tipo}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                          {formatFecha(reconocimiento.fecha)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}