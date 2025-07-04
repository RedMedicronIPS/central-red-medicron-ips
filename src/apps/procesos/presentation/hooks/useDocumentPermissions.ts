import { useMemo } from 'react';
import { useAuthContext } from '../../../auth/presentation/context/AuthContext';
import { PermissionService } from '../../application/services/PermissionService';

export const useDocumentPermissions = () => {
    const { roles } = useAuthContext();

    return useMemo(() => {
        return PermissionService.getPermissions(roles);
    }, [roles]);
};