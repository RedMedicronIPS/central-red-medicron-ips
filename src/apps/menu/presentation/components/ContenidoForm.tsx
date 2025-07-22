import React, { useState, useEffect } from "react";
import { HiNewspaper, HiCalendarDays, HiGlobeAlt } from "react-icons/hi2";
import type { ContenidoInformativo, CreateContenidoRequest, UpdateContenidoRequest } from "../../domain/types";

interface ContenidoFormProps {
  contenido?: ContenidoInformativo | null;
  onSubmit: (data: CreateContenidoRequest | UpdateContenidoRequest) => Promise<void>; // 👈 CAMBIAR: agregar Promise<void>
  loading?: boolean;
}

export default function ContenidoForm({ contenido, onSubmit, loading = false }: ContenidoFormProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    fecha: '',
    contenido: '',
    enlace: '',
    urgente: false,
    tipo: 'noticia' as 'noticia' | 'comunicado'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contenido) {
      setFormData({
        titulo: contenido.titulo,
        fecha: contenido.fecha,
        contenido: contenido.contenido,
        enlace: contenido.enlace || '',
        urgente: contenido.urgente,
        tipo: contenido.tipo
      });
    } else {
      setFormData({
        titulo: '',
        fecha: new Date().toISOString().split('T')[0], // Fecha actual por defecto
        contenido: '',
        enlace: '',
        urgente: false,
        tipo: 'noticia'
      });
    }
    setErrors({});
  }, [contenido]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) newErrors.titulo = 'Título es requerido';
    if (!formData.fecha) newErrors.fecha = 'Fecha es requerida';
    if (!formData.contenido.trim()) newErrors.contenido = 'Contenido es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => { // 👈 CAMBIAR: hacer async
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = contenido 
      ? { id: contenido.id, ...formData } as UpdateContenidoRequest
      : formData as CreateContenidoRequest;

    await onSubmit(submitData); // 👈 CAMBIAR: agregar await
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form 
      id="crud-form"
      onSubmit={handleSubmit} 
      className="space-y-6"
    >
      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <HiNewspaper className="w-4 h-4 inline mr-2" />
          Título
        </label>
        <input
          type="text"
          value={formData.titulo}
          onChange={(e) => handleInputChange('titulo', e.target.value)}
          className={`
            w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            ${errors.titulo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          `}
          disabled={loading}
        />
        {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <HiCalendarDays className="w-4 h-4 inline mr-2" />
            Fecha
          </label>
          <input
            type="date"
            value={formData.fecha}
            onChange={(e) => handleInputChange('fecha', e.target.value)}
            className={`
              w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              ${errors.fecha ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            `}
            disabled={loading}
          />
          {errors.fecha && <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>}
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de contenido
          </label>
          <select
            value={formData.tipo}
            onChange={(e) => handleInputChange('tipo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="noticia">Noticia</option>
            <option value="comunicado">Comunicado</option>
          </select>
        </div>
      </div>

      {/* Contenido */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Contenido
        </label>
        <textarea
          value={formData.contenido}
          onChange={(e) => handleInputChange('contenido', e.target.value)}
          rows={6}
          className={`
            w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            ${errors.contenido ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          `}
          disabled={loading}
        />
        {errors.contenido && <p className="text-red-500 text-sm mt-1">{errors.contenido}</p>}
      </div>

      {/* Enlace externo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <HiGlobeAlt className="w-4 h-4 inline mr-2" />
          Enlace externo (opcional)
        </label>
        <input
          type="url"
          value={formData.enlace}
          onChange={(e) => handleInputChange('enlace', e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
      </div>

      {/* Urgente */}
      <div className="flex items-center">
        <input
          id="urgente"
          type="checkbox"
          checked={formData.urgente}
          onChange={(e) => handleInputChange('urgente', e.target.checked)}
          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          disabled={loading}
        />
        <label htmlFor="urgente" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          Marcar como urgente
        </label>
      </div>
    </form>
  );
}