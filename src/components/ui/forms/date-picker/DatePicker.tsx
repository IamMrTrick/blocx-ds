'use client';
import React, { forwardRef, useState, useCallback, useRef, useEffect } from 'react';

// DatePicker size variants based on design tokens
export type DatePickerSize = 'xs' | 's' | 'm' | 'l' | 'xl';

// DatePicker variant types
export type DatePickerVariant = 'default' | 'error' | 'success' | 'warning';

// DatePicker format types
export type DateFormat = 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd' | 'dd-mm-yyyy';

// DatePicker view types
export type DatePickerView = 'day' | 'month' | 'year';

// Base DatePicker props
export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'onChange' | 'defaultValue'> {
  /** DatePicker variant for different states */
  variant?: DatePickerVariant;
  /** Size of the date picker */
  size?: DatePickerSize;
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
  /** Date value */
  value?: Date | null;
  /** Default date value */
  defaultValue?: Date | null;
  /** Change handler */
  onChange?: (date: Date | null) => void;
  /** Date format */
  format?: DateFormat;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Whether to show today button */
  showToday?: boolean;
  /** Whether to show clear button */
  showClear?: boolean;
  /** Custom placeholder text */
  placeholder?: string;
  /** Whether calendar is open by default */
  defaultOpen?: boolean;
  /** Callback when calendar opens/closes */
  onOpenChange?: (open: boolean) => void;
  /** Custom date cell renderer */
  renderDay?: (date: Date, isSelected: boolean, isToday: boolean, isDisabled: boolean) => React.ReactNode;
  /** Disabled dates checker */
  isDateDisabled?: (date: Date) => boolean;
  /** First day of week (0 = Sunday, 1 = Monday) */
  firstDayOfWeek?: 0 | 1;
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

// Date formatting utilities
const formatDate = (date: Date | null, format: DateFormat): string => {
  if (!date) return '';
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  
  switch (format) {
    case 'dd/mm/yyyy':
      return `${day}/${month}/${year}`;
    case 'mm/dd/yyyy':
      return `${month}/${day}/${year}`;
    case 'yyyy-mm-dd':
      return `${year}-${month}-${day}`;
    case 'dd-mm-yyyy':
      return `${day}-${month}-${year}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

const parseDate = (dateString: string, format: DateFormat): Date | null => {
  if (!dateString) return null;
  
  let day: number, month: number, year: number;
  
  switch (format) {
    case 'dd/mm/yyyy': {
      const parts = dateString.split('/');
      if (parts.length !== 3) return null;
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      year = parseInt(parts[2], 10);
      break;
    }
    case 'mm/dd/yyyy': {
      const parts = dateString.split('/');
      if (parts.length !== 3) return null;
      month = parseInt(parts[0], 10) - 1;
      day = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
      break;
    }
    case 'yyyy-mm-dd': {
      const parts = dateString.split('-');
      if (parts.length !== 3) return null;
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
      break;
    }
    case 'dd-mm-yyyy': {
      const parts = dateString.split('-');
      if (parts.length !== 3) return null;
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      year = parseInt(parts[2], 10);
      break;
    }
    default:
      return null;
  }
  
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }
  
  return date;
};

// Calendar utilities
const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false;
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(date, today);
};

// Generate unique ID for accessibility
let datePickerIdCounter = 0;
const generateDatePickerId = () => `datepicker-${++datePickerIdCounter}`;

// Month names
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Day names
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Professional DatePicker Component with BEM Methodology
 * 
 * Features:
 * - Pure BEM class-based styling (no inline CSS)
 * - Design token integration via CSS custom properties
 * - Full accessibility support with proper ARIA attributes
 * - Multiple variants and states (error, success, warning)
 * - Flexible date formatting options
 * - Calendar navigation with keyboard support
 * - Min/max date constraints
 * - Custom date cell rendering
 * - Today and clear buttons
 * - Responsive and mobile-optimized
 * 
 * @example
 * // Basic date picker
 * <DatePicker 
 *   label="Birth Date" 
 *   placeholder="Select your birth date"
 * />
 * 
 * // Date picker with constraints
 * <DatePicker 
 *   label="Appointment Date"
 *   minDate={new Date()}
 *   maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
 *   showToday
 *   required
 * />
 */
const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
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
    format = 'dd/mm/yyyy',
    minDate,
    maxDate,
    showToday = true,
    showClear = true,
    placeholder,
    defaultOpen = false,
    onOpenChange,
    renderDay,
    isDateDisabled,
    firstDayOfWeek = 1,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref
) {
  // State management
  const [focused, setFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue || null);
  const [inputValue, setInputValue] = useState(() => formatDate(defaultValue || null, format));
  // const [currentView, setCurrentView] = useState<DatePickerView>('day');
  const [viewDate, setViewDate] = useState(() => value || defaultValue || new Date());
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Use controlled or uncontrolled value
  const currentValue = value !== undefined ? value : internalValue;
  
  // Generate unique IDs for accessibility
  const inputId = id || generateDatePickerId();
  const labelId = `${inputId}-label`;
  const helperTextId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const successId = `${inputId}-success`;
  const warningId = `${inputId}-warning`;
  const calendarId = `${inputId}-calendar`;
  
  // Determine actual variant based on props
  const actualVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant;
  
  // Update input value when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(formatDate(value, format));
    }
  }, [value, format]);
  
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
  
  // Handle calendar open/close
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
    
    // Try to parse the date
    const parsedDate = parseDate(newValue, format);
    if (parsedDate) {
      const finalDate = parsedDate;
      if (value === undefined) {
        setInternalValue(finalDate);
      }
      onChange?.(finalDate);
      setViewDate(finalDate);
    } else if (newValue === '') {
      if (value === undefined) {
        setInternalValue(null);
      }
      onChange?.(null);
    }
  }, [format, onChange, value]);
  
  // Handle date selection
  const handleDateSelect = useCallback((date: Date) => {
    const finalDate = date;
    setInputValue(formatDate(finalDate, format));
    
    if (value === undefined) {
      setInternalValue(finalDate);
    }
    onChange?.(finalDate);
    handleClose();
    inputRef.current?.focus();
  }, [format, onChange, value, handleClose]);
  
  // Handle today button
  const handleToday = useCallback(() => {
    const today = new Date();
    handleDateSelect(today);
  }, [handleDateSelect]);
  
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
  
  // Navigation handlers
  const handlePrevMonth = useCallback(() => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);
  
  const handleNextMonth = useCallback(() => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);
  
  const handlePrevYear = useCallback(() => {
    setViewDate(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
  }, []);
  
  const handleNextYear = useCallback(() => {
    setViewDate(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
  }, []);
  
  // Check if date is disabled
  const isDateDisabledInternal = useCallback((date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    if (isDateDisabled) return isDateDisabled(date);
    return false;
  }, [minDate, maxDate, isDateDisabled]);
  
  // Generate calendar days
  const generateCalendarDays = useCallback(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    
    // Adjust first day based on firstDayOfWeek setting
    const adjustedFirstDay = (firstDay - firstDayOfWeek + 7) % 7;
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [viewDate, firstDayOfWeek]);
  
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
    createBemClass('datepicker-wrapper', undefined, [
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
    createBemClass('datepicker-input', undefined, [
      actualVariant,
      size,
      fullWidth && 'full-width',
      disabled && 'disabled',
      focused && 'focused',
      loading && 'loading'
    ]),
    className
  ].filter(Boolean).join(' ');
  
  const fieldClasses = createBemClass('datepicker-field', undefined, [
    actualVariant,
    size,
    disabled && 'disabled',
    focused && 'focused',
    loading && 'loading'
  ]);
  
  const calendarDays = generateCalendarDays();
  
  // Adjust day names based on firstDayOfWeek
  const adjustedDayNames = [...DAY_NAMES.slice(firstDayOfWeek), ...DAY_NAMES.slice(0, firstDayOfWeek)];
  
  return (
    <div ref={wrapperRef} className={wrapperClasses}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          id={labelId}
          className={createBemClass('datepicker-label', undefined, [
            actualVariant,
            size,
            disabled && 'disabled',
            required && 'required'
          ])}
        >
          {label}
          {required && (
            <span className="datepicker-label__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      
      {/* Input Field Container */}
      <div className={fieldClasses}>
        {/* Start Icon */}
        {startIcon && (
          <span className="datepicker-field__start-icon" aria-hidden="true">
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
          placeholder={placeholder || `Enter date (${format})`}
          aria-invalid={actualVariant === 'error' ? 'true' : undefined}
          aria-describedby={describedByIds || undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          role="combobox"
          {...props}
        />
        
        {/* Calendar Toggle Button */}
        <button
          type="button"
          className="datepicker-field__calendar-button"
          onClick={handleToggle}
          disabled={disabled || loading}
          aria-label="Open calendar"
          tabIndex={-1}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2V1C12 0.4 11.6 0 11 0S10 0.4 10 1V2H6V1C6 0.4 5.6 0 5 0S4 0.4 4 1V2H2C0.9 2 0 2.9 0 4V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V4C16 2.9 15.1 2 14 2H12ZM14 14H2V6H14V14Z" fill="currentColor"/>
          </svg>
        </button>
        
        {/* Loading Spinner */}
        {loading && (
          <span className="datepicker-field__spinner" aria-hidden="true">
            <span className="datepicker-field__spinner-icon"></span>
          </span>
        )}
      </div>
      
      {/* Calendar Dropdown */}
      {isOpen && (
        <div 
          ref={calendarRef}
          id={calendarId}
          className="datepicker-calendar"
          role="dialog"
          aria-label="Choose date"
          aria-modal="false"
        >
          {/* Calendar Header */}
          <div className="datepicker-calendar__header">
            <button
              type="button"
              className="datepicker-calendar__nav-button"
              onClick={handlePrevYear}
              aria-label="Previous year"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button
              type="button"
              className="datepicker-calendar__nav-button"
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="datepicker-calendar__title">
              {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
            </div>
            
            <button
              type="button"
              className="datepicker-calendar__nav-button"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button
              type="button"
              className="datepicker-calendar__nav-button"
              onClick={handleNextYear}
              aria-label="Next year"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          {/* Calendar Grid */}
          <div className="datepicker-calendar__grid">
            {/* Day Headers */}
            {adjustedDayNames.map((dayName) => (
              <div key={dayName} className="datepicker-calendar__day-header">
                {dayName}
              </div>
            ))}
            
            {/* Calendar Days */}
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={index} className="datepicker-calendar__day-empty" />;
              }
              
              const isSelected = isSameDay(date, currentValue);
              const isTodayDate = isToday(date);
              const isDisabled = isDateDisabledInternal(date);
              
              return (
                <button
                  key={date.getTime()}
                  type="button"
                  className={createBemClass('datepicker-calendar__day', undefined, [
                    isSelected && 'selected',
                    isTodayDate && 'today',
                    isDisabled && 'disabled'
                  ])}
                  onClick={() => !isDisabled && handleDateSelect(date)}
                  disabled={isDisabled}
                  aria-label={formatDate(date, format)}
                  aria-selected={isSelected}
                >
                  {renderDay ? renderDay(date, isSelected, isTodayDate, isDisabled) : date.getDate()}
                </button>
              );
            })}
          </div>
          
          {/* Calendar Footer */}
          {(showToday || showClear) && (
            <div className="datepicker-calendar__footer">
              {showToday && (
                <button
                  type="button"
                  className="datepicker-calendar__action-button datepicker-calendar__action-button--today"
                  onClick={handleToday}
                >
                  Today
                </button>
              )}
              {showClear && (
                <button
                  type="button"
                  className="datepicker-calendar__action-button datepicker-calendar__action-button--clear"
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
      <div className="datepicker-messages">
        {/* Error Message */}
        {error && (
          <span 
            id={errorId}
            className={createBemClass('datepicker-message', undefined, ['error'])}
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
            className={createBemClass('datepicker-message', undefined, ['success'])}
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
            className={createBemClass('datepicker-message', undefined, ['warning'])}
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
            className={createBemClass('datepicker-message', undefined, ['helper'])}
          >
            {helperText}
          </span>
        )}
      </div>
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export { DatePicker };
export default DatePicker;
