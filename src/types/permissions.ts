export type RoleType = 'Admin' | 'Theater Manager' | 'Event Manager';

export interface Permission {
  id: string;
  name: string;
  category: string;
}

export interface Role {
  id: string;
  name: RoleType;
  permissions: string[];
}