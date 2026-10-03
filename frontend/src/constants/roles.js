
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


export const hasRole = (userRoles, requiredRole) => {
  if (!userRoles || !Array.isArray(userRoles)) return false;
  return userRoles.includes(requiredRole);
};

export const hasAnyRole = (userRoles, requiredRoles) => {
  if (!userRoles || !Array.isArray(userRoles)) return false;
  return requiredRoles.some(role => userRoles.includes(role));
};

export const hasMinimumRole = (userRoles, minimumRole) => {
  if (!userRoles || !Array.isArray(userRoles)) return false;
  const maxRoleLevel = Math.max(...userRoles.map(role => ROLE_HIERARCHY[role] || 0));
  const minRequiredLevel = ROLE_HIERARCHY[minimumRole] || 0;
  return maxRoleLevel >= minRequiredLevel;
};
