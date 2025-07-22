import { useAuthContext } from "../../../auth/presentation/context/AuthContext";

export const useMenuPermissions = () => {
  const { roles, user } = useAuthContext();

  const canManageMenu = roles.includes("admin") || roles.includes("adminMenu");
  const canCreateContent = canManageMenu;
  const canEditContent = canManageMenu;
  const canDeleteContent = canManageMenu;
  const canManageFuncionarios = canManageMenu;
  const canManageEventos = canManageMenu;
  const canManageReconocimientos = canManageMenu;

  return {
    canManageMenu,
    canCreateContent,
    canEditContent,
    canDeleteContent,
    canManageFuncionarios,
    canManageEventos,
    canManageReconocimientos,
    isAdmin: roles.includes("admin"),
    isMenuAdmin: roles.includes("adminMenu")
  };
};