
"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, toastType, ...props }) {
        const isEmojiCopy = toastType === 'emoji-copy';
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
      {/* Viewport for specific toasts */}
       <ToastViewport
        name="emoji-copy"
        className="fixed bottom-0 left-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col-reverse md:max-w-[420px]"
      />
    </ToastProvider>
  )
}
