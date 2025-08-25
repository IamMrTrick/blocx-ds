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
  }
});

export default toast;
