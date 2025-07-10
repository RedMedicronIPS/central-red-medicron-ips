import React, { useState, useEffect } from "react";
import { HiGift, HiMagnifyingGlass, HiPlus, HiPencil, HiTrash, HiUser, HiCalendarDays } from "react-icons/hi2";
import { MenuRepository } from "../../infrastructure/repositories/MenuRepository";
import { FelicitacionCrudService } from "../../application/services/FelicitacionCrudService";
import { FuncionarioService } from "../../application/services/FuncionarioService";
import { useMenuPermissions } from "../hooks/useMenuPermissions";
import type { FelicitacionCumpleanios, Funcionario, CreateFelicitacionRequest, UpdateFelicitacionRequest } from "../../domain/types";
import CrudModal from "../components/CrudModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import FelicitacionForm from "../components/FelicitacionForm";
import { formatBirthdayDate } from "../../../../shared/utils/dateUtils";

export default function FelicitacionesPage() {
    const [felicitaciones, setFelicitaciones] = useState<FelicitacionCumpleanios[]>([]);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [filteredFelicitaciones, setFilteredFelicitaciones] = useState<FelicitacionCumpleanios[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Estados CRUD
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedFelicitacion, setSelectedFelicitacion] = useState<FelicitacionCumpleanios | null>(null);
    const [crudLoading, setCrudLoading] = useState(false);

    const menuRepository = new MenuRepository();
    const felicitacionCrudService = new FelicitacionCrudService();
    const funcionarioService = new FuncionarioService();
    const { canManageReconocimientos } = useMenuPermissions();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let filtered = felicitaciones;

        if (searchTerm) {
            filtered = filtered.filter(felicitacion =>
                felicitacion.mensaje.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${felicitacion.funcionario.nombres} ${felicitacion.funcionario.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredFelicitaciones(filtered);
    }, [felicitaciones, searchTerm]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [felicitacionesData, funcionariosData] = await Promise.all([
                menuRepository.getAllFelicitaciones(), // 👈 CAMBIAR: usar getAllFelicitaciones en lugar de getFelicitacionesMes
                funcionarioService.getAllFuncionarios()
            ]);
            setFelicitaciones(felicitacionesData);
            setFilteredFelicitaciones(felicitacionesData);
            setFuncionarios(funcionariosData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: CreateFelicitacionRequest | UpdateFelicitacionRequest) => {
        setCrudLoading(true);

        let result;
        if ('id' in data) {
            result = await felicitacionCrudService.updateFelicitacion(data as UpdateFelicitacionRequest);
            if (result.success) {
                setShowEditModal(false);
                setSelectedFelicitacion(null);
                fetchData();
            }
        } else {
            result = await felicitacionCrudService.createFelicitacion(data as CreateFelicitacionRequest);
            if (result.success) {
                setShowCreateModal(false);
                fetchData();
            }
        }

        if (!result.success) {
            console.error(result.message);
        }

        setCrudLoading(false);
    };

    const handleDelete = async () => {
        if (!selectedFelicitacion) return;

        setCrudLoading(true);
        const result = await felicitacionCrudService.deleteFelicitacion(selectedFelicitacion.id);

        if (result.success) {
            setShowDeleteModal(false);
            setSelectedFelicitacion(null);
            fetchData();
        } else {
            console.error(result.message);
        }
        setCrudLoading(false);
    };

    const openEditModal = (felicitacion: FelicitacionCumpleanios) => {
        setSelectedFelicitacion(felicitacion);
        setShowEditModal(true);
    };

    const openDeleteModal = (felicitacion: FelicitacionCumpleanios) => {
        setSelectedFelicitacion(felicitacion);
        setShowDeleteModal(true);
    };

    const getProfilePicUrl = (foto: string) => {
        if (!foto) return null;
        if (foto.startsWith('http')) return foto;
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        return `${baseUrl}${foto}`;
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
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

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                            <HiGift className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Gestión de Felicitaciones
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Administra las felicitaciones de cumpleaños del personal
                            </p>
                        </div>
                    </div>

                    {/*{canManageReconocimientos && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                        >
                            <HiPlus className="w-5 h-5" />
                            Nueva felicitación
                        </button>
                    )}*/}
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-4">
                        <div className="flex items-center">
                            <HiGift className="w-8 h-8 text-pink-600 dark:text-pink-400 mr-3" />
                            <div>
                                <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">Total Felicitaciones</p>
                                <p className="text-2xl font-bold text-pink-700 dark:text-pink-300">{felicitaciones.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center">
                            <HiUser className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                            <div>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Funcionarios Felicitados</p>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    {new Set(felicitaciones.map(f => f.funcionario.id)).size}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="relative">
                        <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar felicitaciones..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-pink-500 dark:focus:border-pink-400 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Lista de felicitaciones */}
            {filteredFelicitaciones.length === 0 ? (
                <div className="text-center py-12">
                    <HiGift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No se encontraron felicitaciones
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {felicitaciones.length === 0
                            ? "Aún no hay felicitaciones creadas."
                            : "Intenta ajustar el término de búsqueda."
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredFelicitaciones.map((felicitacion) => {
                        const funcionario = felicitacion.funcionario;
                        const photoUrl = getProfilePicUrl(funcionario.foto);

                        return (
                            <div key={felicitacion.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    {/* Foto del funcionario */}
                                    <div className="flex-shrink-0">
                                        {photoUrl ? (
                                            <img
                                                src={photoUrl}
                                                alt={`${funcionario.nombres} ${funcionario.apellidos}`}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-pink-300 dark:border-pink-600"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center ${photoUrl ? 'hidden' : ''}`}>
                                            <HiUser className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                                    {funcionario.nombres} {funcionario.apellidos}
                                                </h3>
                                                <p className="text-sm font-medium text-pink-600 dark:text-pink-400">
                                                    {funcionario.cargo} - {funcionario.sede.name}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <HiCalendarDays className="w-4 h-4" />
                                                <span>Cumpleaños: {formatBirthdayDate(funcionario.fecha_nacimiento)}</span>
                                            </div>
                                        </div>

                                        <div className="bg-pink-50 dark:bg-pink-900/30 rounded-lg p-3 mb-3">
                                            <p className="text-gray-700 dark:text-gray-300 italic">
                                                "{felicitacion.mensaje}"
                                            </p>
                                        </div>

                                        {canManageReconocimientos && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(felicitacion)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm"
                                                >
                                                    <HiPencil className="w-4 h-4" />
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(felicitacion)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-sm"
                                                >
                                                    <HiTrash className="w-4 h-4" />
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
                title="Crear Felicitación"
                loading={crudLoading}
                submitText="Crear"
            >
                <FelicitacionForm
                    funcionarios={funcionarios}
                    onSubmit={handleSubmit}
                    loading={crudLoading}
                />
            </CrudModal>

            <CrudModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedFelicitacion(null);
                }}
                title="Editar Felicitación"
                loading={crudLoading}
                submitText="Actualizar"
            >
                <FelicitacionForm
                    felicitacion={selectedFelicitacion}
                    funcionarios={funcionarios}
                    onSubmit={handleSubmit}
                    loading={crudLoading}
                />
            </CrudModal>

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedFelicitacion(null);
                }}
                onConfirm={handleDelete}
                loading={crudLoading}
                title="Eliminar Felicitación"
                message="¿Estás seguro de que deseas eliminar esta felicitación? Esta acción no se puede deshacer."
                itemName={selectedFelicitacion ? `Felicitación para ${selectedFelicitacion.funcionario.nombres} ${selectedFelicitacion.funcionario.apellidos}` : ''}
            />
        </div>
    );
}