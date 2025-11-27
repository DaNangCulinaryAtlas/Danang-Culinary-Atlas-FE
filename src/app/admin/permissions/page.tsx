"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Save, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { adminColors } from "@/configs/colors"
import { BASE_URL_2, API_ENDPOINTS } from "@/configs/api"

// API response types
interface RoleResponse {
  roleId: number
  roleName: string
  description?: string
}

interface ActionResponse {
  actionId: number
  actionName: string
  actionCode: string
}

interface PermissionRoleResponse {
  roleId: number
  roleName: string
  description?: string
  actions: ActionResponse[]
}

// Internal types
interface Role {
  id: number
  name: string
  description?: string
}

interface Action {
  id: number
  name: string
  code: string
}

export default function PermissionsManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [permissionMatrix, setPermissionMatrix] = useState<Record<number, Record<number, boolean>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })

  // Get auth token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('token')
    }
    return null
  }

  // Load permissions from API
  useEffect(() => {
    const loadPermissions = async () => {
      setIsLoading(true)
      try {
        const token = getAuthToken()
        if (!token) {
          setNotification({ type: 'error', message: 'Vui lòng đăng nhập lại' })
          setTimeout(() => setNotification({ type: null, message: '' }), 3000)
          setIsLoading(false)
          return
        }

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }

        // Load roles
        const rolesResponse = await fetch(`${BASE_URL_2}${API_ENDPOINTS.ADMIN.ROLES_LIST}`, {
          headers,
        })
        if (!rolesResponse.ok) throw new Error('Failed to load roles')
        const rolesJson = await rolesResponse.json()
        const rolesData: RoleResponse[] = Array.isArray(rolesJson)
          ? rolesJson
          : rolesJson.data || []

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
        if (!actionsResponse.ok) throw new Error('Failed to load actions')
        const actionsJson = await actionsResponse.json()
        const actionsData: ActionResponse[] = Array.isArray(actionsJson)
          ? actionsJson
          : actionsJson.data || []

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
        if (!permissionsResponse.ok) throw new Error('Failed to load permissions')
        const permissionsJson = await permissionsResponse.json()
        
        // Build permission matrix from API response
        // Response format: { status, message, data: [{ roleId, roleName, description, actions: [{ actionId, actionName, actionCode }] }] }
        const matrix: Record<number, Record<number, boolean>> = {}
        
        // Initialize matrix for all role-action combinations (default to false)
        loadedRoles.forEach(role => {
          matrix[role.id] = {}
          loadedActions.forEach(action => {
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
      } catch (error: any) {
        console.error('Error loading permissions:', error)
        setNotification({ 
          type: 'error', 
          message: error?.message || 'Không thể tải dữ liệu permissions' 
        })
        setTimeout(() => setNotification({ type: null, message: '' }), 3000)
      } finally {
        setIsLoading(false)
      }
    }

    loadPermissions()
  }, [])

  const handlePermissionChange = (roleId: number, actionId: number, checked: boolean) => {
    setPermissionMatrix(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [actionId]: checked,
      },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = getAuthToken()
      if (!token) {
        setNotification({ type: 'error', message: 'Vui lòng đăng nhập lại' })
        setTimeout(() => setNotification({ type: null, message: '' }), 3000)
        setIsSaving(false)
        return
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
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to update permissions')
        }
      }

      setNotification({ type: 'success', message: 'Đã cập nhật permissions thành công' })
      setTimeout(() => setNotification({ type: null, message: '' }), 3000)
    } catch (error: any) {
      console.error('Error saving permissions:', error)
      setNotification({ 
        type: 'error', 
        message: error?.message || 'Không thể cập nhật permissions' 
      })
      setTimeout(() => setNotification({ type: null, message: '' }), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: adminColors.primary[500] }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification.type && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl animate-in slide-in-from-top-5 transition-all ${
            notification.type === 'success' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
          }`}
          style={{
            borderColor: notification.type === 'success' ? adminColors.status.success : adminColors.status.error,
          }}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5" style={{ color: adminColors.status.success }} />
          ) : (
            <XCircle className="h-5 w-5" style={{ color: adminColors.status.error }} />
          )}
          <span className="font-semibold text-sm" style={{ 
            color: notification.type === 'success' ? adminColors.status.success : adminColors.status.error 
          }}>
            {notification.message}
          </span>
        </div>
      )}

      {/* Header */}
      <div 
        className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-white shadow-2xl"
        style={{ background: adminColors.gradients.primary }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-15"></div>
        <div className="relative flex items-center gap-4">
          <div 
            className="h-14 w-14 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-white/25"
            style={{ 
              background: adminColors.gradients.primarySoft,
            }}
          >
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1 drop-shadow-sm">
              Quản trị Permission
            </h1>
            <p className="text-base md:text-lg font-medium" style={{ color: adminColors.primary[200] }}>
              Quản lý phân quyền cho từng role trong hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Permission Matrix Table */}
      <Card 
        className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white"
        style={{ borderColor: adminColors.primary[200] }}
      >
        <CardHeader 
          className="border-b"
          style={{ 
            background: `linear-gradient(to right, ${adminColors.primary[50]}, rgba(12, 81, 111, 0.05), white)`,
            borderColor: adminColors.primary[200]
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-bold text-xl" style={{ color: adminColors.primary[700] }}>
                Ma trận Phân quyền
              </CardTitle>
              <CardDescription className="font-semibold mt-1" style={{ color: adminColors.primary[600] }}>
                Chọn checkbox để cấp quyền cho role tương ứng
              </CardDescription>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="shadow-lg hover:shadow-xl transition-all"
              style={{
                background: adminColors.gradients.primarySoft,
                color: 'white',
              }}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr 
                  className="border-b-2"
                  style={{ borderColor: adminColors.primary[200], background: adminColors.primary[50] }}
                >
                  <th 
                    className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider sticky left-0 z-10"
                    style={{ 
                      color: adminColors.primary[700],
                      background: adminColors.primary[50],
                      minWidth: '250px'
                    }}
                  >
                    Action
                  </th>
                  {roles.map((role, roleIndex) => (
                    <th
                      key={role.id ?? role.name ?? `role-${roleIndex}`}
                      className="px-6 py-4 text-center font-bold text-sm uppercase tracking-wider"
                      style={{ color: adminColors.primary[700], minWidth: '120px' }}
                    >
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {actions.map((action, actionIndex) => (
                  <tr
                    key={action.id ?? action.code ?? `action-${actionIndex}`}
                    className={`border-b transition-colors ${
                      actionIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-blue-50`}
                    style={{ borderColor: adminColors.primary[100] }}
                  >
                    <td 
                      className="px-6 py-4 font-semibold text-sm sticky left-0 z-10"
                      style={{ 
                        color: adminColors.primary[700],
                        background: actionIndex % 2 === 0 ? 'white' : '#F9FAFB',
                        minWidth: '250px'
                      }}
                    >
                      {action.name}
                    </td>
                    {roles.map((role, roleIndex) => {
                      const isAllowed = permissionMatrix[role.id]?.[action.id] || false
                      const roleKey = role.id ?? role.name ?? `role-${roleIndex}`
                      const actionKey = action.id ?? action.code ?? `action-${actionIndex}`
                      return (
                        <td
                          key={`${roleKey}-${actionKey}`}
                          className="px-6 py-4 text-center"
                        >
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={isAllowed}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(role.id, action.id, checked as boolean)
                              }
                              className="h-5 w-5"
                              style={{
                                accentColor: adminColors.primary[500],
                              }}
                            />
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card 
        className="border-2 shadow-lg bg-white"
        style={{ borderColor: adminColors.primary[200] }}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div 
              className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: adminColors.primary[50] }}
            >
              <Shield className="h-5 w-5" style={{ color: adminColors.primary[600] }} />
            </div>
            <div>
              <h3 className="font-bold text-base mb-2" style={{ color: adminColors.primary[700] }}>
                Hướng dẫn sử dụng
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <strong>Cột:</strong> Đại diện cho các role trong hệ thống (User, Vendor, Admin)</li>
                <li>• <strong>Hàng:</strong> Đại diện cho các action/permission có thể thực hiện</li>
                <li>• <strong>Checkbox:</strong> Tích vào để cấp quyền, bỏ tích để thu hồi quyền</li>
                <li>• Nhấn <strong>"Lưu thay đổi"</strong> để áp dụng các thay đổi vào hệ thống</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

