import { useState, useEffect } from 'react';
import type { Document } from '../../domain/entities/Document';
import type { Process } from '../../domain/entities/Process';
import { DocumentService } from '../../application/services/DocumentService';
import { DocumentRepository } from '../../infrastructure/repositories/DocumentRepository';
import { ProcessRepository } from '../../infrastructure/repositories/ProcessRepository';

export const useDocumentCRUD = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [processes, setProcesses] = useState<Process[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const documentService = new DocumentService(
        new DocumentRepository(),
        new ProcessRepository()
    );

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const docs = await documentService.getDocuments();
            setDocuments(docs);
            setError(null);
        } catch (err: any) {
            setError("No se pudieron cargar los documentos");
            console.error("Error fetching documents:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProcesses = async () => {
        try {
            const procs = await documentService.getProcesses();
            setProcesses(procs);
        } catch (err: any) {
            console.error("Error al cargar procesos:", err);
        }
    };

    const createDocument = async (data: FormData) => {
        const newDoc = await documentService.createDocument(data);
        setDocuments(prev => [...prev, newDoc]);
        return newDoc;
    };

    const updateDocument = async (id: number, data: FormData) => {
        const updatedDoc = await documentService.updateDocument(id, data);
        setDocuments(prev => prev.map(doc => doc.id === id ? updatedDoc : doc));
        return updatedDoc;
    };

    const deleteDocument = async (id: number) => {
        await documentService.deleteDocument(id);
        setDocuments(prev => prev.filter(doc => doc.id !== id));
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                await Promise.all([fetchDocuments(), fetchProcesses()]);
            } catch (err) {
                setError("Error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return {
        documents,
        processes,
        loading,
        error,
        fetchDocuments,
        fetchProcesses,
        createDocument,
        updateDocument,
        deleteDocument,
        documentService
    };
};