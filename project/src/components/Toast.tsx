import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  text: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (text: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((text: string, type: ToastType = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const styleMap: Record<ToastType, { bg: string; text: string; border: string; icon: string }> = {
    success: {
      bg: "bg-emerald-50",
      text: "text-emerald-900",
      border: "border-emerald-500",
      icon: "text-emerald-600",
    },
    error: {
      bg: "bg-rose-50",
      text: "text-rose-900",
      border: "border-rose-500",
      icon: "text-rose-600",
    },
    info: {
      bg: "bg-blue-50",
      text: "text-blue-900",
      border: "border-blue-500",
      icon: "text-blue-600",
    },
  };

  const iconMap: Record<ToastType, ReactNode> = {
    success: <CheckCircle size={18} className={styleMap.success.icon} />,
    error: <XCircle size={18} className={styleMap.error.icon} />,
    info: <AlertCircle size={18} className={styleMap.info.icon} />,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const s = styleMap[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                className={`pointer-events-auto flex items-center gap-2.5 px-5 py-3 ${s.bg} ${s.text} ${s.border} border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-bold text-sm max-w-md`}
              >
                {iconMap[toast.type]}
                <span className="flex-1">{toast.text}</span>
                <button onClick={() => dismiss(toast.id)} className="opacity-60 hover:opacity-100 transition-opacity">
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
