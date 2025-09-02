import { ToastOptions } from './types';

// Global toast state
let toastFunction: ((options: ToastOptions) => string) | null = null;
let removeToastFunction: ((id: string) => void) | null = null;
let removeAllFunction: (() => void) | null = null;

// Internal function to set the toast functions (called by ToastProvider)
export function setToastFunctions(
  addToast: (options: ToastOptions) => string,
  removeToast: (id: string) => void,
  removeAll: () => void
) {
  toastFunction = addToast;
  removeToastFunction = removeToast;
  removeAllFunction = removeAll;
}

// Main toast function
function createToast(options: ToastOptions): string {
  if (!toastFunction) {
    console.warn('Toast provider not found. Make sure to wrap your app with ToastProvider.');
    return '';
  }

  return toastFunction(options);
}

// Toast API
export const toast = Object.assign(createToast, {
  success: (title: string, description?: string, options?: Omit<ToastOptions, 'type' | 'title' | 'description'>) =>
    createToast({ ...options, type: 'success', title, description }),
    
  error: (title: string, description?: string, options?: Omit<ToastOptions, 'type' | 'title' | 'description'>) =>
    createToast({ ...options, type: 'error', title, description }),
    
  warning: (title: string, description?: string, options?: Omit<ToastOptions, 'type' | 'title' | 'description'>) =>
    createToast({ ...options, type: 'warning', title, description }),
    
  info: (title: string, description?: string, options?: Omit<ToastOptions, 'type' | 'title' | 'description'>) =>
    createToast({ ...options, type: 'info', title, description }),
    
  loading: (title: string, description?: string, options?: Omit<ToastOptions, 'type' | 'title' | 'description'>) =>
    createToast({ ...options, type: 'loading', title, description, duration: 0 }),
    
  dismiss: (id?: string) => {
    if (!removeToastFunction) {
      console.warn('Toast provider not found.');
      return;
    }
    if (id) {
      removeToastFunction(id);
    } else if (removeAllFunction) {
      removeAllFunction();
    }
  },
  
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ): Promise<T> => {
    const id = createToast({
      type: 'loading',
      title: options.loading,
      duration: 0
    });

    return promise
      .then((data) => {
        const successMessage = typeof options.success === 'function' 
          ? options.success(data) 
          : options.success;
        
        if (removeToastFunction) {
          removeToastFunction(id);
        }
        
        createToast({
          type: 'success',
          title: successMessage
        });
        
        return data;
      })
      .catch((error) => {
        const errorMessage = typeof options.error === 'function' 
          ? options.error(error) 
          : options.error;
        
        if (removeToastFunction) {
          removeToastFunction(id);
        }
        
        createToast({
          type: 'error',
          title: errorMessage
        });
        
        throw error;
      });
  },

  // Enhanced action-based toast creators
  withAction: (title: string, description?: string, action?: import('./types').ToastAction, options?: Omit<ToastOptions, 'title' | 'description' | 'action'>) =>
    createToast({ ...options, title, description, action }),

  withActions: (title: string, description?: string, actions?: import('./types').ToastActions, options?: Omit<ToastOptions, 'title' | 'description' | 'actions'>) =>
    createToast({ ...options, title, description, actions }),

  // Preset action toasts
  undo: (title: string, description: string, undoCallback: () => void, options?: Omit<ToastOptions, 'title' | 'description' | 'actions'>) => {
    const toastId = createToast({
      ...options,
      type: 'success',
      title,
      description,
      duration: 5000, // 5 seconds to undo
      actions: {
        primary: {
          label: 'Undo',
          onClick: () => {
            undoCallback();
            if (removeToastFunction) {
              removeToastFunction(toastId);
            }
          },
          variant: 'ghost',
          size: 's'
        }
      }
    });
    return toastId;
  },

  confirm: (title: string, description: string, confirmCallback: () => void, cancelCallback?: () => void, options?: Omit<ToastOptions, 'title' | 'description' | 'actions'>) => {
    const toastId = createToast({
      ...options,
      type: 'warning',
      title,
      description,
      duration: 0, // Don't auto-dismiss confirmation toasts
      actions: {
        primary: {
          label: 'Confirm',
          onClick: () => {
            confirmCallback();
            if (removeToastFunction) {
              removeToastFunction(toastId);
            }
          },
          variant: 'primary',
          size: 's'
        },
        secondary: {
          label: 'Cancel',
          onClick: () => {
            if (cancelCallback) cancelCallback();
            if (removeToastFunction) {
              removeToastFunction(toastId);
            }
          },
          variant: 'ghost',
          size: 's'
        }
      }
    });
    return toastId;
  }
});

export default toast;
