import React, { useState } from "react";
import type { CreateEventoRequest } from "../../domain/types";

interface EventoFormProps {
  onSubmit: (data: CreateEventoRequest) => void;
  loading?: boolean;
}

const initialState: CreateEventoRequest = {
  titulo: "",
  fecha: "",
  hora: "",
  detalles: "",
  es_virtual: false,
  enlace: "",
  lugar: "",
  importante: false,
};

export default function EventoForm({ onSubmit, loading = false }: EventoFormProps) {
  const [form, setForm] = useState<CreateEventoRequest>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.titulo.trim()) errs.titulo = "Título requerido";
    if (!form.fecha) errs.fecha = "Fecha requerida";
    if (!form.hora) errs.hora = "Hora requerida";
    if (!form.detalles.trim()) errs.detalles = "Detalles requeridos";
    if (!form.es_virtual && !form.lugar?.trim()) errs.lugar = "Lugar requerido para eventos presenciales";
    if (form.es_virtual && !form.enlace?.trim()) errs.enlace = "Enlace requerido para eventos virtuales";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      <div className="grid grid-cols-2 gap-4">
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
          <label className="block text-sm font-medium mb-1">Hora</label>
          <input
            type="time"
            name="hora"
            value={form.hora}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.hora ? "border-red-500" : "border-gray-300"}`}
            disabled={loading}
          />
          {errors.hora && <p className="text-red-500 text-xs mt-1">{errors.hora}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Detalles</label>
        <textarea
          name="detalles"
          value={form.detalles}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg ${errors.detalles ? "border-red-500" : "border-gray-300"}`}
          rows={3}
          disabled={loading}
        />
        {errors.detalles && <p className="text-red-500 text-xs mt-1">{errors.detalles}</p>}
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="es_virtual"
            checked={form.es_virtual}
            onChange={handleChange}
            disabled={loading}
          />
          Evento virtual
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="importante"
            checked={form.importante}
            onChange={handleChange}
            disabled={loading}
          />
          Importante
        </label>
      </div>
      {form.es_virtual ? (
        <div>
          <label className="block text-sm font-medium mb-1">Enlace virtual</label>
          <input
            name="enlace"
            value={form.enlace}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.enlace ? "border-red-500" : "border-gray-300"}`}
            disabled={loading}
          />
          {errors.enlace && <p className="text-red-500 text-xs mt-1">{errors.enlace}</p>}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">Lugar</label>
          <input
            name="lugar"
            value={form.lugar}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.lugar ? "border-red-500" : "border-gray-300"}`}
            disabled={loading}
          />
          {errors.lugar && <p className="text-red-500 text-xs mt-1">{errors.lugar}</p>}
        </div>
      )}
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