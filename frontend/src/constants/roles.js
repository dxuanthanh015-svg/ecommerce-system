
export const ROLE = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  STORE_MANAGER: 'store_manager',
};


export const DEFAULT_ROLE = [ROLE.CUSTOMER];


export const ROLE_COMBINATIONS = {
  CUSTOMER: [ROLE.CUSTOMER],
  STORE_MANAGER: [ROLE.CUSTOMER, ROLE.STORE_MANAGER],
  ADMIN: [ROLE.ADMIN],
};


export const ROLE_HIERARCHY = {
  [ROLE.CUSTOMER]: 1,
  [ROLE.STORE_MANAGER]: 2,
  [ROLE.ADMIN]: 3,
};


const normalizeRole = (role) => String(role || "")
  .trim()
  .replace(/^ROLE_/i, "")
  .toLowerCase();

export const hasRole = (userRoles, requiredRole) => {
  if (!userRoles) return false;
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  return roles.some((role) => normalizeRole(role) === normalizeRole(requiredRole));
};

export const hasAnyRole = (userRoles, requiredRoles) =>
  requiredRoles.some((role) => hasRole(userRoles, role));

export const hasMinimumRole = (userRoles, minimumRole) => {
  if (!userRoles) return false;
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  const maxRoleLevel = Math.max(...roles.map((role) => ROLE_HIERARCHY[normalizeRole(role)] || 0));
  const minRequiredLevel = ROLE_HIERARCHY[normalizeRole(minimumRole)] || 0;
  return maxRoleLevel >= minRequiredLevel;
};
