import axiosInstance from '../../../../core/infrastructure/http/axiosInstance';
import type { Result, DetailedResult, CreateResultRequest, UpdateResultRequest } from '../../domain/entities/Result';

export class ResultsApiService {
  private baseUrl = '/indicators';

  // Resultados
  async getResults(): Promise<Result[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/results/`);
    return response.data;
  }

  async getResultsWithDetails(): Promise<DetailedResult[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/results/detailed/`);
    return response.data;
  }

  async getResultById(id: number): Promise<Result> {
    const response = await axiosInstance.get(`${this.baseUrl}/results/${id}/`);
    return response.data;
  }

  async createResult(result: CreateResultRequest): Promise<Result> {
    console.log('📤 Enviando resultado al backend:', result);
    const response = await axiosInstance.post(`${this.baseUrl}/results/`, result);
    console.log('📥 Respuesta del backend:', response.data);
    return response.data;
  }

  async updateResult(result: UpdateResultRequest): Promise<Result> {
    const response = await axiosInstance.put(`${this.baseUrl}/results/${result.id}/`, result);
    return response.data;
  }

  async deleteResult(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/results/${id}/`);
  }

  async getResultsByIndicator(indicatorId: number): Promise<Result[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/results/?indicator=${indicatorId}`);
    return response.data;
  }

  async getResultsByHeadquarters(headquartersId: number): Promise<Result[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/results/?headquarters=${headquartersId}`);
    return response.data;
  }

  // Obtener datos necesarios para los dropdowns
  async getIndicators(): Promise<Array<{id: number, name: string, code: string, measurementFrequency: string}>> {
    const response = await axiosInstance.get('/indicators/indicators/');
    return response.data.map((indicator: any) => ({
      id: indicator.id,
      name: indicator.name,
      code: indicator.code,
      measurementFrequency: indicator.measurementFrequency
    }));
  }

  async getHeadquarters(): Promise<Array<{id: number, name: string}>> {
    const response = await axiosInstance.get('/companies/headquarters/');
    return response.data;
  }
}