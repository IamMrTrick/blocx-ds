export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'default';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-warning' | 'outline-error';
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
}

export interface ToastActions {
  primary?: ToastAction;
  secondary?: ToastAction;
}

export interface ToastData {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  action?: ToastAction; // Legacy support
  actions?: ToastActions; // New multiple actions support
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
  action?: ToastAction; // Legacy support
  actions?: ToastActions; // New multiple actions support
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
  setPosition: (position: ToastPosition) => void;
}
