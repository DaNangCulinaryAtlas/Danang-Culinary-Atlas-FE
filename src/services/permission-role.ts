import { useState, useEffect, useCallback } from "react"
import { Role, Action } from "../app/admin/permissions/types"
import {
  getAllRoles,
  getAllActions,
  getRolesWithPermissions,
  updateRolePermissions
} from './admin'

// React Hook
export function usePermissions() {
  const [roles, setRoles] = useState<Role[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [permissionMatrix, setPermissionMatrix] = useState<Record<number, Record<number, boolean>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPermissions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Load all data in parallel
      const [rolesData, actionsData, permissionRoles] = await Promise.all([
        getAllRoles(),
        getAllActions(),
        getRolesWithPermissions()
      ])

      // Map to internal types
      const loadedRoles: Role[] = rolesData.map((role) => ({
        id: role.roleId,
        name: role.roleName,
        description: role.description,
      }))

      const loadedActions: Action[] = actionsData.map((action) => ({
        id: action.actionId,
        name: action.actionName,
        code: action.actionCode,
        requiresLicense: action.requiresLicense,
      }))

      // Merge requiresLicense info from permissionRoles if not available in actionsData
      permissionRoles.forEach((rolePermission) => {
        if (Array.isArray(rolePermission.actions)) {
          rolePermission.actions.forEach((action) => {
            const foundAction = loadedActions.find(a => a.id === action.actionId)
            if (foundAction && action.requiresLicense !== undefined) {
              foundAction.requiresLicense = action.requiresLicense
            }
          })
        }
      })

      console.log('Loaded actions with requiresLicense:', loadedActions)

      setRoles(loadedRoles)
      setActions(loadedActions)

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

      setPermissionMatrix(matrix)
    } catch (err: any) {
      console.error("Error loading permissions:", err)
      setError(err?.message || "Không thể tải dữ liệu permissions")
    } finally {
      setIsLoading(false)
    }
  }, [])

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
      // Build payloads per role as API expects { roleId, actionIds }
      const payloads = roles.map((role) => {
        const actionIds = actions
          .filter((action) => permissionMatrix[role.id]?.[action.id])
          .map((action) => action.id)
        return { roleId: role.id, actionIds }
      })

      // Update each role sequentially to ensure backend consistency
      let lastResponse = null
      for (const payload of payloads) {
        lastResponse = await updateRolePermissions(payload.roleId, payload.actionIds)
      }

      // Reload permissions after successful update
      await loadPermissions()

      return {
        success: true,
        message: lastResponse?.message || "Đã cập nhật permissions thành công cho tất cả roles"
      }
    } catch (err: any) {
      console.error("Error saving permissions:", err)
      const errorMessage = err?.message || "Không thể lưu permissions"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [permissionMatrix, roles, actions, loadPermissions])

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

