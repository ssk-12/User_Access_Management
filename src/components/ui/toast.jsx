import * as React from "react"
import { XIcon } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const ToastProvider = React.createContext({
  showToast: () => {},
  hideToast: () => {},
})

export const useToast = () => React.useContext(ToastProvider)

const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-md border px-4 py-3 shadow-md transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-800 border-gray-200",
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export function ToastContainer({ 
  className, 
  variant, 
  ...props 
}) {
  return (
    <div
      className={cn(toastVariants({ variant }), className)}
      role="alert"
      {...props}
    />
  )
}

export function ToastProviderComponent({ children }) {
  const [toast, setToast] = React.useState(null)
  const timerRef = React.useRef(null)

  const showToast = (message, variant = "default", duration = 3000) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    
    setToast({ message, variant })
    
    timerRef.current = setTimeout(() => {
      setToast(null)
    }, duration)
  }

  const hideToast = () => {
    setToast(null)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  return (
    <ToastProvider.Provider value={{ showToast, hideToast }}>
      {children}
      
      {toast && (
        <ToastContainer variant={toast.variant}>
          <span>{toast.message}</span>
          <button 
            onClick={hideToast} 
            className="ml-auto text-current hover:opacity-70"
            aria-label="Close toast"
          >
            <XIcon size={16} />
          </button>
        </ToastContainer>
      )}
    </ToastProvider.Provider>
  )
} 