import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePermissionConfiguration } from '@/services/admin'

export const usePermissionConfiguration = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            roleId,
            actionId,
            requiresLicense,
        }: {
            roleId: number
            actionId: number
            requiresLicense: boolean
        }) => {
            return await updatePermissionConfiguration(roleId, actionId, requiresLicense)
        },
        onSuccess: () => {
            // Invalidate and refetch roles with permissions
            queryClient.invalidateQueries({ queryKey: ['admin', 'roles-with-permissions'] })
            queryClient.invalidateQueries({ queryKey: ['permissions'] })
        },
    })
}
