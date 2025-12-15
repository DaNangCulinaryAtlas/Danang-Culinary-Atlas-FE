// API response types
export interface RoleResponse {
  roleId: number
  roleName: string
  description?: string
}

export interface ActionResponse {
  actionId: number
  actionName: string
  actionCode: string
}

export interface PermissionRoleResponse {
  roleId: number
  roleName: string
  description?: string
  actions: ActionResponse[]
}

// Internal types
export interface Role {
  id: number
  name: string
  description?: string
}

export interface Action {
  id: number
  name: string
  code: string
}

