import React, { useState, useMemo } from "react";
import { useResultsData } from "../hooks/useResultsData";
import FilterSelect from "../components/Shared/FilterSelect";
import IndicatorBarChart from "../components/Dashboard/IndicatorBarChart";
import TimeSeriesChart from "../components/Dashboard/TimeSeriesChart";
import IndicatorTable from "../components/Dashboard/IndicatorTable";
import SummaryCards from "../components/Dashboard/SummaryCards";
import CompliancePieChart from "../components/Dashboard/CompliancePieChart";
import WorstIndicatorsChart from "../components/Dashboard/WorstIndicatorsChart";

export default function DashboardPage() {
    const { data, loading } = useResultsData();

    const [selectedSede, setSelectedSede] = useState("");
    const [selectedIndicador, setSelectedIndicador] = useState("");
    const [selectedUnidad, setSelectedUnidad] = useState("");
    const [selectedFrecuencia, setSelectedFrecuencia] = useState("");
    const [selectedAnio, setSelectedAnio] = useState("");

    // Verificar que data existe antes de usarlo
    const safeData = data || [];

    // Obtener opciones únicas
    const sedes = [...new Set(safeData.map((item) => item.headquarterName))];
    const indicadores = [...new Set(safeData.map((item) => item.indicatorName))];
    const unidades = [...new Set(safeData.map((item) => item.measurementUnit))];
    const frecuencias = [...new Set(safeData.map((item) => item.measurementFrequency))];
    const anios = [...new Set(safeData.map((item) => String(item.year)))].sort((a, b) => Number(b) - Number(a));

    // Filtro de datos
    const filteredData = useMemo(() => {
        return safeData.filter((item) => {
            return (
                (!selectedSede || item.headquarterName === selectedSede) &&
                (!selectedIndicador || item.indicatorName === selectedIndicador) &&
                (!selectedUnidad || item.measurementUnit === selectedUnidad) &&
                (!selectedFrecuencia || item.measurementFrequency === selectedFrecuencia) &&
                (!selectedAnio || String(item.year) === selectedAnio)
            );
        });
    }, [safeData, selectedSede, selectedIndicador, selectedUnidad, selectedFrecuencia, selectedAnio]);

    const clearFilters = () => {
        setSelectedSede("");
        setSelectedIndicador("");
        setSelectedUnidad("");
        setSelectedFrecuencia("");
        setSelectedAnio("");
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Dashboard de Resultados
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Visualización y análisis de indicadores institucionales
                </p>
            </div>

            {/* Filtros */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Filtros
                    </h3>
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                        Limpiar filtros
                    </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    <FilterSelect 
                        label="Sede" 
                        options={sedes} 
                        value={selectedSede} 
                        onChange={setSelectedSede} 
                    />
                    <FilterSelect 
                        label="Indicador" 
                        options={indicadores} 
                        value={selectedIndicador} 
                        onChange={setSelectedIndicador} 
                    />
                    <FilterSelect 
                        label="Unidad de Medida" 
                        options={unidades} 
                        value={selectedUnidad} 
                        onChange={setSelectedUnidad} 
                    />
                    <FilterSelect 
                        label="Frecuencia" 
                        options={frecuencias} 
                        value={selectedFrecuencia} 
                        onChange={setSelectedFrecuencia} 
                    />
                    <FilterSelect 
                        label="Año" 
                        options={anios} 
                        value={selectedAnio} 
                        onChange={setSelectedAnio} 
                    />
                </div>
            </div>

            {/* Componentes del dashboard */}
            <SummaryCards data={filteredData} />
            <IndicatorBarChart data={filteredData} loading={loading} />
            <TimeSeriesChart data={filteredData} loading={loading} />
            <CompliancePieChart data={filteredData} loading={loading} />
            <WorstIndicatorsChart data={filteredData} loading={loading} />
            <IndicatorTable data={filteredData} loading={loading} />
        </div>
    );
}