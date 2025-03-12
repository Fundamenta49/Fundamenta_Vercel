
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
// Adapted from shadcn/ui (https://ui.shadcn.com/docs/components/toast)
import { useContext } from "react"
import { ToastActionElement, ToastProps } from "./toast"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToastContextType = {
  toasts: ToasterToast[]
  addToast: (toast: Omit<ToasterToast, "id">) => void
  removeToast: (id: string) => void
  updateToast: (id: string, toast: Partial<ToasterToast>) => void
  dismissToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
  updateToast: () => {},
  dismissToast: () => {},
})

export const useToast = () => {
  const context = useContext(ToastContext)

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return {
    toast: context.addToast,
    dismiss: context.dismissToast,
    toasts: context.toasts,
  }
}

export type { ToasterToast }
