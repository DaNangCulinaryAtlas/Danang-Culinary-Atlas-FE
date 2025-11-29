import { useState, useEffect, useCallback } from "react"
import { BASE_URL_2, API_ENDPOINTS } from "@/configs/api"
import { Role, Action, RoleResponse, ActionResponse, PermissionRoleResponse } from "../types"

export function usePermissions() {
  const [roles, setRoles] = useState<Role[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [permissionMatrix, setPermissionMatrix] = useState<Record<number, Record<number, boolean>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("token")
    }
    return null
  }, [])

  const loadPermissions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = getAuthToken()
      if (!token) {
        setError("Vui lòng đăng nhập lại")
        setIsLoading(false)
        return
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }

      // Load roles
      const rolesResponse = await fetch(`${BASE_URL_2}${API_ENDPOINTS.ADMIN.ROLES_LIST}`, {
        headers,
      })
      if (!rolesResponse.ok) throw new Error("Failed to load roles")
      const rolesJson = await rolesResponse.json()
      const rolesData: RoleResponse[] = Array.isArray(rolesJson) ? rolesJson : rolesJson.data || []

      const loadedRoles: Role[] = rolesData.map((role) => ({
        id: role.roleId,
        name: role.roleName,
        description: role.description,
      }))
      setRoles(loadedRoles)

      // Load actions
      const actionsResponse = await fetch(`${BASE_URL_2}${API_ENDPOINTS.ADMIN.ACTIONS_LIST}`, {
        headers,
      })
      if (!actionsResponse.ok) throw new Error("Failed to load actions")
      const actionsJson = await actionsResponse.json()
      const actionsData: ActionResponse[] = Array.isArray(actionsJson) ? actionsJson : actionsJson.data || []

      const loadedActions: Action[] = actionsData.map((action) => ({
        id: action.actionId,
        name: action.actionName,
        code: action.actionCode,
      }))
      setActions(loadedActions)

      // Load permissions for all roles
      const permissionsResponse = await fetch(`${BASE_URL_2}${API_ENDPOINTS.ADMIN.PERMISSIONS_LIST}`, {
        headers,
      })
      if (!permissionsResponse.ok) throw new Error("Failed to load permissions")
      const permissionsJson = await permissionsResponse.json()

      // Build permission matrix from API response
      const matrix: Record<number, Record<number, boolean>> = {}

      // Initialize matrix for all role-action combinations (default to false)
      loadedRoles.forEach((role) => {
        matrix[role.id] = {}
        loadedActions.forEach((action) => {
          matrix[role.id][action.id] = false
        })
      })

      // Parse permissions from API response
      const permissionRoles: PermissionRoleResponse[] = Array.isArray(permissionsJson)
        ? permissionsJson
        : permissionsJson.data || []

      if (permissionRoles.length) {
        permissionRoles.forEach((rolePermission) => {
          const roleId = rolePermission.roleId
          if (roleId && Array.isArray(rolePermission.actions)) {
            if (!matrix[roleId]) {
              matrix[roleId] = {}
            }
            rolePermission.actions.forEach((action) => {
              const actionId = action.actionId
              if (actionId !== undefined) {
                matrix[roleId][actionId] = true
              }
            })
          }
        })
      } else if (Array.isArray(permissionsJson)) {
        // Fallback: if response is directly an array
        permissionsJson.forEach((rolePermission: any) => {
          const roleId = rolePermission.roleId
          if (roleId && rolePermission.actions && Array.isArray(rolePermission.actions)) {
            if (!matrix[roleId]) {
              matrix[roleId] = {}
            }
            rolePermission.actions.forEach((action: any) => {
              const actionId = action.actionId
              if (actionId !== undefined) {
                matrix[roleId][actionId] = true
              }
            })
          }
        })
      }

      setPermissionMatrix(matrix)
    } catch (err: any) {
      console.error("Error loading permissions:", err)
      setError(err?.message || "Không thể tải dữ liệu permissions")
    } finally {
      setIsLoading(false)
    }
  }, [getAuthToken])

  const updatePermission = useCallback((roleId: number, actionId: number, checked: boolean) => {
    setPermissionMatrix((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [actionId]: checked,
      },
    }))
  }, [])

  const savePermissions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = getAuthToken()
      if (!token) {
        setError("Vui lòng đăng nhập lại")
        setIsLoading(false)
        return { success: false, message: "Vui lòng đăng nhập lại" }
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }

      // Build payloads per role as API expects { roleId, actionIds }
      const payloads = roles.map((role) => {
        const actionIds = actions
          .filter((action) => permissionMatrix[role.id]?.[action.id])
          .map((action) => action.id)
        return { roleId: role.id, actionIds }
      })

      // Update each role sequentially to ensure backend consistency
      for (const payload of payloads) {
        const response = await fetch(`${BASE_URL_2}${API_ENDPOINTS.ADMIN.PERMISSIONS_UPDATE}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || "Failed to update permissions")
        }
      }

      return { success: true, message: "Đã cập nhật permissions thành công" }
    } catch (err: any) {
      console.error("Error saving permissions:", err)
      setError(err?.message || "Không thể lưu permissions")
      return { success: false, message: err?.message || "Không thể lưu permissions" }
    } finally {
      setIsLoading(false)
    }
  }, [permissionMatrix, roles, actions, getAuthToken])

  useEffect(() => {
    loadPermissions()
  }, [loadPermissions])

  return {
    roles,
    actions,
    permissionMatrix,
    isLoading,
    error,
    updatePermission,
    savePermissions,
    refetch: loadPermissions,
  }
}

