import React, { useState, useEffect } from "react";
import { HiUsers, HiPhone, HiUserCircle, HiPlus, HiPencil, HiTrash, HiStar, HiGift, HiMagnifyingGlass, HiSparkles, HiAcademicCap } from "react-icons/hi2";
import { HiOfficeBuilding, HiMail } from "react-icons/hi";
import { FuncionarioService } from "../../application/services/FuncionarioService";
import { FuncionarioCrudService } from "../../application/services/FuncionarioCrudService";
import { ReconocimientoCrudService } from "../../application/services/ReconocimientoCrudService";
import { FelicitacionCrudService } from "../../application/services/FelicitacionCrudService";
import { useMenuPermissions } from "../hooks/useMenuPermissions";
import type { Funcionario, CreateFuncionarioRequest, UpdateFuncionarioRequest, Reconocimiento, FelicitacionCumpleanios, CreateReconocimientoRequest, UpdateReconocimientoRequest, CreateFelicitacionRequest, UpdateFelicitacionRequest } from "../../domain/types";
import CrudModal from "../components/CrudModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import FuncionarioForm from "../components/FuncionarioForm";
import ReconocimientoForm from "../components/ReconocimientoForm";
import FelicitacionForm from "../components/FelicitacionForm";
import { formatBirthdayDate } from "../../../../shared/utils/dateUtils";

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [filteredFuncionarios, setFilteredFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSede, setSelectedSede] = useState<number>(0);
  const [selectedCargo, setSelectedCargo] = useState('');

  // Estados CRUD Funcionarios
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [crudLoading, setCrudLoading] = useState(false);

  // Estados CRUD Reconocimientos
  const [showCreateReconocimientoModal, setShowCreateReconocimientoModal] = useState(false);
  const [showEditReconocimientoModal, setShowEditReconocimientoModal] = useState(false);
  const [showDeleteReconocimientoModal, setShowDeleteReconocimientoModal] = useState(false);
  const [selectedReconocimiento, setSelectedReconocimiento] = useState<Reconocimiento | null>(null);
  const [funcionarioParaReconocimiento, setFuncionarioParaReconocimiento] = useState<Funcionario | null>(null);

  // Estados CRUD Felicitaciones
  const [showCreateFelicitacionModal, setShowCreateFelicitacionModal] = useState(false);
  const [showEditFelicitacionModal, setShowEditFelicitacionModal] = useState(false);
  const [showDeleteFelicitacionModal, setShowDeleteFelicitacionModal] = useState(false);
  const [selectedFelicitacion, setSelectedFelicitacion] = useState<FelicitacionCumpleanios | null>(null);
  const [funcionarioParaFelicitacion, setFuncionarioParaFelicitacion] = useState<Funcionario | null>(null);

  const funcionarioService = new FuncionarioService();
  const funcionarioCrudService = new FuncionarioCrudService();
  const reconocimientoCrudService = new ReconocimientoCrudService();
  const felicitacionCrudService = new FelicitacionCrudService();
  const { canManageFuncionarios, canManageReconocimientos } = useMenuPermissions();

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  useEffect(() => {
    let filtered = funcionarios;

    if (searchTerm) {
      filtered = funcionarioService.searchFuncionarios(filtered, searchTerm);
    }

    if (selectedSede && selectedSede !== 0) {
      filtered = filtered.filter(funcionario => funcionario.sede.id === selectedSede);
    }

    if (selectedCargo) {
      filtered = filtered.filter(funcionario => funcionario.cargo === selectedCargo);
    }

    setFilteredFuncionarios(filtered);
  }, [funcionarios, searchTerm, selectedSede, selectedCargo, funcionarioService]);

  const fetchFuncionarios = async () => {
    try {
      setLoading(true);
      const data = await funcionarioService.getAllFuncionarios();
      setFuncionarios(data);
      setFilteredFuncionarios(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handlers para reconocimientos
  const handleSubmitReconocimiento = async (data: CreateReconocimientoRequest | UpdateReconocimientoRequest) => {
    setCrudLoading(true);
    
    let result;
    if ('id' in data) {
      result = await reconocimientoCrudService.updateReconocimiento(data as UpdateReconocimientoRequest);
      if (result.success) {
        setShowEditReconocimientoModal(false);
        setSelectedReconocimiento(null);
        setFuncionarioParaReconocimiento(null);
      }
    } else {
      result = await reconocimientoCrudService.createReconocimiento(data as CreateReconocimientoRequest);
      if (result.success) {
        setShowCreateReconocimientoModal(false);
        setFuncionarioParaReconocimiento(null);
      }
    }
    
    if (!result.success) {
      console.error('Error en reconocimiento:', result.message);
    }
    
    setCrudLoading(false);
  };

  const handleDeleteReconocimiento = async () => {
    if (!selectedReconocimiento) return;

    setCrudLoading(true);
    const result = await reconocimientoCrudService.deleteReconocimiento(selectedReconocimiento.id);

    if (result.success) {
      setShowDeleteReconocimientoModal(false);
      setSelectedReconocimiento(null);
    } else {
      console.error(result.message);
    }
    setCrudLoading(false);
  };

  // Handlers para felicitaciones
  const handleSubmitFelicitacion = async (data: CreateFelicitacionRequest | UpdateFelicitacionRequest) => {
    setCrudLoading(true);
    
    let result;
    if ('id' in data) {
      result = await felicitacionCrudService.updateFelicitacion(data as UpdateFelicitacionRequest);
      if (result.success) {
        setShowEditFelicitacionModal(false);
        setSelectedFelicitacion(null);
        setFuncionarioParaFelicitacion(null);
      }
    } else {
      result = await felicitacionCrudService.createFelicitacion(data as CreateFelicitacionRequest);
      if (result.success) {
        setShowCreateFelicitacionModal(false);
        setFuncionarioParaFelicitacion(null);
      }
    }
    
    if (!result.success) {
      console.error(result.message);
    }
    
    setCrudLoading(false);
  };

  const handleDeleteFelicitacion = async () => {
    if (!selectedFelicitacion) return;

    setCrudLoading(true);
    const result = await felicitacionCrudService.deleteFelicitacion(selectedFelicitacion.id);

    if (result.success) {
      setShowDeleteFelicitacionModal(false);
      setSelectedFelicitacion(null);
    } else {
      console.error(result.message);
    }
    setCrudLoading(false);
  };

  // Handlers para abrir modales
  const openCreateReconocimientoModal = (funcionario: Funcionario) => {
    setFuncionarioParaReconocimiento(funcionario);
    setShowCreateReconocimientoModal(true);
  };

  const openCreateFelicitacionModal = (funcionario: Funcionario) => {
    setFuncionarioParaFelicitacion(funcionario);
    setShowCreateFelicitacionModal(true);
  };

  // Handlers existentes de funcionarios
  const handleSubmit = async (data: CreateFuncionarioRequest | UpdateFuncionarioRequest) => {
    setCrudLoading(true);
    
    let result;
    if ('id' in data) {
      result = await funcionarioCrudService.updateFuncionario(data as UpdateFuncionarioRequest);
      if (result.success) {
        setShowEditModal(false);
        setSelectedFuncionario(null);
        fetchFuncionarios();
      }
    } else {
      result = await funcionarioCrudService.createFuncionario(data as CreateFuncionarioRequest);
      if (result.success) {
        setShowCreateModal(false);
        fetchFuncionarios();
      }
    }
    
    if (!result.success) {
      console.error(result.message);
    }
    
    setCrudLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedFuncionario) return;

    setCrudLoading(true);
    const result = await funcionarioCrudService.deleteFuncionario(selectedFuncionario.id);

    if (result.success) {
      setShowDeleteModal(false);
      setSelectedFuncionario(null);
      fetchFuncionarios();
    } else {
      console.error(result.message);
    }
    setCrudLoading(false);
  };

  const openEditModal = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setShowEditModal(true);
  };

  const openDeleteModal = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setShowDeleteModal(true);
  };

  const getProfilePicUrl = (foto: string) => {
    if (!foto) return null;
    if (foto.startsWith('http')) return foto;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    return `${baseUrl}${foto}`;
  };

  const formatFechaNacimiento = (fecha: string) => {
    return formatBirthdayDate(fecha);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSede(0);
    setSelectedCargo('');
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              {/* Header skeleton */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-80"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                </div>
                
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
              
              {/* Grid skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        
        <div className="relative p-6 flex items-center justify-center min-h-screen">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 p-12 text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/50 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <HiUsers className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Error al cargar funcionarios</h3>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const sedesUnicas = funcionarioService.getUniqueSedes(funcionarios);
  const cargos = funcionarioService.getUniqueValues(funcionarios, 'cargo');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo decorativo animado */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-1000"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-green-400/5 to-blue-400/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header moderno */}
          <div className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl transition-all duration-500 group-hover:from-blue-200/50 group-hover:to-indigo-200/50 dark:group-hover:from-blue-800/30 dark:group-hover:to-indigo-800/30"></div>
            
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-2xl">
              {/* Header principal */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl">
                      <HiUsers className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-bounce flex items-center justify-center">
                      <HiSparkles className="w-3 h-3 text-green-800" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-700 dark:from-blue-100 dark:via-indigo-200 dark:to-blue-300 bg-clip-text text-transparent mb-2">
                      Directorio de Funcionarios
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      Encuentra la información de contacto de todos los miembros del equipo
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {canManageReconocimientos && (
                    <button
                      onClick={() => setShowCreateReconocimientoModal(true)}
                      className="group/btn relative overflow-hidden flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <HiStar className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" />
                      <span className="relative z-10">Reconocimiento</span>
                    </button>
                  )}
                  {canManageFuncionarios && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="group/btn relative overflow-hidden flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <HiPlus className="w-5 h-5 relative z-10 group-hover/btn:rotate-90 transition-transform duration-300" />
                      <span className="relative z-10">Nuevo funcionario</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Estadísticas mejoradas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-2 border-blue-200/50 dark:border-blue-700/50 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg mr-4">
                      <HiUsers className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">Total Funcionarios</p>
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{funcionarios.length}</p>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 border-2 border-green-200/50 dark:border-green-700/50 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg mr-4">
                      <HiOfficeBuilding className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">Sedes Activas</p>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300">{sedesUnicas.length}</p>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 border-2 border-purple-200/50 dark:border-purple-700/50 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg mr-4">
                      <HiAcademicCap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-1">Cargos Diferentes</p>
                      <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{cargos.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtros mejorados */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-600/50 p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                      <HiMagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Buscar funcionarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-3 w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                      />
                    </div>

                    <select
                      value={selectedSede}
                      onChange={(e) => setSelectedSede(parseInt(e.target.value) || 0)}
                      className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                    >
                      <option value={0}>Todas las sedes</option>
                      {sedesUnicas.map(sede => (
                        <option key={sede.id} value={sede.id}>
                          {sede.name} - {sede.city}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedCargo}
                      onChange={(e) => setSelectedCargo(e.target.value)}
                      className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                    >
                      <option value="">Todos los cargos</option>
                      {cargos.map(cargo => (
                        <option key={cargo} value={cargo}>{cargo}</option>
                      ))}
                    </select>

                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de funcionarios mejorada */}
          {filteredFuncionarios.length === 0 ? (
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl"></div>
              
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 p-16 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/50 dark:to-indigo-800/50 rounded-3xl mx-auto mb-8 flex items-center justify-center">
                  <HiUsers className="w-16 h-16 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {funcionarios.length === 0 ? "No hay funcionarios registrados" : "No se encontraron funcionarios"}
                </h3>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {funcionarios.length === 0
                    ? "Aún no hay funcionarios registrados en el sistema. ¡Empieza agregando el primer funcionario!"
                    : "Intenta ajustar los filtros de búsqueda para encontrar los funcionarios que buscas."
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFuncionarios.map((funcionario) => {
                const photoUrl = getProfilePicUrl(funcionario.foto);
                
                return (
                  <div 
                    key={funcionario.id} 
                    className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-white/20 dark:border-gray-700/50 shadow-xl"
                  >
                    {/* Efecto de brillo en hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
                    
                    {/* Línea de acento lateral */}
                    <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600 transition-all duration-300 group-hover:w-4"></div>
                    
                    <div className="relative p-8">
                      <div className="flex flex-col items-center text-center">
                        {/* Foto mejorada */}
                        <div className="relative mb-6">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={`${funcionario.nombres} ${funcionario.apellidos}`}
                              className="w-24 h-24 rounded-2xl object-cover border-4 border-blue-200 dark:border-blue-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`w-24 h-24 rounded-2xl flex items-center justify-center border-4 border-blue-200 dark:border-blue-600 shadow-lg bg-blue-100 dark:bg-blue-900 transition-all duration-300 group-hover:scale-110 ${photoUrl ? 'hidden' : ''}`}>
                            <HiUserCircle className="w-16 h-16 text-blue-500 dark:text-blue-400" />
                          </div>
                          
                          {/* Indicador online */}
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-3 border-white dark:border-gray-900 rounded-full shadow-lg"></div>
                        </div>

                        {/* Información personal */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {funcionario.nombres} {funcionario.apellidos}
                        </h3>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-blue-700">
                            {funcionario.cargo}
                          </span>
                        </div>

                        {/* Información de contacto mejorada */}
                        <div className="w-full space-y-4 text-sm">
                          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                              <HiOfficeBuilding className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium">{funcionario.sede.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{funcionario.sede.city}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                              <HiPhone className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="flex-1 text-left font-medium">{funcionario.telefono}</span>
                          </div>

                          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                              <HiMail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="flex-1 text-left font-medium truncate">{funcionario.correo}</span>
                          </div>

                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 justify-center text-gray-500 dark:text-gray-400">
                              <HiGift className="w-4 h-4" />
                              <span className="text-xs font-medium">
                                Cumpleaños: {formatFechaNacimiento(funcionario.fecha_nacimiento)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Botones de acción mejorados */}
                        <div className="flex flex-col gap-3 mt-6 w-full">
                          {/* Botones CRUD Funcionarios */}
                          {canManageFuncionarios && (
                            <div className="flex gap-2 w-full">
                              <button
                                onClick={() => openEditModal(funcionario)}
                                className="group/edit flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                              >
                                <HiPencil className="w-4 h-4 group-hover/edit:rotate-12 transition-transform duration-300" />
                                Editar
                              </button>
                              
                              <button
                                onClick={() => openDeleteModal(funcionario)}
                                className="group/delete flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                              >
                                <HiTrash className="w-4 h-4 group-hover/delete:scale-110 transition-transform duration-300" />
                                Eliminar
                              </button>
                            </div>
                          )}

                          {/* Botones reconocimientos y felicitaciones 
                          {canManageReconocimientos && (
                            <div className="flex gap-2 w-full">
                              <button
                                onClick={() => openCreateReconocimientoModal(funcionario)}
                                className="group/star flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                              >
                                <HiStar className="w-4 h-4 group-hover/star:rotate-12 transition-transform duration-300" />
                                Reconocer
                              </button>
                              <button
                                onClick={() => openCreateFelicitacionModal(funcionario)}
                                className="group/gift flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                              >
                                <HiGift className="w-4 h-4 group-hover/gift:scale-110 transition-transform duration-300" />
                                Felicitar
                              </button>
                            </div>
                          )}*/}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modales CRUD Funcionarios */}
      <CrudModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Funcionario"
        loading={crudLoading}
        submitText="Crear"
      >
        <FuncionarioForm
          onSubmit={handleSubmit}
          loading={crudLoading}
        />
      </CrudModal>

      <CrudModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedFuncionario(null);
        }}
        title="Editar Funcionario"
        loading={crudLoading}
        submitText="Actualizar"
      >
        <FuncionarioForm
          funcionario={selectedFuncionario}
          onSubmit={handleSubmit}
          loading={crudLoading}
        />
      </CrudModal>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedFuncionario(null);
        }}
        onConfirm={handleDelete}
        loading={crudLoading}
        title="Eliminar Funcionario"
        message="¿Estás seguro de que deseas eliminar este funcionario? Esta acción no se puede deshacer."
        itemName={selectedFuncionario ? `${selectedFuncionario.nombres} ${selectedFuncionario.apellidos}` : ''}
      />

      {/* Modales CRUD Reconocimientos */}
      <CrudModal
        isOpen={showCreateReconocimientoModal}
        onClose={() => {
          setShowCreateReconocimientoModal(false);
          setFuncionarioParaReconocimiento(null);
        }}
        title={funcionarioParaReconocimiento ? `Crear Reconocimiento - ${funcionarioParaReconocimiento.nombres} ${funcionarioParaReconocimiento.apellidos}` : "Crear Reconocimiento"}
        loading={crudLoading}
        submitText="Crear Reconocimiento"
      >
        <ReconocimientoForm
          funcionarioPreseleccionado={funcionarioParaReconocimiento}
          funcionarios={funcionarios}
          onSubmit={handleSubmitReconocimiento}
          loading={crudLoading}
        />
      </CrudModal>

      <CrudModal
        isOpen={showEditReconocimientoModal}
        onClose={() => {
          setShowEditReconocimientoModal(false);
          setSelectedReconocimiento(null);
          setFuncionarioParaReconocimiento(null);
        }}
        title="Editar Reconocimiento"
        loading={crudLoading}
        submitText="Actualizar"
      >
        <ReconocimientoForm
          reconocimiento={selectedReconocimiento}
          funcionarios={funcionarios}
          onSubmit={handleSubmitReconocimiento}
          loading={crudLoading}
        />
      </CrudModal>

      <DeleteConfirmModal
        isOpen={showDeleteReconocimientoModal}
        onClose={() => {
          setShowDeleteReconocimientoModal(false);
          setSelectedReconocimiento(null);
        }}
        onConfirm={handleDeleteReconocimiento}
        loading={crudLoading}
        title="Eliminar Reconocimiento"
        message="¿Estás seguro de que deseas eliminar este reconocimiento? Esta acción no se puede deshacer."
        itemName={selectedReconocimiento ? selectedReconocimiento.titulo : ''}
      />

      {/* Modales CRUD Felicitaciones */}
      <CrudModal
        isOpen={showCreateFelicitacionModal}
        onClose={() => {
          setShowCreateFelicitacionModal(false);
          setFuncionarioParaFelicitacion(null);
        }}
        title={funcionarioParaFelicitacion ? `Crear Felicitación - ${funcionarioParaFelicitacion.nombres} ${funcionarioParaFelicitacion.apellidos}` : "Crear Felicitación"}
        loading={crudLoading}
        submitText="Crear Felicitación"
      >
        <FelicitacionForm
          funcionarioPreseleccionado={funcionarioParaFelicitacion}
          funcionarios={funcionarios}
          onSubmit={handleSubmitFelicitacion}
          loading={crudLoading}
        />
      </CrudModal>

      <CrudModal
        isOpen={showEditFelicitacionModal}
        onClose={() => {
          setShowEditFelicitacionModal(false);
          setSelectedFelicitacion(null);
          setFuncionarioParaFelicitacion(null);
        }}
        title="Editar Felicitación"
        loading={crudLoading}
        submitText="Actualizar"
      >
        <FelicitacionForm
          felicitacion={selectedFelicitacion}
          funcionarios={funcionarios}
          onSubmit={handleSubmitFelicitacion}
          loading={crudLoading}
        />
      </CrudModal>

      <DeleteConfirmModal
        isOpen={showDeleteFelicitacionModal}
        onClose={() => {
          setShowDeleteFelicitacionModal(false);
          setSelectedFelicitacion(null);
        }}
        onConfirm={handleDeleteFelicitacion}
        loading={crudLoading}
        title="Eliminar Felicitación"
        message="¿Estás seguro de que deseas eliminar esta felicitación? Esta acción no se puede deshacer."
        itemName={selectedFelicitacion ? "Felicitación de cumpleaños" : ''}
      />
    </div>
  );
}
