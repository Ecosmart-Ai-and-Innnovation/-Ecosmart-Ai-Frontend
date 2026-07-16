"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Clock, X } from "lucide-react";

type ToastType = "success" | "error" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: Clock,
};

const bgColors = {
  success: "bg-[#eef6ea] border-[#2f7d32]",
  error: "bg-red-50 border-red-500",
  warning: "bg-[#fff8e1] border-[#f59e0b]",
};

const textColors = {
  success: "text-[#2f7d32]",
  error: "text-red-600",
  warning: "text-[#92400e]",
};

export function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const Icon = icons[type];

  return (
    <div
      className={`fixed top-6 right-6 z-50 max-w-sm w-full transition-all duration-300 ease-in-out ${
        visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      }`}
    >
      <div className={`border-l-4 rounded-2xl shadow-lg px-5 py-4 flex items-start gap-3 ${bgColors[type]} bg-white`}>
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${textColors[type]}`} />
        <p className={`text-sm font-medium flex-1 ${textColors[type]}`}>{message}</p>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="shrink-0 cursor-pointer">
          <X className={`w-4 h-4 ${textColors[type]}`} />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType; key: number } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, key: Date.now() });
  };

  const hideToast = () => setToast(null);

  return { toast, showToast, hideToast };
}
