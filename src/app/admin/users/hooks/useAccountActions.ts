import { useState, useCallback } from "react"
import { BASE_URL, API_ENDPOINTS } from "@/configs/api"
import { AccountItem } from "../types"

export function useAccountActions(refetch: () => void) {
  const [updatingAccountId, setUpdatingAccountId] = useState<string | null>(null)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const updateAccountStatus = useCallback(
    async (account: AccountItem, nextStatus: string) => {
      setUpdatingAccountId(account.id)
      try {
        const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ADMIN.UPDATE_ACCOUNT_STATUS(account.id)}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ status: nextStatus }),
        })
        if (!response.ok) {
          throw new Error("Không thể cập nhật trạng thái")
        }
        refetch()
        return { success: true, message: "Đã cập nhật trạng thái tài khoản" }
      } catch (error) {
        console.error(error)
        return { success: false, message: "Cập nhật trạng thái thất bại" }
      } finally {
        setUpdatingAccountId(null)
      }
    },
    [refetch]
  )

  const sendEmail = useCallback(
    async (accountId: string, subject: string, content: string) => {
      setIsSendingEmail(true)
      try {
        const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ADMIN.SEND_EMAIL_TO_ACCOUNT(accountId)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ subject, content }),
        })
        if (!response.ok) {
          throw new Error("Không thể gửi email")
        }
        return { success: true, message: "Email đã được gửi thành công" }
      } catch (error) {
        console.error(error)
        return { success: false, message: "Gửi email thất bại" }
      } finally {
        setIsSendingEmail(false)
      }
    },
    []
  )

  return {
    updateAccountStatus,
    sendEmail,
    updatingAccountId,
    isSendingEmail,
  }
}

