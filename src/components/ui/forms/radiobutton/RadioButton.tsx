'use client';
import React, { forwardRef, useState, useCallback } from 'react';

// RadioButton size variants based on design tokens
export type RadioButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl';

// RadioButton variant types
export type RadioButtonVariant = 'default' | 'error' | 'success' | 'warning';

// Base radio button props
export interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** RadioButton variant for different states */
  variant?: RadioButtonVariant;
  /** Size of the radio button */
  size?: RadioButtonSize;
  /** Label text */
  label?: string;
  /** Helper text shown below radio button */
  helperText?: string;
  /** Error message - when provided, variant becomes 'error' */
  error?: string;
  /** Success message - when provided, variant becomes 'success' */
  success?: string;
  /** Warning message - when provided, variant becomes 'warning' */
  warning?: string;
  /** Loading state */
  loading?: boolean;
  /** Custom wrapper class name */
  wrapperClassName?: string;
  /** Whether label is required (shows asterisk) */
  required?: boolean;
  /** Custom icon for checked state */
  checkedIcon?: React.ReactNode;
}

// Radio Group context for managing radio button groups
export interface RadioGroupContextValue {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  variant?: RadioButtonVariant;
  size?: RadioButtonSize;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined);

// Radio Group component
export interface RadioGroupProps {
  /** Group name for radio buttons */
  name: string;
  /** Currently selected value */
  value?: string;
  /** Default selected value */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Whether the entire group is disabled */
  disabled?: boolean;
  /** Variant for all radio buttons in group */
  variant?: RadioButtonVariant;
  /** Size for all radio buttons in group */
  size?: RadioButtonSize;
  /** Children radio buttons */
  children: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Group label */
  label?: string;
  /** Group helper text */
  helperText?: string;
  /** Group error message */
  error?: string;
  /** Group success message */
  success?: string;
  /** Group warning message */
  warning?: string;
  /** Whether group is required */
  required?: boolean;
}

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

// Generate unique ID for accessibility
let radioIdCounter = 0;
const generateRadioId = () => `radio-${++radioIdCounter}`;

// Default radio dot icon (SVG)
const DefaultRadioDot = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="radio-icon__dot"
  >
    <circle
      cx="6"
      cy="6"
      r="3"
      fill="currentColor"
    />
  </svg>
);

/**
 * Professional RadioButton Component with BEM Methodology
 * 
 * Features:
 * - Pure BEM class-based styling (no inline CSS)
 * - Design token integration via CSS custom properties
 * - Full accessibility support with proper ARIA attributes
 * - Multiple variants and states (error, success, warning)
 * - Radio group management with context
 * - Custom icons support
 * - Loading states
 * - Responsive and mobile-optimized
 * - Label and helper text support
 * - Keyboard navigation support
 * 
 * @example
 * // Basic radio button
 * <RadioButton 
 *   name="option"
 *   value="option1"
 *   label="Option 1" 
 * />
 * 
 * // Radio group
 * <RadioGroup name="choice" value={selected} onChange={setSelected}>
 *   <RadioButton value="option1" label="Option 1" />
 *   <RadioButton value="option2" label="Option 2" />
 *   <RadioButton value="option3" label="Option 3" />
 * </RadioGroup>
 */
const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(function RadioButton(
  {
    variant = 'default',
    size = 'm',
    label,
    helperText,
    error,
    success,
    warning,
    loading = false,
    wrapperClassName = '',
    required = false,
    disabled = false,
    checkedIcon,
    className = '',
    id,
    name,
    value,
    checked,
    defaultChecked,
    onChange,
    onFocus,
    onBlur,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref
) {
  // Get context values from RadioGroup if available
  const groupContext = React.useContext(RadioGroupContext);
  
  // State management
  const [focused, setFocused] = useState(false);
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
  
  // Use group context values or component props
  const actualName = name || groupContext?.name;
  const actualVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : (groupContext?.variant || variant);
  const actualSize = groupContext?.size || size;
  const actualDisabled = disabled || groupContext?.disabled || false;
  
  // Determine if this radio is checked
  const isChecked = groupContext 
    ? groupContext.value === value
    : (checked !== undefined ? checked : internalChecked);
  
  // Generate unique IDs for accessibility
  const radioId = id || generateRadioId();
  const labelId = `${radioId}-label`;
  const helperTextId = `${radioId}-helper`;
  const errorId = `${radioId}-error`;
  const successId = `${radioId}-success`;
  const warningId = `${radioId}-warning`;
  
  // Handle focus events
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  }, [onFocus]);
  
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  }, [onBlur]);
  
  // Handle change events
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (groupContext?.onChange && value !== undefined) {
      groupContext.onChange(value);
    } else if (checked === undefined) {
      setInternalChecked(e.target.checked);
    }
    onChange?.(e);
  }, [onChange, checked, groupContext, value]);
  
  // Build aria-describedby
  const describedByIds = [
    ariaDescribedBy,
    helperText && helperTextId,
    error && errorId,
    success && successId,
    warning && warningId
  ].filter(Boolean).join(' ');
  
  // Generate BEM classes
  const wrapperClasses = [
    createBemClass('radio-wrapper', undefined, [
      actualVariant,
      actualSize,
      actualDisabled && 'disabled',
      focused && 'focused',
      loading && 'loading',
      isChecked && 'checked'
    ]),
    wrapperClassName
  ].filter(Boolean).join(' ');
  
  const radioClasses = [
    createBemClass('radio', undefined, [
      actualVariant,
      actualSize,
      actualDisabled && 'disabled',
      focused && 'focused',
      loading && 'loading',
      isChecked && 'checked'
    ]),
    className
  ].filter(Boolean).join(' ');
  
  const controlClasses = createBemClass('radio-control', undefined, [
    actualVariant,
    actualSize,
    actualDisabled && 'disabled',
    focused && 'focused',
    loading && 'loading',
    isChecked && 'checked'
  ]);
  
  return (
    <div className={wrapperClasses}>
      {/* Radio Control */}
      <div className="radio-field">
        <div className={controlClasses}>
          {/* Hidden Input */}
          <input
            ref={ref}
            id={radioId}
            type="radio"
            name={actualName}
            value={value}
            className={radioClasses}
            disabled={actualDisabled || loading}
            checked={isChecked}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={actualVariant === 'error' ? 'true' : undefined}
            aria-describedby={describedByIds || undefined}
            aria-labelledby={label ? labelId : undefined}
            {...props}
          />
          
          {/* Visual Radio */}
          <div className="radio-control__circle">
            {/* Loading Spinner */}
            {loading && (
              <span className="radio-control__spinner" aria-hidden="true">
                <span className="radio-control__spinner-icon"></span>
              </span>
            )}
            
            {/* Radio Dot */}
            {!loading && isChecked && (
              <span className="radio-control__dot" aria-hidden="true">
                {checkedIcon || <DefaultRadioDot />}
              </span>
            )}
          </div>
        </div>
        
        {/* Label */}
        {label && (
          <label 
            htmlFor={radioId}
            id={labelId}
            className={createBemClass('radio-label', undefined, [
              actualVariant,
              actualSize,
              actualDisabled && 'disabled',
              required && 'required'
            ])}
          >
            {label}
            {required && (
              <span className="radio-label__required" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
      </div>
      
      {/* Helper Text / Messages */}
      <div className="radio-messages">
        {/* Error Message */}
        {error && (
          <span 
            id={errorId}
            className={createBemClass('radio-message', undefined, ['error'])}
            role="alert"
            aria-live="polite"
          >
            {error}
          </span>
        )}
        
        {/* Success Message */}
        {success && !error && (
          <span 
            id={successId}
            className={createBemClass('radio-message', undefined, ['success'])}
            role="status"
            aria-live="polite"
          >
            {success}
          </span>
        )}
        
        {/* Warning Message */}
        {warning && !error && !success && (
          <span 
            id={warningId}
            className={createBemClass('radio-message', undefined, ['warning'])}
            role="alert"
            aria-live="polite"
          >
            {warning}
          </span>
        )}
        
        {/* Helper Text */}
        {helperText && !error && !success && !warning && (
          <span 
            id={helperTextId}
            className={createBemClass('radio-message', undefined, ['helper'])}
          >
            {helperText}
          </span>
        )}
      </div>
    </div>
  );
});

/**
 * RadioGroup Component for managing radio button groups
 */
const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  defaultValue,
  onChange,
  disabled = false,
  variant = 'default',
  size = 'm',
  children,
  className = '',
  label,
  helperText,
  error,
  success,
  warning,
  required = false
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  
  // Use controlled or uncontrolled value
  const currentValue = value !== undefined ? value : internalValue;
  
  // Handle change
  const handleChange = useCallback((newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [onChange, value]);
  
  // Determine actual variant based on props
  const actualVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant;
  
  // Generate unique IDs for accessibility
  const groupId = `radio-group-${name}`;
  const labelId = `${groupId}-label`;
  const helperTextId = `${groupId}-helper`;
  const errorId = `${groupId}-error`;
  const successId = `${groupId}-success`;
  const warningId = `${groupId}-warning`;
  
  // Build aria-describedby
  const describedByIds = [
    helperText && helperTextId,
    error && errorId,
    success && successId,
    warning && warningId
  ].filter(Boolean).join(' ');
  
  // Context value
  const contextValue: RadioGroupContextValue = {
    name,
    value: currentValue,
    onChange: handleChange,
    disabled,
    variant: actualVariant,
    size
  };
  
  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div 
        className={[
          createBemClass('radio-group', undefined, [
            actualVariant,
            size,
            disabled && 'disabled'
          ]),
          className
        ].filter(Boolean).join(' ')}
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={describedByIds || undefined}
        aria-required={required}
        aria-invalid={actualVariant === 'error' ? 'true' : undefined}
      >
        {/* Group Label */}
        {label && (
          <div 
            id={labelId}
            className={createBemClass('radio-group-label', undefined, [
              actualVariant,
              size,
              disabled && 'disabled',
              required && 'required'
            ])}
          >
            {label}
            {required && (
              <span className="radio-group-label__required" aria-label="required">
                *
              </span>
            )}
          </div>
        )}
        
        {/* Radio Buttons */}
        <div className="radio-group__items">
          {children}
        </div>
        
        {/* Group Messages */}
        <div className="radio-group__messages">
          {/* Error Message */}
          {error && (
            <span 
              id={errorId}
              className={createBemClass('radio-group-message', undefined, ['error'])}
              role="alert"
              aria-live="polite"
            >
              {error}
            </span>
          )}
          
          {/* Success Message */}
          {success && !error && (
            <span 
              id={successId}
              className={createBemClass('radio-group-message', undefined, ['success'])}
              role="status"
              aria-live="polite"
            >
              {success}
            </span>
          )}
          
          {/* Warning Message */}
          {warning && !error && !success && (
            <span 
              id={warningId}
              className={createBemClass('radio-group-message', undefined, ['warning'])}
              role="alert"
              aria-live="polite"
            >
              {warning}
            </span>
          )}
          
          {/* Helper Text */}
          {helperText && !error && !success && !warning && (
            <span 
              id={helperTextId}
              className={createBemClass('radio-group-message', undefined, ['helper'])}
            >
              {helperText}
            </span>
          )}
        </div>
      </div>
    </RadioGroupContext.Provider>
  );
};

RadioButton.displayName = 'RadioButton';
RadioGroup.displayName = 'RadioGroup';

export { RadioButton, RadioGroup };
export default RadioButton;
