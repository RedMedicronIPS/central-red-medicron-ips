import React, { useState, useEffect } from "react";
import { HiUsers, HiPhone, HiUserCircle, HiPlus, HiPencil, HiTrash } from "react-icons/hi2";
import { HiSearch } from "react-icons/hi";
import { HiOfficeBuilding, HiMail } from "react-icons/hi";
import { FuncionarioService } from "../../application/services/FuncionarioService";
import { FuncionarioCrudService } from "../../application/services/FuncionarioCrudService";
import { useMenuPermissions } from "../hooks/useMenuPermissions";
import type { Funcionario, CreateFuncionarioRequest, UpdateFuncionarioRequest } from "../../domain/types";
import CrudModal from "../components/CrudModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import FuncionarioForm from "../components/FuncionarioForm";

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [filteredFuncionarios, setFilteredFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSede, setSelectedSede] = useState<number>(0); // 👈 Ahora es number
  const [selectedCargo, setSelectedCargo] = useState('');

  // CRUD states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [crudLoading, setCrudLoading] = useState(false);

  const funcionarioService = new FuncionarioService();
  const funcionarioCrudService = new FuncionarioCrudService();
  const { canManageFuncionarios } = useMenuPermissions();

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  useEffect(() => {
    let filtered = funcionarios;

    if (searchTerm) {
      filtered = funcionarioService.searchFuncionarios(filtered, searchTerm);
    }

    if (selectedSede && selectedSede !== 0) {
      filtered = filtered.filter(funcionario => funcionario.sede.id === selectedSede); // 👈 CAMBIAR: usar sede.id
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

  // 👈 CAMBIAR: Handler genérico que maneja ambos casos
  const handleSubmit = async (data: CreateFuncionarioRequest | UpdateFuncionarioRequest) => {
    setCrudLoading(true);
    
    let result;
    if ('id' in data) {
      // Es una actualización
      result = await funcionarioCrudService.updateFuncionario(data as UpdateFuncionarioRequest);
      if (result.success) {
        setShowEditModal(false);
        setSelectedFuncionario(null);
        fetchFuncionarios();
      }
    } else {
      // Es una creación
      result = await funcionarioCrudService.createFuncionario(data as CreateFuncionarioRequest);
      if (result.success) {
        setShowCreateModal(false);
        fetchFuncionarios();
      }
    }
    
    if (!result.success) {
      console.error(result.message);
      // TODO: Mostrar toast de error
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
      // TODO: Mostrar toast de éxito
    } else {
      // TODO: Mostrar toast de error
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
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long'
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSede(0); // 👈 Reset a 0
    setSelectedCargo('');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const sedesUnicas = funcionarioService.getUniqueSedes(funcionarios); // 👈 Usar nuevo método
  const cargos = funcionarioService.getUniqueValues(funcionarios, 'cargo');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <HiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Directorio de Funcionarios
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Encuentra la información de contacto de todos los miembros del equipo
              </p>
            </div>
          </div>

          {canManageFuncionarios && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <HiPlus className="w-5 h-5" />
              Agregar funcionario
            </button>
          )}
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center">
              <HiUsers className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Funcionarios</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{funcionarios.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <HiOfficeBuilding className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Sedes Activas</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {sedesUnicas.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-center">
              <HiUserCircle className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Cargos Diferentes</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {cargos.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros actualizados */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Buscar funcionarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
            </div>

            <select
              value={selectedSede}
              onChange={(e) => setSelectedSede(parseInt(e.target.value) || 0)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            >
              <option value={0}>Todas las sedes</option>
              {sedesUnicas.map(sede => (
                <option key={sede.id} value={sede.id}>
                  {sede.name} - {sede.city} {/* 👈 CAMBIAR: usar name y city */}
                </option>
              ))}
            </select>

            <select
              value={selectedCargo}
              onChange={(e) => setSelectedCargo(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            >
              <option value="">Todos los cargos</option>
              {cargos.map(cargo => (
                <option key={cargo} value={cargo}>{cargo}</option>
              ))}
            </select>

            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de funcionarios actualizada */}
      {filteredFuncionarios.length === 0 ? (
        <div className="text-center py-12">
          <HiUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No se encontraron funcionarios
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Intenta ajustar los filtros de búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFuncionarios.map((funcionario) => {
            const photoUrl = getProfilePicUrl(funcionario.foto);
            
            return (
              <div key={funcionario.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col items-center text-center">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={`${funcionario.nombres} ${funcionario.apellidos}`}
                        className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 mb-4"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <HiUserCircle
                      className={`w-20 h-20 text-gray-400 mb-4 ${photoUrl ? 'hidden' : ''}`}
                    />

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {funcionario.nombres} {funcionario.apellidos}
                    </h3>

                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                      {funcionario.cargo}
                    </p>

                    <div className="w-full space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                        <HiOfficeBuilding className="w-4 h-4" />
                        <span>{funcionario.sede.name} - {funcionario.sede.city}</span> {/* 👈 CAMBIAR: mostrar name y city */}
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                        <HiPhone className="w-4 h-4" />
                        <a
                          href={`tel:${funcionario.telefono}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {funcionario.telefono}
                        </a>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                        <HiMail className="w-4 h-4" />
                        <a
                          href={`mailto:${funcionario.correo}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs truncate"
                          title={funcionario.correo}
                        >
                          {funcionario.correo}
                        </a>
                      </div>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Cumpleaños: {formatFechaNacimiento(funcionario.fecha_nacimiento)}
                        </p>
                      </div>
                    </div>

                    {/* Botones CRUD */}
                    {canManageFuncionarios && (
                      <div className="flex gap-2 mt-4 w-full">
                        <button
                          onClick={() => openEditModal(funcionario)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          <HiPencil className="w-3 h-3" />
                          Editar
                        </button>
                        <button
                          onClick={() => openDeleteModal(funcionario)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        >
                          <HiTrash className="w-3 h-3" />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modales CRUD */}
      <CrudModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Funcionario"
        loading={crudLoading}
        submitText="Crear"
      >
        <FuncionarioForm
          onSubmit={handleSubmit} // 👈 CAMBIAR: usar handler genérico
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
          onSubmit={handleSubmit} // 👈 CAMBIAR: usar el mismo handler genérico
          loading={crudLoading}
        />
      </CrudModal>

      {/* DeleteConfirmModal se mantiene igual */}
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
    </div>
  );
}
