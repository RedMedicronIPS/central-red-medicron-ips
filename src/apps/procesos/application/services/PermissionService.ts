export interface DocumentPermissions {
    isAdmin: boolean;
    isGestor: boolean;
    isUser: boolean;
    canViewDocuments: boolean;
    canDownload: boolean;
    canManage: boolean;
    canDownloadByFormat: (filename: string) => boolean;
}

export class PermissionService {
    static getPermissions(roles: string[]): DocumentPermissions {
        const isAdmin = roles.includes("admin");
        const isGestor = roles.includes("gestor");
        const isUser = roles.includes("user");

        return {
            isAdmin,
            isGestor,
            isUser,
            canViewDocuments: isAdmin || isGestor || isUser,
            canDownload: isAdmin || isGestor,
            canManage: isAdmin,
            canDownloadByFormat: (filename: string) => {
                const ext = filename?.toLowerCase().split('.').pop();
                
                // Excel y Word: todos los usuarios pueden descargar
                if (['doc', 'docx', 'xls', 'xlsx'].includes(ext || '')) {
                    return true;
                }
                
                // PDF: solo gestores y administradores
                if (ext === 'pdf') {
                    return isAdmin || isGestor;
                }
                
                return false;
            }
        };
    }

    static getPermissionMessage(role: 'admin' | 'gestor' | 'user', action: 'emptyState'): string {
        const messages = {
            admin: {
                emptyState: "Intenta ajustar los filtros de búsqueda"
            },
            gestor: {
                emptyState: "No hay documentos disponibles para consulta y descarga"
            },
            user: {
                emptyState: "No hay documentos disponibles para consulta"
            }
        };

        return messages[role][action];
    }
}