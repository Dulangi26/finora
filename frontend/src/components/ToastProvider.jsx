import { createContext, useContext, useState } from "react";
import { CheckCircle, XCircle, Info, Loader2, Undo2 } from "lucide-react";

// =========================
// CONTEXT
// =========================
const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

// =========================
// PROVIDER
// =========================
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const MAX_TOASTS = 3;

  // =========================
  // ADD TOAST
  // =========================
  const addToast = (toast) => {
    const id = Date.now();

    const newToast = {
      id,
      type: toast.type || "info",
      message: toast.message,
      action: toast.action || null,
    };

    setToasts((prev) => {
      const updated = [newToast, ...prev];
      return updated.slice(0, MAX_TOASTS); // limit stacking
    });

    // auto remove
    setTimeout(() => {
      removeToast(id);
    }, 3000);

    // sound feedback (optional)
    if (toast.sound !== false) {
      const audio = new Audio("/toast.mp3"); // optional file
      audio.play().catch(() => {});
    }

    return id;
  };

  // =========================
  // REMOVE
  // =========================
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* =========================
          TOAST CONTAINER
      ========================= */}
      <div className="fixed top-4 right-4 space-y-3 z-50">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// =========================
// TOAST UI
// =========================
function Toast({ toast, onClose }) {
  const icons = {
    success: <CheckCircle className="text-green-500" />,
    error: <XCircle className="text-red-500" />,
    info: <Info className="text-blue-500" />,
    loading: <Loader2 className="animate-spin text-indigo-500" />,
  };

  return (
    <div className="w-72 bg-white dark:bg-gray-900 shadow-lg rounded-xl p-3 flex items-start gap-3 animate-slideIn">

      {/* ICON */}
      <div>{icons[toast.type]}</div>

      {/* MESSAGE */}
      <div className="flex-1">
        <p className="text-sm">{toast.message}</p>

        {/* ACTION (UNDO etc.) */}
        {toast.action && (
          <button
            onClick={() => {
              toast.action.onClick();
              onClose();
            }}
            className="text-xs text-indigo-500 flex items-center gap-1 mt-1"
          >
            <Undo2 size={12} /> {toast.action.label}
          </button>
        )}
      </div>

      {/* CLOSE */}
      <button onClick={onClose} className="text-gray-400">✕</button>

    </div>
  );
}