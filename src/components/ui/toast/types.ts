export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'default';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastData {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  action?: ToastAction;
  duration?: number;
  dismissible?: boolean;
  important?: boolean;
  createdAt: number;
}

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  description?: string;
  action?: ToastAction;
  duration?: number;
  dismissible?: boolean;
  important?: boolean;
}

export interface ToastState {
  toasts: ToastData[];
  height: number;
  position: ToastPosition;
}

export interface ToastContextType {
  toasts: ToastData[];
  addToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
  removeAll: () => void;
  position: ToastPosition;
}
