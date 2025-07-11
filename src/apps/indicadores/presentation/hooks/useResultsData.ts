// src/apps/indicadores/presentation/hooks/useResultsData.ts
import { useState, useEffect } from 'react';
import axiosInstance from '../../../../core/infrastructure/http/axiosInstance';

export const useResultsData = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/indicators/results/detailed/');
        setData(response.data);
      } catch (err: any) {
        console.error('Error fetching results data:', err);
        setError('Error al cargar los datos de resultados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};