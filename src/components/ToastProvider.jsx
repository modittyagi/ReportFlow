import { Toaster } from 'sonner'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        classNames: {
          toast: 'border border-gray-200 shadow-lg',
          success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          error: 'bg-red-50 border-red-200 text-red-800',
          warning: 'bg-amber-50 border-amber-200 text-amber-800',
          info: 'bg-blue-50 border-blue-200 text-blue-800',
          title: 'font-medium',
          description: 'text-sm opacity-80',
          actionButton: 'bg-brand-600 text-white hover:bg-brand-700',
          cancelButton: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
          closeButton: 'bg-gray-100 hover:bg-gray-200 text-gray-500',
        },
      }}
      closeButton
      richColors
      theme="light"
    />
  )
}
