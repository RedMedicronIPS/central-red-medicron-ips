import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../core/infrastructure/http/axiosInstance";
import type { RegistroFactura } from "./VerRegistroFacturaModal";
import type { EstadoFactura } from "../../domain/entities/EstadoFactura";
import { FacturaDetalleRepository } from "../../infrastructure/repositories/FacturaDetalleRepository";

type DetalleFactura = {
  descripcionFactura: string;
  observacionesGestion: string;
  observacionesInconsistencias: string;
  observacionesConformidad: string;
  observacionesPago: string;
  observacionesContabilidad: string;
  observacionesRevision: string;
  observacionesImpuestos: string;
  observacionesContraloria: string;
  estado: string;
};

type Props = {
  open: boolean;
  factura: RegistroFactura;
  onClose: () => void;
  onUpdated: () => void;
};

const EditarFacturaModal: React.FC<Props> = ({
  open,
  factura,
  onClose,
  onUpdated,
}) => {
  const [form, setForm] = useState<Partial<RegistroFactura>>({});
  const [detalle, setDetalle] = useState<DetalleFactura>({
    descripcionFactura: "",
    observacionesGestion: "",
    observacionesInconsistencias: "",
    observacionesConformidad: "",
    observacionesPago: "",
    observacionesContabilidad: "",
    observacionesRevision: "",
    observacionesImpuestos: "",
    observacionesContraloria: "",
    estado: "Pendiente",
  });
  const [centrosOperaciones, setCentrosOperaciones] = useState([]);
  const [estadosFactura, setEstadosFactura] = useState<EstadoFactura[]>([]);
  const [causales, setCausales] = useState([]);

  useEffect(() => {
    if (open && factura?.factura_id) {
      setForm(factura); // ← carga inicial del formulario

      axiosInstance
        .get("/gestionProveedores/centro_operaciones/")
        .then((res) => setCentrosOperaciones(res.data));

      axiosInstance
        .get("/gestionProveedores/estado_facturas/")
        .then((res) => setEstadosFactura(res.data));

      axiosInstance
        .get("/gestionProveedores/causales_devolucion/")
        .then((res) => setCausales(res.data));

      axiosInstance
        .get(`/gestionProveedores/factura_detalle/${factura.factura_id}/`)
        .then((res) =>
          setDetalle((prev) => ({
            ...prev,
            ...res.data,
          }))
        )
        .catch((err) => console.error("Error cargando detalle:", err));
    }
  }, [open, factura?.factura_id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetalleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDetalle((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        factura_estado_factura_id: (
          form.factura_estado_factura as EstadoFactura
        )?.estado_id,
      };
      delete payload.factura_estado_factura;

      await axiosInstance.put(
        `/gestionProveedores/factura/${factura.factura_id}/`,
        payload
      );

      const detalleData = new FormData();
      Object.entries(detalle).forEach(([key, val]) =>
        detalleData.append(key, val)
      );
      detalleData.append("factura", String(factura.factura_id));

      const detalleRepo = new FacturaDetalleRepository();
      await detalleRepo.update(factura.factura_id, detalleData);

      onUpdated();
      onClose();
    } catch (error) {
      console.error("Error actualizando factura o detalle", error);
      alert("Error actualizando factura o detalle");
    }
  };

  if (!open) return null;

  return (
    <div className="w-full h-full px-6 py-4 bg-white dark:bg-[#1e293b] border border-blue-200 dark:border-blue-800 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-300">
        Factura Electrónica, Editar registro [ID: {factura.factura_id}]
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          name="factura_id_factura_electronica"
          value={form.factura_id_factura_electronica || ""}
          onChange={handleChange}
          placeholder="ID factura electrónica"
          className="p-2 border rounded bg-white dark:bg-gray-700"
        />
        <input
          name="factura_etapa"
          value={form.factura_etapa || ""}
          onChange={handleChange}
          placeholder="Etapa"
          className="p-2 border rounded bg-white dark:bg-gray-700"
        />
        <input
          name="factura_fecha"
          type="date"
          value={form.factura_fecha || ""}
          onChange={handleChange}
          className="p-2 border rounded bg-white dark:bg-gray-700"
        />
        <input
          name="factura_numero_autorizacion"
          value={form.factura_numero_autorizacion || ""}
          onChange={handleChange}
          placeholder="Nro Autorización"
          className="p-2 border rounded bg-white dark:bg-gray-700"
        />
        <input
          name="factura_concepto"
          value={form.factura_concepto || ""}
          onChange={handleChange}
          placeholder="Concepto"
          className="p-2 border rounded bg-white dark:bg-gray-700"
        />
        <input
          name="factura_razon_social_proveedor"
          value={form.factura_razon_social_proveedor || ""}
          onChange={handleChange}
          placeholder="Razón Social Proveedor"
          className="p-2 border rounded bg-white dark:bg-gray-700"
        />
        <input
          name="factura_razon_social_adquiriente"
          value={form.factura_razon_social_adquiriente || ""}
          onChange={handleChange}
          placeholder="Razón Social Adquiriente"
          className="p-2 border rounded bg-white dark:bg-gray-700"
        />
        <input
          name="factura_valor"
          value={form.factura_valor || ""}
          onChange={handleChange}
          placeholder="Valor"
          className="p-2 border rounded bg-white dark:bg-gray-700"
        />

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estado de la Factura
          </label>
          <div className="flex flex-wrap gap-4">
            {estadosFactura.map((estado) => (
              <label
                key={estado.estado_id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="factura_estado_factura"
                  value={estado.estado_id}
                  checked={
                    (form.factura_estado_factura as EstadoFactura)
                      ?.estado_id === estado.estado_id
                  }
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      factura_estado_factura: estado,
                    }))
                  }
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span>{estado.nombre}</span>
              </label>
            ))}
          </div>
        </div>

        <select
          name="factura_centro_operaciones"
          value={form.factura_centro_operaciones || ""}
          onChange={handleChange}
          className="p-2 border rounded bg-white dark:bg-gray-700"
        >
          <option value="">Seleccione centro operaciones</option>
          {centrosOperaciones.map((c: any) => (
            <option key={c.operaciones_id} value={c.operaciones_id}>
              {c.operaciones_nombre}
            </option>
          ))}
        </select>

        <select
          name="causal_anulacion"
          value={form.causal_anulacion || ""}
          onChange={handleChange}
          className="p-2 border rounded bg-white dark:bg-gray-700"
        >
          <option value="">Causal Anulación</option>
          {causales.map((c: any) => (
            <option key={c.causalid} value={c.causalid}>
              {c.causal_nombre}
            </option>
          ))}
        </select>

        <div className="col-span-2 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-300">
            Detalle de la Factura
          </h3>
          {Object.entries(detalle).map(([key, val]) =>
            key !== "estado" ? (
              <textarea
                key={key}
                name={key}
                value={val}
                placeholder={key}
                onChange={handleDetalleChange}
                className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-700"
              />
            ) : null
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default EditarFacturaModal;
