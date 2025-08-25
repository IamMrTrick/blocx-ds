'use client';
import React, { forwardRef, useState, useCallback, useRef } from 'react';

// Form size variants
export type FormSize = 'xs' | 's' | 'm' | 'l' | 'xl';

// Form variant types
export type FormVariant = 'default' | 'card' | 'inline';

// Validation rule types
export interface ValidationRule {
  required?: boolean | string;
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  validate?: (value: unknown) => boolean | string;
  custom?: (value: unknown, formData: Record<string, unknown>) => boolean | string;
}

// Field error type
export interface FieldError {
  type: string;
  message: string;
}

// Form state type
export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, FieldError>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Form context type
export interface FormContextValue {
  state: FormState;
  register: (name: string, rules?: ValidationRule) => {
    name: string;
    value: unknown;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    error?: string;
  };
  setValue: (name: string, value: unknown) => void;
  setError: (name: string, error: FieldError) => void;
  clearError: (name: string) => void;
  validate: (name?: string) => boolean;
  reset: (values?: Record<string, unknown>) => void;
  getValues: () => Record<string, unknown>;
  watch: (name?: string) => unknown;
}

// Form props
export interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onError' | 'onChange'> {
  /** Form variant */
  variant?: FormVariant;
  /** Form size */
  size?: FormSize;
  /** Default form values */
  defaultValues?: Record<string, unknown>;
  /** Form validation rules */
  validationRules?: Record<string, ValidationRule>;
  /** Submit handler */
  onSubmit?: (data: Record<string, unknown>, formState: FormState) => void | Promise<void>;
  /** Error handler */
  onError?: (errors: Record<string, FieldError>) => void;
  /** Change handler */
  onChange?: (values: Record<string, unknown>) => void;
  /** Whether to validate on change */
  validateOnChange?: boolean;
  /** Whether to validate on blur */
  validateOnBlur?: boolean;
  /** Whether to show validation errors immediately */
  showErrorsImmediately?: boolean;
  /** Custom wrapper class name */
  wrapperClassName?: string;
  /** Whether form is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Footer content */
  footer?: React.ReactNode;
  /** Whether to prevent default form submission */
  preventDefault?: boolean;
}

// Form context
const FormContext = React.createContext<FormContextValue | undefined>(undefined);

// Custom hook to use form context
export const useForm = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a Form component');
  }
  return context;
};

// Helper function to generate BEM classes
const createBemClass = (
  block: string,
  element?: string,
  modifiers?: (string | boolean | undefined)[]
): string => {
  let className = block;
  
  if (element) {
    className += `__${element}`;
  }
  
  if (modifiers && modifiers.length > 0) {
    const validModifiers = modifiers
      .filter(Boolean)
      .map(mod => typeof mod === 'string' ? mod : '')
      .filter(Boolean);
    
    if (validModifiers.length > 0) {
      const baseClass = element ? `${block}__${element}` : block;
      className += ` ${validModifiers.map(mod => `${baseClass}--${mod}`).join(' ')}`;
    }
  }
  
  return className;
};

// Validation helper functions
const validateField = (value: unknown, rules: ValidationRule): FieldError | null => {
  // Required validation
  if (rules.required) {
    const isEmpty = value === undefined || value === null || value === '' || 
                   (Array.isArray(value) && value.length === 0);
    if (isEmpty) {
      const message = typeof rules.required === 'string' ? rules.required : 'This field is required';
      return { type: 'required', message };
    }
  }
  
  // Skip other validations if value is empty and not required
  if (value === undefined || value === null || value === '') {
    return null;
  }
  
  // String length validations
  if (typeof value === 'string') {
    if (rules.minLength) {
      const minLength = typeof rules.minLength === 'number' ? rules.minLength : rules.minLength.value;
      const message = typeof rules.minLength === 'object' ? rules.minLength.message : 
                     `Minimum length is ${minLength} characters`;
      if (value.length < minLength) {
        return { type: 'minLength', message };
      }
    }
    
    if (rules.maxLength) {
      const maxLength = typeof rules.maxLength === 'number' ? rules.maxLength : rules.maxLength.value;
      const message = typeof rules.maxLength === 'object' ? rules.maxLength.message : 
                     `Maximum length is ${maxLength} characters`;
      if (value.length > maxLength) {
        return { type: 'maxLength', message };
      }
    }
  }
  
  // Number validations
  if (typeof value === 'number') {
    if (rules.min !== undefined) {
      const min = typeof rules.min === 'number' ? rules.min : rules.min.value;
      const message = typeof rules.min === 'object' ? rules.min.message : 
                     `Minimum value is ${min}`;
      if (value < min) {
        return { type: 'min', message };
      }
    }
    
    if (rules.max !== undefined) {
      const max = typeof rules.max === 'number' ? rules.max : rules.max.value;
      const message = typeof rules.max === 'object' ? rules.max.message : 
                     `Maximum value is ${max}`;
      if (value > max) {
        return { type: 'max', message };
      }
    }
  }
  
  // Pattern validation
  if (rules.pattern) {
    const pattern = rules.pattern instanceof RegExp ? rules.pattern : rules.pattern.value;
    const message = rules.pattern instanceof RegExp ? 'Invalid format' : rules.pattern.message;
    if (!pattern.test(String(value))) {
      return { type: 'pattern', message };
    }
  }
  
  // Custom validation function
  if (rules.validate) {
    const result = rules.validate(value);
    if (result !== true) {
      const message = typeof result === 'string' ? result : 'Invalid value';
      return { type: 'validate', message };
    }
  }
  
  return null;
};

/**
 * Professional Form Component with BEM Methodology
 * 
 * Features:
 * - Pure BEM class-based styling (no inline CSS)
 * - Design token integration via CSS custom properties
 * - Full accessibility support with proper ARIA attributes
 * - Comprehensive validation system
 * - Form state management
 * - Context-based field registration
 * - Multiple form variants (default, card, inline)
 * - Loading and disabled states
 * - Responsive and mobile-optimized
 * - TypeScript support
 * 
 * @example
 * // Basic form with validation
 * <Form 
 *   onSubmit={(data) => console.log(data)}
 *   validationRules={{
 *     email: { required: true, pattern: /\S+@\S+\.\S+/ },
 *     password: { required: true, minLength: 8 }
 *   }}
 * >
 *   <Input {...register('email')} label="Email" type="email" />
 *   <Input {...register('password')} label="Password" type="password" />
 *   <Button type="submit">Submit</Button>
 * </Form>
 * 
 * // Card variant with title and description
 * <Form 
 *   variant="card"
 *   title="Sign In"
 *   description="Enter your credentials to access your account"
 *   onSubmit={handleLogin}
 * >
 *   {form content}
 * </Form>
 */
const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  {
    variant = 'default',
    size = 'm',
    defaultValues = {},
    validationRules = {},
    onSubmit,
    onError,
    onChange,
    validateOnChange = true,
    validateOnBlur = true,
    showErrorsImmediately = false,
    wrapperClassName = '',
    disabled = false,
    loading = false,
    title,
    description,
    footer,
    preventDefault = true,
    className = '',
    children,
    ...props
  },
  ref
) {
  // Form state
  const [state, setState] = useState<FormState>({
    values: { ...defaultValues },
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false
  });
  
  // Registered fields
  const fieldsRef = useRef<Record<string, ValidationRule>>({});
  
  // Update form validity
  const updateValidity = useCallback((errors: Record<string, FieldError>) => {
    const isValid = Object.keys(errors).length === 0;
    setState(prev => ({ ...prev, errors, isValid }));
  }, []);
  
  // Validate single field
  const validateSingleField = useCallback((name: string, value: unknown): FieldError | null => {
    const rules = fieldsRef.current[name] || validationRules[name];
    if (!rules) return null;
    
    const error = validateField(value, rules);
    
    // Custom validation with access to all form data
    if (!error && rules.custom) {
      const result = rules.custom(value, state.values);
      if (result !== true) {
        const message = typeof result === 'string' ? result : 'Invalid value';
        return { type: 'custom', message };
      }
    }
    
    return error;
  }, [validationRules, state.values]);
  
  // Validate form or single field
  const validate = useCallback((fieldName?: string): boolean => {
    if (fieldName) {
      // Validate single field
      const value = state.values[fieldName];
      const error = validateSingleField(fieldName, value);
      
      const newErrors = { ...state.errors };
      if (error) {
        newErrors[fieldName] = error;
      } else {
        delete newErrors[fieldName];
      }
      
      updateValidity(newErrors);
      return !error;
    } else {
      // Validate all fields
      const newErrors: Record<string, FieldError> = {};
      
      // Validate registered fields
      Object.keys(fieldsRef.current).forEach(name => {
        const value = state.values[name];
        const error = validateSingleField(name, value);
        if (error) {
          newErrors[name] = error;
        }
      });
      
      // Validate fields with rules but not registered
      Object.keys(validationRules).forEach(name => {
        if (!fieldsRef.current[name]) {
          const value = state.values[name];
          const error = validateSingleField(name, value);
          if (error) {
            newErrors[name] = error;
          }
        }
      });
      
      updateValidity(newErrors);
      return Object.keys(newErrors).length === 0;
    }
  }, [state.values, state.errors, validateSingleField, updateValidity]);
  
  // Register field
  const register = useCallback((name: string, rules?: ValidationRule) => {
    // Store field rules
    if (rules) {
      fieldsRef.current[name] = rules;
    }
    
    return {
      name,
      value: state.values[name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        
        setState(prev => {
          const newValues = { ...prev.values, [name]: value };
          const newState = { 
            ...prev, 
            values: newValues,
            isDirty: true
          };
          
          // Validate on change if enabled
          if (validateOnChange && (showErrorsImmediately || prev.touched[name])) {
            const error = validateSingleField(name, value);
            if (error) {
              newState.errors = { ...prev.errors, [name]: error };
            } else {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { [name]: _, ...restErrors } = prev.errors;
              newState.errors = restErrors;
            }
          }
          
          return newState;
        });
        
        onChange?.(state.values);
      },
      onBlur: () => {
        setState(prev => ({
          ...prev,
          touched: { ...prev.touched, [name]: true }
        }));
        
        // Validate on blur if enabled
        if (validateOnBlur) {
          setTimeout(() => validate(name), 0);
        }
      },
      error: state.errors[name]?.message
    };
  }, [state.values, state.errors, state.touched, validateOnChange, validateOnBlur, showErrorsImmediately, validateSingleField, validate, onChange]);
  
  // Set field value
  const setValue = useCallback((name: string, value: unknown) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      isDirty: true
    }));
  }, []);
  
  // Set field error
  const setError = useCallback((name: string, error: FieldError) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [name]: error }
    }));
  }, []);
  
  // Clear field error
  const clearError = useCallback((name: string) => {
    setState(prev => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [name]: _, ...restErrors } = prev.errors;
      return { ...prev, errors: restErrors };
    });
  }, []);
  
  // Reset form
  const reset = useCallback((values?: Record<string, unknown>) => {
    setState({
      values: values || defaultValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
      isDirty: false
    });
  }, [defaultValues]);
  
  // Get form values
  const getValues = useCallback(() => state.values, [state.values]);
  
  // Watch field value
  const watch = useCallback((name?: string) => {
    return name ? state.values[name] : state.values;
  }, [state.values]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    if (preventDefault) {
      e.preventDefault();
    }
    
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    // Validate all fields
    const isValid = validate();
    
    if (isValid) {
      try {
        await onSubmit?.(state.values, state);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    } else {
      onError?.(state.errors);
    }
    
    setState(prev => ({ ...prev, isSubmitting: false }));
  }, [preventDefault, validate, onSubmit, onError, state]);
  
  // Context value
  const contextValue: FormContextValue = {
    state,
    register,
    setValue,
    setError,
    clearError,
    validate,
    reset,
    getValues,
    watch
  };
  
  // Generate BEM classes
  const wrapperClasses = [
    createBemClass('form-wrapper', undefined, [
      variant,
      size,
      disabled && 'disabled',
      loading && 'loading',
      state.isSubmitting && 'submitting'
    ]),
    wrapperClassName
  ].filter(Boolean).join(' ');
  
  const formClasses = [
    createBemClass('form', undefined, [
      variant,
      size,
      disabled && 'disabled',
      loading && 'loading',
      state.isSubmitting && 'submitting'
    ]),
    className
  ].filter(Boolean).join(' ');
  
  return (
    <FormContext.Provider value={contextValue}>
      <div className={wrapperClasses}>
        {/* Form Header */}
        {(title || description) && (
          <div className="form-header">
            {title && (
              <h2 className="form-header__title">
                {title}
              </h2>
            )}
            {description && (
              <p className="form-header__description">
                {description}
              </p>
            )}
          </div>
        )}
        
        {/* Form Element */}
        <form
          ref={ref}
          className={formClasses}
          onSubmit={handleSubmit}
          noValidate
          {...props}
        >
          {/* Form Content */}
          <div className="form-content">
            {children}
          </div>
          
          {/* Loading Overlay */}
          {(loading || state.isSubmitting) && (
            <div className="form-overlay" aria-hidden="true">
              <div className="form-overlay__spinner">
                <span className="form-overlay__spinner-icon"></span>
              </div>
            </div>
          )}
        </form>
        
        {/* Form Footer */}
        {footer && (
          <div className="form-footer">
            {footer}
          </div>
        )}
      </div>
    </FormContext.Provider>
  );
});

Form.displayName = 'Form';

export { Form };
export default Form;
