"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { AccountItem } from "../types"

interface EmailDialogProps {
  account: AccountItem | null
  isOpen: boolean
  onClose: () => void
  onSend: (accountId: string, subject: string, content: string) => Promise<{ success: boolean; message: string }>
  isSending: boolean
}

export default function EmailDialog({ account, isOpen, onClose, onSend, isSending }: EmailDialogProps) {
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")

  const handleSend = async () => {
    if (!account || !subject.trim() || !content.trim()) return
    const result = await onSend(account.id, subject, content)
    if (result.success) {
      setSubject("")
      setContent("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gửi email</DialogTitle>
          <DialogDescription>
            Gửi email đến: <strong>{account?.email}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Tiêu đề</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Nhập tiêu đề email..."
            />
          </div>
          <div>
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung email..."
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            Hủy
          </Button>
          <Button onClick={handleSend} disabled={!subject.trim() || !content.trim() || isSending}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              "Gửi email"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

