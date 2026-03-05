"use client"

import { useEffect } from "react"
import { toast } from "sonner"

type Props = {
  success: boolean
  message: string
  isEmpty?: boolean
}

export default function WarningToast({ success, message, isEmpty }: Props) {
  useEffect(() => {
    if (!success) {
      toast.error(`⚠️ ${message}`)
    } else if (isEmpty) {
      toast.info("ℹ️ Belum ada data. Silakan tambah data baru.")
    }
  }, [success, message, isEmpty])

  return null
}
