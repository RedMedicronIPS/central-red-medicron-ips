import axiosInstance from '../../../../core/infrastructure/http/axiosInstance';
import type { Indicator, CreateIndicatorRequest, UpdateIndicatorRequest } from '../../domain/entities/Indicator';

export class IndicadoresApiService {
  private baseUrl = '/indicators';

  // Indicadores
  async getIndicators(): Promise<Indicator[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/indicators/`);
    return response.data;
  }

  async getIndicatorById(id: number): Promise<Indicator> {
    const response = await axiosInstance.get(`${this.baseUrl}/indicators/${id}/`);
    return response.data;
  }

  async createIndicator(indicator: CreateIndicatorRequest): Promise<Indicator> {
    console.log('📤 Enviando indicador al backend:', indicator);
    const response = await axiosInstance.post(`${this.baseUrl}/indicators/`, indicator);
    console.log('📥 Respuesta del backend:', response.data);
    return response.data;
  }

  async updateIndicator(indicator: UpdateIndicatorRequest): Promise<Indicator> {
    const response = await axiosInstance.put(`${this.baseUrl}/indicators/${indicator.id}/`, indicator);
    return response.data;
  }

  async deleteIndicator(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/indicators/${id}/`);
  }

  async toggleIndicatorStatus(id: number, status: boolean): Promise<Indicator> {
    const response = await axiosInstance.patch(`${this.baseUrl}/indicators/${id}/`, { status });
    return response.data;
  }

  // Obtener procesos disponibles para el dropdown
  async getProcesses(): Promise<Array<{id: number, name: string}>> {
    const response = await axiosInstance.get('/companies/processes/');
    return response.data;
  }
}