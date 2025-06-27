import { useEffect, useState } from "react";
import axiosInstance from "../../../../core/infrastructure/http/axiosInstance";
import { FaEye, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

interface ProcessType {
    id: number;
    name: string;
}

interface Department {
    id: number;
    name: string;
}

interface Process {
    id: number;
    name: string;
    description: string;
    code: string;
    version: string;
    processType: number;
    department: number;
    status: boolean;
    creationDate: string;
    updateDate: string;
    user: number;
}

export default function Procesos() {
    const [processes, setProcesses] = useState<Process[]>([]);
    const [processTypes, setProcessTypes] = useState<ProcessType[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [processIdToDelete, setProcessIdToDelete] = useState<number | null>(null);
    const [processToToggle, setProcessToToggle] = useState<{ id: number; currentStatus: boolean } | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewResult, setViewResult] = useState<Process | null>(null);
    const [mensaje, setMensaje] = useState("");
    const [formError, setFormError] = useState("");

    const [form, setForm] = useState<Partial<Process>>({
        name: "",
        description: "",
        code: "",
        version: "",
        status: true,
        processType: 0,
        department: 0,
    });

    useEffect(() => {
        const fetchProcesses = async () => {
            try {
                const response = await axiosInstance.get("/processes/");
                setProcesses(response.data);
                setLoading(false);
            } catch (err: any) {
                setError("No se pudieron cargar los procesos");
                setLoading(false);
            }
        };

        const fetchProcessTypes = async () => {
            try {
                const response = await axiosInstance.get("/process-types/");
                setProcessTypes(response.data);
            } catch (err: any) {
                setError("No se pudieron cargar los tipos de proceso");
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await axiosInstance.get("/departments/");
                setDepartments(response.data);
            } catch (err: any) {
                setError("No se pudieron cargar las áreas");
            }
        };

        fetchProcesses();
        fetchProcessTypes();
        fetchDepartments();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }));
    };

    const validateForm = () => {
        if (!form.name || !form.description || !form.code || !form.version || !form.processType || !form.department) {
            setFormError("Todos los campos obligatorios deben estar completos.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");
        setMensaje("");
        if (!validateForm()) return;

        try {
            if (isEditing && form.id) {
                const response = await axiosInstance.put(`/processes/${form.id}/`, form);
                setProcesses((prev) =>
                    prev.map((process) => (process.id === response.data.id ? response.data : process))
                );
                setMensaje("Proceso actualizado exitosamente");
            } else {
                const response = await axiosInstance.post("/processes/", form);
                setProcesses((prev) => [...prev, response.data]);
                setMensaje("Proceso creado exitosamente");
            }
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            setFormError("Error al guardar el proceso.");
        }
    };

    const handleEdit = (process: Process) => {
        setForm(process);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleView = (process: Process) => {
        setViewResult(process);
        setIsViewModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setProcessIdToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!processIdToDelete) return;
        try {
            await axiosInstance.delete(`/processes/${processIdToDelete}/`);
            setProcesses((prev) => prev.filter((process) => process.id !== processIdToDelete));
            setMensaje("Proceso eliminado exitosamente");
        } catch {
            setFormError("Error al eliminar el proceso.");
        } finally {
            setProcessIdToDelete(null);
            setIsConfirmModalOpen(false);
        }
    };

    const handleToggleStatus = (id: number, currentStatus: boolean) => {
        setProcessToToggle({ id, currentStatus });
        setIsConfirmModalOpen(true);
    };

    const confirmToggleStatus = async () => {
        if (!processToToggle) return;
        try {
            const response = await axiosInstance.patch(`/processes/${processToToggle.id}/`, {
                status: !processToToggle.currentStatus,
            });
            setProcesses((prev) =>
                prev.map((process) =>
                    process.id === processToToggle.id ? { ...process, status: response.data.status } : process
                )
            );
            setMensaje(`Proceso ${processToToggle.currentStatus ? "inactivado" : "activado"} exitosamente`);
        } catch {
            setFormError("Error al cambiar el estado del proceso.");
        } finally {
            setProcessToToggle(null);
            setIsConfirmModalOpen(false);
        }
    };

    const resetForm = () => {
        setForm({
            name: "",
            description: "",
            code: "",
            version: "",
            status: true,
            processType: 0,
            department: 0,
        });
        setIsEditing(false);
        setIsModalOpen(false);
    };

    const openModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    if (loading) return <div className="text-center py-8 text-blue-600 dark:text-blue-300">Cargando procesos...</div>;
    if (error) return <div className="text-center py-8 text-red-600 dark:text-red-400">{error}</div>;

    return (
        <div className="p-4 sm:p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Procesos</h2>
            <button
                className="mb-4 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                onClick={openModal}
            >
                Agregar Proceso
            </button>
            {mensaje && <div className="mb-4 text-green-600 dark:text-green-400">{mensaje}</div>}

            {/* Modal de formulario */}
            {isModalOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl w-full max-w-lg mx-auto my-4 sm:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">{isEditing ? "Editar" : "Agregar"} Proceso</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {formError && <div className="text-red-600 dark:text-red-400">{formError}</div>}
                            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Nombre del proceso"
                                        value={form.name || ""}
                                        onChange={handleChange}
                                        className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Código</label>
                                    <input
                                        type="text"
                                        name="code"
                                        placeholder="Código del proceso"
                                        value={form.code || ""}
                                        onChange={handleChange}
                                        className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Versión</label>
                                    <input
                                        type="text"
                                        name="version"
                                        placeholder="Versión del proceso"
                                        value={form.version || ""}
                                        onChange={handleChange}
                                        className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tipo de Proceso</label>
                                    <select
                                        name="processType"
                                        value={form.processType || ""}
                                        onChange={handleChange}
                                        className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        required
                                    >
                                        <option value="">Seleccione Tipo de Proceso</option>
                                        {processTypes.map((processType) => (
                                            <option key={processType.id} value={processType.id}>
                                                {processType.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Área</label>
                                    <select
                                        name="department"
                                        value={form.department || ""}
                                        onChange={handleChange}
                                        className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        required
                                    >
                                        <option value="">Seleccione Área</option>
                                        {departments.map((department) => (
                                            <option key={department.id} value={department.id}>
                                                {department.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Estado</label>
                                    <select
                                        name="status"
                                        value={form.status ? "true" : "false"}
                                        onChange={handleChange}
                                        className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        required
                                    >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Descripción</label>
                                    <textarea
                                        name="description"
                                        placeholder="Descripción del proceso"
                                        value={form.description || ""}
                                        onChange={handleChange}
                                        rows={4}
                                        className="mt-1 p-3 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-vertical"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center sm:justify-end space-x-4 mt-8">
                                <button
                                    type="button"
                                    className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    {isEditing ? "Actualizar" : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de visualización */}
            {isViewModalOpen && viewResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 transition-opacity duration-300 ease-out">
                    <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl sm:p-8 transform transition-all duration-300 scale-100 hover:scale-[1.01]">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            onClick={() => setIsViewModalOpen(false)}
                            aria-label="Cerrar modal"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center tracking-tight">
                            Detalles del Proceso
                        </h2>
                        <div className="space-y-4 text-gray-700 dark:text-gray-200">
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium">Nombre:</span>
                                <span>{viewResult.name || "N/A"}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium">Código:</span>
                                <span>{viewResult.code || "N/A"}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium">Versión:</span>
                                <span>{viewResult.version || "N/A"}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium">Tipo de Proceso:</span>
                                <span>
                                    {processTypes.find((processType) => processType.id === viewResult.processType)?.name || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium">Área:</span>
                                <span>
                                    {departments.find((department) => department.id === viewResult.department)?.name || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium">Descripción:</span>
                                <span className="text-right max-w-xs">{viewResult.description || "N/A"}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium">Estado:</span>
                                <span>{viewResult.status ? "Activo" : "Inactivo"}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium">Fecha de Creación:</span>
                                <span>{viewResult.creationDate || "N/A"}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium">Última Actualización:</span>
                                <span>{viewResult.updateDate || "N/A"}</span>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button
                                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                                onClick={() => setIsViewModalOpen(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Versión</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Área</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha de Creación</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {processes.map((process) => (
                            <tr key={process.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{process.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{process.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{process.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{process.version}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                    {processTypes.find((processType) => processType.id === process.processType)?.name || "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                    {departments.find((department) => department.id === process.department)?.name || "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                    {process.status ? "Activo" : "Inactivo"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                    {new Date(process.creationDate).toLocaleDateString("es-CO")}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 flex space-x-4">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        onClick={() => handleEdit(process)}
                                        title="Editar"
                                        aria-label="Editar proceso"
                                    >
                                        <FaEdit size={20} />
                                    </button>
                                    <button
                                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                        onClick={() => handleView(process)}
                                        title="Ver"
                                        aria-label="Ver proceso"
                                    >
                                        <FaEye size={20} />
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                        onClick={() => handleDelete(process.id)}
                                        title="Eliminar"
                                        aria-label="Eliminar proceso"
                                    >
                                        <FaTrash size={20} />
                                    </button>
                                    <button
                                        className={
                                            process.status
                                                ? "text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                : "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                        }
                                        onClick={() => handleToggleStatus(process.id, process.status)}
                                        title={process.status ? "Inactivar" : "Activar"}
                                        aria-label={process.status ? "Inactivar proceso" : "Activar proceso"}
                                    >
                                        {process.status ? <FaToggleOff size={20} /> : <FaToggleOn size={20} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de confirmación */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl w-full max-w-md mx-auto">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Confirmar Acción</h3>
                        <p className="mb-6 text-gray-700 dark:text-gray-200">
                            {processIdToDelete
                                ? "¿Estás seguro de que deseas eliminar este proceso? Esta acción no se puede deshacer."
                                : processToToggle
                                    ? `¿Estás seguro de que deseas ${processToToggle.currentStatus ? "inactivar" : "activar"} este proceso?`
                                    : "¿Estás seguro de que deseas realizar esta acción?"}
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                                onClick={() => {
                                    setIsConfirmModalOpen(false);
                                    setProcessIdToDelete(null);
                                    setProcessToToggle(null);
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={() => {
                                    if (processIdToDelete) confirmDelete();
                                    if (processToToggle) confirmToggleStatus();
                                }}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}