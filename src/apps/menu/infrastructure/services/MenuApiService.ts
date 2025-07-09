import axiosInstance from "../../../../core/infrastructure/http/axiosInstance";
import type { 
  Funcionario, 
  Headquarters,
  ContenidoInformativo, 
  Evento, 
  FelicitacionCumpleanios, 
  Reconocimiento,
  CreateFuncionarioRequest,
  UpdateFuncionarioRequest,
  CreateContenidoRequest,
  UpdateContenidoRequest,
  CreateEventoRequest,
  UpdateEventoRequest,
  CreateReconocimientoRequest,
  UpdateReconocimientoRequest,
  CreateFelicitacionRequest,
  UpdateFelicitacionRequest
} from "../../domain/types";

export class MenuApiService {
  // ================ SEDES (HEADQUARTERS) ================
  static async getHeadquarters(): Promise<Headquarters[]> {
    const response = await axiosInstance.get("/main/headquarters/");
    return response.data;
  }

  static async getHeadquarter(id: number): Promise<Headquarters> {
    const response = await axiosInstance.get(`/main/headquarters/${id}/`);
    return response.data;
  }

  // ================ FUNCIONARIOS (ACTUALIZADOS) ================
  static async getFuncionarios(): Promise<Funcionario[]> {
    const response = await axiosInstance.get("/main/funcionarios/");
    return response.data;
  }

  static async getFuncionario(id: number): Promise<Funcionario> {
    const response = await axiosInstance.get(`/main/funcionarios/${id}/`);
    return response.data;
  }

  static async getFuncionariosBySede(sedeId: number): Promise<Funcionario[]> {
    const response = await axiosInstance.get(`/main/funcionarios/?sede=${sedeId}`);
    return response.data;
  }

  static async getFuncionariosByCargo(cargo: string): Promise<Funcionario[]> {
    const response = await axiosInstance.get(`/main/funcionarios/?cargo=${cargo}`);
    return response.data;
  }

  // ================ CRUD FUNCIONARIOS (ACTUALIZADOS) ================
  static async createFuncionario(data: CreateFuncionarioRequest): Promise<Funcionario> {
    const formData = new FormData();
    
    // Convertir sede a string para FormData
    formData.append('documento', data.documento);
    formData.append('nombres', data.nombres);
    formData.append('apellidos', data.apellidos);
    formData.append('fecha_nacimiento', data.fecha_nacimiento);
    formData.append('cargo', data.cargo);
    formData.append('sede', data.sede.toString()); // 👈 Convertir a string
    formData.append('telefono', data.telefono);
    formData.append('correo', data.correo);
    
    if (data.foto) {
      formData.append('foto', data.foto);
    }
    
    const response = await axiosInstance.post("/main/funcionarios/", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  static async updateFuncionario(data: UpdateFuncionarioRequest): Promise<Funcionario> {
    const { id, ...updateData } = data;
    const formData = new FormData();
    
    // Solo agregar campos que están definidos
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'sede') {
          formData.append(key, value.toString()); // 👈 Convertir sede a string
        } else {
          formData.append(key, value instanceof File ? value : value.toString());
        }
      }
    });

    const response = await axiosInstance.patch(`/main/funcionarios/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  static async deleteFuncionario(id: number): Promise<void> {
    await axiosInstance.delete(`/main/funcionarios/${id}/`);
  }

  // ================ CRUD CONTENIDOS ================
  static async createContenido(data: CreateContenidoRequest): Promise<ContenidoInformativo> {
    const response = await axiosInstance.post("/main/contenidos/", data);
    return response.data;
  }

  static async updateContenido(data: UpdateContenidoRequest): Promise<ContenidoInformativo> {
    const { id, ...updateData } = data;
    const response = await axiosInstance.patch(`/main/contenidos/${id}/`, updateData);
    return response.data;
  }

  static async deleteContenido(id: number): Promise<void> {
    await axiosInstance.delete(`/main/contenidos/${id}/`);
  }

  // ================ CRUD EVENTOS ================
  static async createEvento(data: CreateEventoRequest): Promise<Evento> {
    const response = await axiosInstance.post("/main/eventos/", data);
    return response.data;
  }

  static async updateEvento(data: UpdateEventoRequest): Promise<Evento> {
    const { id, ...updateData } = data;
    const response = await axiosInstance.patch(`/main/eventos/${id}/`, updateData);
    return response.data;
  }

  static async deleteEvento(id: number): Promise<void> {
    await axiosInstance.delete(`/main/eventos/${id}/`);
  }

  // ================ CRUD RECONOCIMIENTOS ================
  static async createReconocimiento(data: CreateReconocimientoRequest): Promise<Reconocimiento> {
    const response = await axiosInstance.post("/main/reconocimientos/", data);
    return response.data;
  }

  static async updateReconocimiento(data: UpdateReconocimientoRequest): Promise<Reconocimiento> {
    const { id, ...updateData } = data;
    const response = await axiosInstance.patch(`/main/reconocimientos/${id}/`, updateData);
    return response.data;
  }

  static async deleteReconocimiento(id: number): Promise<void> {
    await axiosInstance.delete(`/main/reconocimientos/${id}/`);
  }

  // ================ CRUD FELICITACIONES ================
  static async createFelicitacion(data: CreateFelicitacionRequest): Promise<FelicitacionCumpleanios> {
    const response = await axiosInstance.post("/main/felicitaciones/", data);
    return response.data;
  }

  static async updateFelicitacion(data: UpdateFelicitacionRequest): Promise<FelicitacionCumpleanios> {
    const { id, ...updateData } = data;
    const response = await axiosInstance.patch(`/main/felicitaciones/${id}/`, updateData);
    return response.data;
  }

  static async deleteFelicitacion(id: number): Promise<void> {
    await axiosInstance.delete(`/main/felicitaciones/${id}/`);
  }

  // ================ CONSULTA CONTENIDOS INFORMATIVOS ================
  static async getContenidos(): Promise<ContenidoInformativo[]> {
    const response = await axiosInstance.get("/main/contenidos/");
    return response.data;
  }

  static async getContenidosByTipo(tipo: 'noticia' | 'comunicado'): Promise<ContenidoInformativo[]> {
    const response = await axiosInstance.get(`/main/contenidos/?tipo=${tipo}`);
    return response.data;
  }

  static async getContenidosUrgentes(): Promise<ContenidoInformativo[]> {
    const response = await axiosInstance.get(`/main/contenidos/?urgente=true`);
    return response.data;
  }

  static async getContenido(id: number): Promise<ContenidoInformativo> {
    const response = await axiosInstance.get(`/main/contenidos/${id}/`);
    return response.data;
  }

  //================ CONSULTA EVENTOS ================ 
  static async getEventos(): Promise<Evento[]> { 
    const response = await axiosInstance.get("/main/eventos/"); 
    return response.data; }

  static async getEventosProximos(): Promise<Evento[]> { 
    const response = await axiosInstance.get("/main/eventos/?proximos=true"); 
    return response.data; }

  static async getEventosImportantes(): Promise<Evento[]> { 
    const response = await axiosInstance.get("/main/eventos/?importante=true"); 
    return response.data; }

  static async getEventosVirtuales(): Promise<Evento[]> { 
    const response = await axiosInstance.get("/main/eventos/?es_virtual=true"); 
    return response.data; }

  static async getEvento(id: number): Promise<Evento> { 
    const response = await axiosInstance.get("/main/eventos/${id}/"); 
    return response.data; }

  // ================ CONSULTA FELICITACIONES Y RECONOCIMIENTOS ================ 
  static async getFelicitacionesMes(): Promise<FelicitacionCumpleanios[]> { 
    const response = await axiosInstance.get("/main/felicitaciones/?mes=actual"); 
    return response.data; }

  static async getReconocimientosPublicados(): Promise<Reconocimiento[]> { 
    const response = await axiosInstance.get("/main/reconocimientos/?publicar=true"); 
    return response.data; }


}