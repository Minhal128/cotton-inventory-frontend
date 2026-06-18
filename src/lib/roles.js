export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  COTTON_ARRIVAL: 'COTTON_ARRIVAL_OFFICER',
  COTTON_ISSUE: 'COTTON_ISSUE_OFFICER',
  PRODUCTION: 'PRODUCTION_DEPARTMENT',
  DISPATCH: 'DISPATCH_OFFICER',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.COTTON_ARRIVAL]: 'Cotton Arrival Officer',
  [ROLES.COTTON_ISSUE]: 'Cotton Issue Officer',
  [ROLES.PRODUCTION]: 'Production Department',
  [ROLES.DISPATCH]: 'Dispatch Officer',
};

export const ROLE_COLORS = {
  [ROLES.SUPER_ADMIN]: 'bg-primary-soft text-primary',
  [ROLES.COTTON_ARRIVAL]: 'bg-info-soft text-info',
  [ROLES.COTTON_ISSUE]: 'bg-warning-soft text-warning',
  [ROLES.PRODUCTION]: 'bg-success-soft text-success',
  [ROLES.DISPATCH]: 'bg-danger-soft text-danger',
};