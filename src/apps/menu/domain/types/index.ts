export interface TimeStampedModel {
  created_at: string;
  updated_at: string;
}

export interface Funcionario extends TimeStampedModel {
  id: number;
  documento: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  cargo: string;
  sede: number; // 👈 Ahora es el ID de la sede
  sede_info?: Headquarters; // 👈 Información completa de la sede (opcional)
  telefono: string;
  correo: string;
  foto: string;
}

export interface ContenidoInformativo extends TimeStampedModel {
  id: number;
  titulo: string;
  fecha: string;
  contenido: string;
  enlace?: string;
  urgente: boolean;
  tipo: 'noticia' | 'comunicado';
}

export interface Evento extends TimeStampedModel {
  id: number;
  titulo: string;
  fecha: string;
  hora: string;
  detalles: string;
  es_virtual: boolean;
  enlace?: string;
  lugar?: string;
  importante: boolean;
}

export interface FelicitacionCumpleanios extends TimeStampedModel {
  id: number;
  funcionario: number;
  funcionario_info?: Funcionario;
  mensaje: string;
}

export interface Reconocimiento extends TimeStampedModel {
  id: number;
  funcionario: number;
  funcionario_info?: Funcionario;
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo?: string;
  publicar: boolean;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Tipos para filtros
export type TipoContenido = 'noticia' | 'comunicado' | 'todos';
export type TipoReconocimiento = string;

// Tipos para formularios CRUD
export interface CreateFuncionarioRequest {
  documento: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  cargo: string;
  sede: number; // 👈 Ahora recibe el ID de la sede
  telefono: string;
  correo: string;
  foto?: File;
}

export interface UpdateFuncionarioRequest extends Partial<CreateFuncionarioRequest> {
  id: number;
}

export interface CreateContenidoRequest {
  titulo: string;
  fecha: string;
  contenido: string;
  enlace?: string;
  urgente: boolean;
  tipo: 'noticia' | 'comunicado';
}

export interface UpdateContenidoRequest extends Partial<CreateContenidoRequest> {
  id: number;
}

export interface CreateEventoRequest {
  titulo: string;
  fecha: string;
  hora: string;
  detalles: string;
  es_virtual: boolean;
  enlace?: string;
  lugar?: string;
  importante: boolean;
}

export interface UpdateEventoRequest extends Partial<CreateEventoRequest> {
  id: number;
}

export interface CreateReconocimientoRequest {
  funcionario: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo?: string;
  publicar: boolean;
}

export interface UpdateReconocimientoRequest extends Partial<CreateReconocimientoRequest> {
  id: number;
}

export interface CreateFelicitacionRequest {
  funcionario: number;
  mensaje: string;
}

export interface UpdateFelicitacionRequest extends Partial<CreateFelicitacionRequest> {
  id: number;
}

// Tipos para respuestas
export interface CrudResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

// Nuevo tipo para Headquarters
export interface Headquarters extends TimeStampedModel {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  ciudad?: string;
}