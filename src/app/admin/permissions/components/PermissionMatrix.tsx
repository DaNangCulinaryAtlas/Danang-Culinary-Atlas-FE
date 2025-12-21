"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Role, Action } from "../types"

interface PermissionMatrixProps {
  roles: Role[]
  actions: Action[]
  permissionMatrix: Record<number, Record<number, boolean>>
  onPermissionChange: (roleId: number, actionId: number, checked: boolean) => void
  disabled?: boolean
}

export default function PermissionMatrix({
  roles,
  actions,
  permissionMatrix,
  onPermissionChange,
  disabled = false,
}: PermissionMatrixProps) {
  console.log('PermissionMatrix actions:', actions)

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 bg-background font-semibold">Action</TableHead>
            {roles.map((role) => (
              <TableHead key={role.id ?? role.name ?? `role-${roles.indexOf(role)}`} className="text-center">
                {role.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions.map((action, actionIndex) => (
            <TableRow key={action.id ?? action.code ?? `action-${actionIndex}`}>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                {action.name}{action.requiresLicense && <span className="text-red-500 ml-1">*</span>}
              </TableCell>
              {roles.map((role, roleIndex) => {
                const roleKey = role.id ?? role.name ?? `role-${roleIndex}`
                const actionKey = action.id ?? action.code ?? `action-${actionIndex}`
                const isChecked = permissionMatrix[role.id]?.[action.id] ?? false

                return (
                  <TableCell key={`${roleKey}-${actionKey}`} className="text-center">
                    <Checkbox
                      checked={isChecked}
                      disabled={disabled}
                      onCheckedChange={(checked) =>
                        onPermissionChange(role.id, action.id, checked === true)
                      }
                    />
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

