import React, { useState } from "react";
import type { CreateContenidoRequest } from "../../domain/types";

interface ContenidoFormProps {
  onSubmit: (data: CreateContenidoRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

const initialState: CreateContenidoRequest = {
  titulo: "",
  fecha: "",
  contenido: "",
  enlace: "",
  urgente: false,
  tipo: "noticia",
};

export default function ContenidoForm({ onSubmit, onCancel, loading = false }: ContenidoFormProps) {
  const [form, setForm] = useState<CreateContenidoRequest>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.titulo.trim()) errs.titulo = "Título requerido";
    if (!form.fecha) errs.fecha = "Fecha requerida";
    if (!form.contenido.trim()) errs.contenido = "Contenido requerido";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Título</label>
        <input
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.titulo ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
          disabled={loading}
        />
        {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Fecha</label>
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.fecha ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
          disabled={loading}
        />
        {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Tipo</label>
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          disabled={loading}
        >
          <option value="noticia">Noticia</option>
          <option value="comunicado">Comunicado</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Contenido</label>
        <textarea
          name="contenido"
          value={form.contenido}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.contenido ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
          rows={4}
          disabled={loading}
        />
        {errors.contenido && <p className="text-red-500 text-xs mt-1">{errors.contenido}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Enlace externo (opcional)</label>
        <input
          name="enlace"
          value={form.enlace}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          disabled={loading}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="urgente"
          checked={form.urgente}
          onChange={handleChange}
          disabled={loading}
        />
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Marcar como urgente</label>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear"}
        </button>
      </div>
    </form>
  );
}