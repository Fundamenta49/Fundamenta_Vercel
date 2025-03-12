
import { useState, useEffect } from "react"

type ToastType = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  type?: "default" | "success" | "error" | "warning"
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([])

  const toast = (props: Omit<ToastType, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, ...props }])
    return id
  }

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return {
    toast,
    dismiss,
    toasts,
  }
}
