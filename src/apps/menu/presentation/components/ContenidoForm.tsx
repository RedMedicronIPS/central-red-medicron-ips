import React, { useState } from "react";
import type { CreateContenidoRequest } from "../../domain/types";

interface ContenidoFormProps {
  onSubmit: (data: CreateContenidoRequest) => void;
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

export default function ContenidoForm({ onSubmit, loading = false }: ContenidoFormProps) {
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
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg ${errors.titulo ? "border-red-500" : "border-gray-300"}`}
          disabled={loading}
        />
        {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Fecha</label>
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg ${errors.fecha ? "border-red-500" : "border-gray-300"}`}
          disabled={loading}
        />
        {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg border-gray-300"
          disabled={loading}
        >
          <option value="noticia">Noticia</option>
          <option value="comunicado">Comunicado</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contenido</label>
        <textarea
          name="contenido"
          value={form.contenido}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg ${errors.contenido ? "border-red-500" : "border-gray-300"}`}
          rows={4}
          disabled={loading}
        />
        {errors.contenido && <p className="text-red-500 text-xs mt-1">{errors.contenido}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Enlace externo (opcional)</label>
        <input
          name="enlace"
          value={form.enlace}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg border-gray-300"
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
        <label className="text-sm font-medium">Marcar como urgente</label>
      </div>
      <button
        type="submit"
        className="hidden"
        disabled={loading}
        aria-hidden="true"
        tabIndex={-1}
      />
    </form>
  );
}