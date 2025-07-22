import axiosInstance from "../../../../core/infrastructure/http/axiosInstance";
import type { FacturaElectronicaDetalle } from "../../domain/entities/FacturaDetalle";

export class FacturaDetalleRepository {
  async getAll(): Promise<FacturaElectronicaDetalle[]> {
    const response = await axiosInstance.get(
      "/gestionProveedores/facturas_detalles/"
    );
    return response.data;
  }

  async getByFacturaId(
    facturaId: number
  ): Promise<FacturaElectronicaDetalle[]> {
    const response = await axiosInstance.get(
      `/gestionProveedores/facturas_detalles/?factura=${facturaId}`
    );
    return response.data;
  }

  async create(data: FormData): Promise<FacturaElectronicaDetalle> {
    const response = await axiosInstance.post(
      "/gestionProveedores/facturas_detalles/",
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  }

  async update(id: number, data: any): Promise<FacturaElectronicaDetalle> {
    const formData = new FormData();
    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    }
    const response = await axiosInstance.patch(
      `/gestionProveedores/facturas_detalles/${id}/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/gestionProveedores/facturas_detalles/${id}/`);
  }
}
