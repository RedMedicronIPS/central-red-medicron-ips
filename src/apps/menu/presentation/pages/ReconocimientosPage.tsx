import React, { useState, useEffect } from "react";
import { HiStar, HiMagnifyingGlass, HiPlus, HiPencil, HiTrash, HiEye, HiCalendarDays, HiUser } from "react-icons/hi2";
import { MenuRepository } from "../../infrastructure/repositories/MenuRepository";
import { ReconocimientoCrudService } from "../../application/services/ReconocimientoCrudService";
import { FuncionarioService } from "../../application/services/FuncionarioService";
import { useMenuPermissions } from "../hooks/useMenuPermissions";
import type { Reconocimiento, Funcionario, CreateReconocimientoRequest, UpdateReconocimientoRequest } from "../../domain/types";
import CrudModal from "../components/CrudModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ReconocimientoForm from "../components/ReconocimientoForm";
import { formatDisplayDate } from "../../../../shared/utils/dateUtils";

export default function ReconocimientosPage() {
    const [reconocimientos, setReconocimientos] = useState<Reconocimiento[]>([]);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [filteredReconocimientos, setFilteredReconocimientos] = useState<Reconocimiento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTipo, setSelectedTipo] = useState('');
    const [selectedPublicar, setSelectedPublicar] = useState('');

    // Estados CRUD
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedReconocimiento, setSelectedReconocimiento] = useState<Reconocimiento | null>(null);
    const [crudLoading, setCrudLoading] = useState(false);

    const menuRepository = new MenuRepository();
    const reconocimientoCrudService = new ReconocimientoCrudService();
    const funcionarioService = new FuncionarioService();
    const { canManageReconocimientos } = useMenuPermissions();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let filtered = reconocimientos;

        if (searchTerm) {
            filtered = filtered.filter(reconocimiento =>
                reconocimiento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reconocimiento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${reconocimiento.funcionario.nombres} ${reconocimiento.funcionario.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedTipo) {
            filtered = filtered.filter(reconocimiento => reconocimiento.tipo === selectedTipo);
        }

        if (selectedPublicar !== '') {
            const isPublicar = selectedPublicar === 'true';
            filtered = filtered.filter(reconocimiento => reconocimiento.publicar === isPublicar);
        }

        setFilteredReconocimientos(filtered);
    }, [reconocimientos, searchTerm, selectedTipo, selectedPublicar]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [reconocimientosData, funcionariosData] = await Promise.all([
                menuRepository.getAllReconocimientos(), // 👈 CAMBIAR: usar getAllReconocimientos en lugar de getReconocimientosPublicados
                funcionarioService.getAllFuncionarios()
            ]);
            setReconocimientos(reconocimientosData);
            setFilteredReconocimientos(reconocimientosData);
            setFuncionarios(funcionariosData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: CreateReconocimientoRequest | UpdateReconocimientoRequest) => {
        setCrudLoading(true);

        let result;
        if ('id' in data) {
            result = await reconocimientoCrudService.updateReconocimiento(data as UpdateReconocimientoRequest);
            if (result.success) {
                setShowEditModal(false);
                setSelectedReconocimiento(null);
                fetchData();
            }
        } else {
            result = await reconocimientoCrudService.createReconocimiento(data as CreateReconocimientoRequest);
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
        if (!selectedReconocimiento) return;

        setCrudLoading(true);
        const result = await reconocimientoCrudService.deleteReconocimiento(selectedReconocimiento.id);

        if (result.success) {
            setShowDeleteModal(false);
            setSelectedReconocimiento(null);
            fetchData();
        } else {
            console.error(result.message);
        }
        setCrudLoading(false);
    };

    const openEditModal = (reconocimiento: Reconocimiento) => {
        setSelectedReconocimiento(reconocimiento);
        setShowEditModal(true);
    };

    const openDeleteModal = (reconocimiento: Reconocimiento) => {
        setSelectedReconocimiento(reconocimiento);
        setShowDeleteModal(true);
    };

    const getProfilePicUrl = (foto: string) => {
        if (!foto) return null;
        if (foto.startsWith('http')) return foto;
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        return `${baseUrl}${foto}`;
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedTipo('');
        setSelectedPublicar('');
    };

    // Obtener tipos únicos
    const tiposUnicos = [...new Set(reconocimientos.map(r => r.tipo).filter(Boolean))];

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
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                            <HiStar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Gestión de Reconocimientos
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Administra todos los reconocimientos otorgados al personal
                            </p>
                        </div>
                    </div>

                    {canManageReconocimientos && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                            <HiPlus className="w-5 h-5" />
                            Nuevo reconocimiento
                        </button>
                    )}
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex items-center">
                            <HiStar className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mr-3" />
                            <div>
                                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Total Reconocimientos</p>
                                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{reconocimientos.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-center">
                            <HiEye className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                            <div>
                                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Publicados</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                    {reconocimientos.filter(r => r.publicar).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center">
                            <HiUser className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                            <div>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Funcionarios Reconocidos</p>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    {new Set(reconocimientos.map(r => r.funcionario.id)).size}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="relative">
                            <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar reconocimientos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-yellow-500 dark:focus:border-yellow-400 transition-colors"
                            />
                        </div>

                        <select
                            value={selectedTipo}
                            onChange={(e) => setSelectedTipo(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-yellow-500 dark:focus:border-yellow-400 transition-colors"
                        >
                            <option value="">Todos los tipos</option>
                            {tiposUnicos.map(tipo => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </select>

                        <select
                            value={selectedPublicar}
                            onChange={(e) => setSelectedPublicar(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-yellow-500 dark:focus:border-yellow-400 transition-colors"
                        >
                            <option value="">Estado de publicación</option>
                            <option value="true">Publicados</option>
                            <option value="false">No publicados</option>
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

            {/* Lista de reconocimientos */}
            {filteredReconocimientos.length === 0 ? (
                <div className="text-center py-12">
                    <HiStar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No se encontraron reconocimientos
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {reconocimientos.length === 0
                            ? "Aún no hay reconocimientos creados."
                            : "Intenta ajustar los filtros de búsqueda."
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReconocimientos.map((reconocimiento) => {
                        const funcionario = reconocimiento.funcionario;
                        const photoUrl = getProfilePicUrl(funcionario.foto);

                        return (
                            <div key={reconocimiento.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    {/* Foto del funcionario */}
                                    <div className="flex-shrink-0">
                                        {photoUrl ? (
                                            <img
                                                src={photoUrl}
                                                alt={`${funcionario.nombres} ${funcionario.apellidos}`}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-yellow-300 dark:border-yellow-600"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center ${photoUrl ? 'hidden' : ''}`}>
                                            <HiUser className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                                    {reconocimiento.titulo}
                                                </h3>
                                                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                                    {funcionario.nombres} {funcionario.apellidos} - {funcionario.cargo}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {reconocimiento.publicar ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        <HiEye className="w-3 h-3 mr-1" />
                                                        Publicado
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                                                        Borrador
                                                    </span>
                                                )}

                                                {reconocimiento.tipo && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {reconocimiento.tipo}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                            {reconocimiento.descripcion}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <HiCalendarDays className="w-4 h-4" />
                                                <span>{formatDisplayDate(reconocimiento.fecha)}</span>
                                            </div>

                                            {canManageReconocimientos && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openEditModal(reconocimiento)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm"
                                                    >
                                                        <HiPencil className="w-4 h-4" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(reconocimiento)}
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
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modales CRUD */}
            <CrudModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Crear Reconocimiento"
                loading={crudLoading}
                submitText="Crear"
            >
                <ReconocimientoForm
                    funcionarios={funcionarios}
                    onSubmit={handleSubmit}
                    loading={crudLoading}
                />
            </CrudModal>

            <CrudModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedReconocimiento(null);
                }}
                title="Editar Reconocimiento"
                loading={crudLoading}
                submitText="Actualizar"
            >
                <ReconocimientoForm
                    reconocimiento={selectedReconocimiento}
                    funcionarios={funcionarios}
                    onSubmit={handleSubmit}
                    loading={crudLoading}
                />
            </CrudModal>

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedReconocimiento(null);
                }}
                onConfirm={handleDelete}
                loading={crudLoading}
                title="Eliminar Reconocimiento"
                message="¿Estás seguro de que deseas eliminar este reconocimiento? Esta acción no se puede deshacer."
                itemName={selectedReconocimiento ? selectedReconocimiento.titulo : ''}
            />
        </div>
    );
}