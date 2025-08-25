'use client';
import React, { forwardRef, useState, useCallback, useRef, useEffect } from 'react';

// TimePicker size variants based on design tokens
export type TimePickerSize = 'xs' | 's' | 'm' | 'l' | 'xl';

// TimePicker variant types
export type TimePickerVariant = 'default' | 'error' | 'success' | 'warning';

// TimePicker format types
export type TimeFormat = '12h' | '24h';

// Time value interface
export interface TimeValue {
  hours: number;
  minutes: number;
  seconds?: number;
}

// Base TimePicker props
export interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'onChange' | 'defaultValue'> {
  /** TimePicker variant for different states */
  variant?: TimePickerVariant;
  /** Size of the time picker */
  size?: TimePickerSize;
  /** Label text */
  label?: string;
  /** Helper text shown below input */
  helperText?: string;
  /** Error message - when provided, variant becomes 'error' */
  error?: string;
  /** Success message - when provided, variant becomes 'success' */
  success?: string;
  /** Warning message - when provided, variant becomes 'warning' */
  warning?: string;
  /** Whether the input takes full width */
  fullWidth?: boolean;
  /** Icon to show at the start of input */
  startIcon?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Custom wrapper class name */
  wrapperClassName?: string;
  /** Whether label is required (shows asterisk) */
  required?: boolean;
  /** Time value */
  value?: TimeValue | null;
  /** Default time value */
  defaultValue?: TimeValue | null;
  /** Change handler */
  onChange?: (time: TimeValue | null) => void;
  /** Time format */
  format?: TimeFormat;
  /** Whether to show seconds */
  showSeconds?: boolean;
  /** Step for minutes (1, 5, 10, 15, 30) */
  minuteStep?: 1 | 5 | 10 | 15 | 30;
  /** Step for seconds (1, 5, 10, 15, 30) */
  secondStep?: 1 | 5 | 10 | 15 | 30;
  /** Custom placeholder text */
  placeholder?: string;
  /** Whether time picker is open by default */
  defaultOpen?: boolean;
  /** Callback when time picker opens/closes */
  onOpenChange?: (open: boolean) => void;
  /** Whether to show now button */
  showNow?: boolean;
  /** Whether to show clear button */
  showClear?: boolean;
  /** Minimum selectable time */
  minTime?: TimeValue;
  /** Maximum selectable time */
  maxTime?: TimeValue;
  /** Disabled time checker */
  isTimeDisabled?: (time: TimeValue) => boolean;
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

// Time formatting utilities
const formatTime = (time: TimeValue | null, format: TimeFormat, showSeconds: boolean = false): string => {
  if (!time) return '';
  
      const { hours, minutes, seconds = 0 } = time;
  
  if (format === '12h') {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const timeString = showSeconds 
      ? `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`
      : `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    return timeString;
  } else {
    const timeString = showSeconds 
      ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return timeString;
  }
};

const parseTime = (timeString: string, format: TimeFormat): TimeValue | null => {
  if (!timeString) return null;
  
  const trimmed = timeString.trim();
  
  if (format === '12h') {
    const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (!match) return null;
    
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = match[3] ? parseInt(match[3], 10) : 0;
    const period = match[4].toUpperCase();
    
    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
      return null;
    }
    
    if (period === 'AM' && hours === 12) {
      hours = 0;
    } else if (period === 'PM' && hours !== 12) {
      hours += 12;
    }
    
    return { hours, minutes, seconds };
  } else {
    const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) return null;
    
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = match[3] ? parseInt(match[3], 10) : 0;
    
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
      return null;
    }
    
    return { hours, minutes, seconds };
  }
};

const getCurrentTime = (): TimeValue => {
  const now = new Date();
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds()
  };
};

const isTimeEqual = (time1: TimeValue | null, time2: TimeValue | null): boolean => {
  if (!time1 || !time2) return false;
  return time1.hours === time2.hours && 
         time1.minutes === time2.minutes && 
         (time1.seconds || 0) === (time2.seconds || 0);
};

// Generate time options
const generateTimeOptions = (
  format: TimeFormat, 
  showSeconds: boolean, 
  minuteStep: number = 1, 
  secondStep: number = 1
): TimeValue[] => {
  const options: TimeValue[] = [];
  
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += minuteStep) {
      if (showSeconds) {
        for (let s = 0; s < 60; s += secondStep) {
          options.push({ hours: h, minutes: m, seconds: s });
        }
      } else {
        options.push({ hours: h, minutes: m, seconds: 0 });
      }
    }
  }
  
  return options;
};

// Generate unique ID for accessibility
let timePickerIdCounter = 0;
const generateTimePickerId = () => `timepicker-${++timePickerIdCounter}`;

/**
 * Professional TimePicker Component with BEM Methodology
 * 
 * Features:
 * - Pure BEM class-based styling (no inline CSS)
 * - Design token integration via CSS custom properties
 * - Full accessibility support with proper ARIA attributes
 * - Multiple variants and states (error, success, warning)
 * - 12h/24h format support
 * - Seconds support (optional)
 * - Customizable minute/second steps
 * - Scrollable time selection
 * - Now and clear buttons
 * - Min/max time constraints
 * - Responsive and mobile-optimized
 * 
 * @example
 * // Basic time picker
 * <TimePicker 
 *   label="Meeting Time" 
 *   placeholder="Select time"
 * />
 * 
 * // 12-hour format with seconds
 * <TimePicker 
 *   label="Appointment Time"
 *   format="12h"
 *   showSeconds
 *   minuteStep={15}
 *   showNow
 *   required
 * />
 */
const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker(
  {
    variant = 'default',
    size = 'm',
    label,
    helperText,
    error,
    success,
    warning,
    fullWidth = false,
    startIcon,
    loading = false,
    wrapperClassName = '',
    required = false,
    disabled = false,
    className = '',
    id,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    format = '24h',
    showSeconds = false,
    minuteStep = 1,
    secondStep = 1,
    placeholder,
    defaultOpen = false,
    onOpenChange,
    showNow = true,
    showClear = true,
    minTime,
    maxTime,
    isTimeDisabled,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref
) {
  // State management
  const [focused, setFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [internalValue, setInternalValue] = useState<TimeValue | null>(defaultValue || null);
  const [inputValue, setInputValue] = useState(() => formatTime(defaultValue || null, format, showSeconds));
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // const hoursRef = useRef<HTMLDivElement>(null);
  // const minutesRef = useRef<HTMLDivElement>(null);
  // const secondsRef = useRef<HTMLDivElement>(null);
  
  // Use controlled or uncontrolled value
  const currentValue = value !== undefined ? value : internalValue;
  
  // Generate unique IDs for accessibility
  const inputId = id || generateTimePickerId();
  const labelId = `${inputId}-label`;
  const helperTextId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const successId = `${inputId}-success`;
  const warningId = `${inputId}-warning`;
  const dropdownId = `${inputId}-dropdown`;
  
  // Determine actual variant based on props
  const actualVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant;
  
  // Update input value when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(formatTime(value, format, showSeconds));
    }
  }, [value, format, showSeconds]);
  
  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
        inputRef.current?.focus();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);
  
  // Handle dropdown open/close
  const handleOpen = useCallback(() => {
    if (disabled || loading) return;
    setIsOpen(true);
    onOpenChange?.(true);
  }, [disabled, loading, onOpenChange]);
  
  const handleClose = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);
  
  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [isOpen, handleOpen, handleClose]);
  
  // Handle focus events
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  }, [onFocus]);
  
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  }, [onBlur]);
  
  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Try to parse the time
    const parsedTime = parseTime(newValue, format);
    if (parsedTime) {
      if (value === undefined) {
        setInternalValue(parsedTime);
      }
      onChange?.(parsedTime);
    } else if (newValue === '') {
      if (value === undefined) {
        setInternalValue(null);
      }
      onChange?.(null);
    }
  }, [format, onChange, value]);
  
  // Handle time selection
  const handleTimeSelect = useCallback((time: TimeValue) => {
    setInputValue(formatTime(time, format, showSeconds));
    
    if (value === undefined) {
      setInternalValue(time);
    }
    onChange?.(time);
    handleClose();
    inputRef.current?.focus();
  }, [format, showSeconds, onChange, value, handleClose]);
  
  // Handle now button
  const handleNow = useCallback(() => {
    const now = getCurrentTime();
    handleTimeSelect(now);
  }, [handleTimeSelect]);
  
  // Handle clear button
  const handleClear = useCallback(() => {
    setInputValue('');
    if (value === undefined) {
      setInternalValue(null);
    }
    onChange?.(null);
    handleClose();
    inputRef.current?.focus();
  }, [onChange, value, handleClose]);
  
  // Check if time is disabled
  const isTimeDisabledInternal = useCallback((time: TimeValue): boolean => {
    if (minTime && (time.hours < minTime.hours || 
        (time.hours === minTime.hours && time.minutes < minTime.minutes) ||
        (time.hours === minTime.hours && time.minutes === minTime.minutes && (time.seconds || 0) < (minTime.seconds || 0)))) {
      return true;
    }
    if (maxTime && (time.hours > maxTime.hours || 
        (time.hours === maxTime.hours && time.minutes > maxTime.minutes) ||
        (time.hours === maxTime.hours && time.minutes === maxTime.minutes && (time.seconds || 0) > (maxTime.seconds || 0)))) {
      return true;
    }
    if (isTimeDisabled) return isTimeDisabled(time);
    return false;
  }, [minTime, maxTime, isTimeDisabled]);
  
  // Generate time options
  const timeOptions = generateTimeOptions(format, showSeconds, minuteStep, secondStep);
  
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
    createBemClass('timepicker-wrapper', undefined, [
      actualVariant,
      size,
      fullWidth && 'full-width',
      disabled && 'disabled',
      focused && 'focused',
      loading && 'loading',
      isOpen && 'open'
    ]),
    wrapperClassName
  ].filter(Boolean).join(' ');
  
  const inputClasses = [
    createBemClass('timepicker-input', undefined, [
      actualVariant,
      size,
      fullWidth && 'full-width',
      disabled && 'disabled',
      focused && 'focused',
      loading && 'loading'
    ]),
    className
  ].filter(Boolean).join(' ');
  
  const fieldClasses = createBemClass('timepicker-field', undefined, [
    actualVariant,
    size,
    disabled && 'disabled',
    focused && 'focused',
    loading && 'loading'
  ]);
  
  return (
    <div ref={wrapperRef} className={wrapperClasses}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          id={labelId}
          className={createBemClass('timepicker-label', undefined, [
            actualVariant,
            size,
            disabled && 'disabled',
            required && 'required'
          ])}
        >
          {label}
          {required && (
            <span className="timepicker-label__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      
      {/* Input Field Container */}
      <div className={fieldClasses}>
        {/* Start Icon */}
        {startIcon && (
          <span className="timepicker-field__start-icon" aria-hidden="true">
            {startIcon}
          </span>
        )}
        
        {/* Input Element */}
        <input
          ref={(node) => {
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            inputRef.current = node;
          }}
          id={inputId}
          type="text"
          className={inputClasses}
          disabled={disabled || loading}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || `Enter time (${format === '12h' ? 'HH:MM AM/PM' : 'HH:MM'})`}
          aria-invalid={actualVariant === 'error' ? 'true' : undefined}
          aria-describedby={describedByIds || undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
          {...props}
        />
        
        {/* Clock Toggle Button */}
        <button
          type="button"
          className="timepicker-field__clock-button"
          onClick={handleToggle}
          disabled={disabled || loading}
          aria-label="Open time picker"
          tabIndex={-1}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14ZM8.5 4H7V9L11.2 11.5L12 10.2L8.5 8.2V4Z" fill="currentColor"/>
          </svg>
        </button>
        
        {/* Loading Spinner */}
        {loading && (
          <span className="timepicker-field__spinner" aria-hidden="true">
            <span className="timepicker-field__spinner-icon"></span>
          </span>
        )}
      </div>
      
      {/* Time Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          id={dropdownId}
          className="timepicker-dropdown"
          role="listbox"
          aria-label="Select time"
        >
          {/* Time List */}
          <div className="timepicker-dropdown__list">
            {timeOptions.map((time) => {
              const isSelected = isTimeEqual(time, currentValue);
              const isDisabled = isTimeDisabledInternal(time);
              const timeString = formatTime(time, format, showSeconds);
              
              return (
                <button
                  key={`${time.hours}-${time.minutes}-${time.seconds || 0}`}
                  type="button"
                  className={createBemClass('timepicker-dropdown__option', undefined, [
                    isSelected && 'selected',
                    isDisabled && 'disabled'
                  ])}
                  onClick={() => !isDisabled && handleTimeSelect(time)}
                  disabled={isDisabled}
                  role="option"
                  aria-selected={isSelected}
                >
                  {timeString}
                </button>
              );
            })}
          </div>
          
          {/* Dropdown Footer */}
          {(showNow || showClear) && (
            <div className="timepicker-dropdown__footer">
              {showNow && (
                <button
                  type="button"
                  className="timepicker-dropdown__action-button timepicker-dropdown__action-button--now"
                  onClick={handleNow}
                >
                  Now
                </button>
              )}
              {showClear && (
                <button
                  type="button"
                  className="timepicker-dropdown__action-button timepicker-dropdown__action-button--clear"
                  onClick={handleClear}
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Helper Text / Messages */}
      <div className="timepicker-messages">
        {/* Error Message */}
        {error && (
          <span 
            id={errorId}
            className={createBemClass('timepicker-message', undefined, ['error'])}
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
            className={createBemClass('timepicker-message', undefined, ['success'])}
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
            className={createBemClass('timepicker-message', undefined, ['warning'])}
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
            className={createBemClass('timepicker-message', undefined, ['helper'])}
          >
            {helperText}
          </span>
        )}
      </div>
    </div>
  );
});

TimePicker.displayName = 'TimePicker';

export { TimePicker };
export default TimePicker;
