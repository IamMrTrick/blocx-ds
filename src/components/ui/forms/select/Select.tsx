'use client';
import React, { forwardRef, useState, useCallback, useRef, useEffect, useId } from 'react';

// Select size variants based on design tokens
export type SelectSize = 'xs' | 's' | 'm' | 'l' | 'xl';

// Select variant types
export type SelectVariant = 'default' | 'error' | 'success' | 'warning';

// Option type
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

// Base select props
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Select variant for different states */
  variant?: SelectVariant;
  /** Size of the select */
  size?: SelectSize;
  /** Label text */
  label?: string;
  /** Helper text shown below select */
  helperText?: string;
  /** Error message - when provided, variant becomes 'error' */
  error?: string;
  /** Success message - when provided, variant becomes 'success' */
  success?: string;
  /** Warning message - when provided, variant becomes 'warning' */
  warning?: string;
  /** Whether the select takes full width */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Custom wrapper class name */
  wrapperClassName?: string;
  /** Whether label is required (shows asterisk) */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Options for the select */
  options?: SelectOption[];
  /** Whether to use native select or custom dropdown */
  native?: boolean;
  /** Icon to show at the start of select */
  startIcon?: React.ReactNode;
  /** Custom dropdown icon */
  dropdownIcon?: React.ReactNode;
  /** Whether the dropdown is searchable */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** No options message */
  noOptionsMessage?: string;
  /** Loading message */
  loadingMessage?: string;
  /** Maximum height for dropdown */
  maxDropdownHeight?: number;
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


// Default dropdown icon (SVG)
const DefaultDropdownIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="select-icon__dropdown"
  >
    <path
      d="M3 4.5L6 7.5L9 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Search icon (SVG)
const SearchIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="select-icon__search"
  >
    <circle
      cx="5"
      cy="5"
      r="3"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="8 8L10 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Professional Select Component with BEM Methodology
 * 
 * Features:
 * - Pure BEM class-based styling (no inline CSS)
 * - Design token integration via CSS custom properties
 * - Full accessibility support with proper ARIA attributes
 * - Multiple variants and states (error, success, warning)
 * - Native and custom dropdown modes
 * - Searchable dropdown functionality
 * - Option grouping support
 * - Loading states
 * - Responsive and mobile-optimized
 * - Label and helper text support
 * - Keyboard navigation support
 * 
 * @example
 * // Basic native select
 * <Select 
 *   label="Country" 
 *   placeholder="Select a country"
 *   native
 * >
 *   <option value="us">United States</option>
 *   <option value="ca">Canada</option>
 *   <option value="uk">United Kingdom</option>
 * </Select>
 * 
 * // Custom dropdown with options
 * <Select 
 *   label="Framework"
 *   options={[
 *     { value: 'react', label: 'React' },
 *     { value: 'vue', label: 'Vue.js' },
 *     { value: 'angular', label: 'Angular' }
 *   ]}
 *   searchable
 *   placeholder="Choose a framework"
 * />
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    variant = 'default',
    size = 'm',
    label,
    helperText,
    error,
    success,
    warning,
    fullWidth = false,
    loading = false,
    wrapperClassName = '',
    required = false,
    disabled = false,
    placeholder,
    options = [],
    native = false,
    startIcon,
    dropdownIcon,
    searchable = false,
    searchPlaceholder = 'Search...',
    noOptionsMessage = 'No options available',
    loadingMessage = 'Loading...',
    maxDropdownHeight = 200,
    className = '',
    id,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    children,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref
) {
  // State management
  const [focused, setFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [_isAnimating, _setIsAnimating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  // Refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Use controlled or uncontrolled value
  const currentValue = value !== undefined ? value : internalValue;
  
  // Generate unique IDs for accessibility using React's useId
  const reactId = useId();
  const selectId = id || `select-${reactId}`;
  const labelId = `${selectId}-label`;
  const helperTextId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;
  const successId = `${selectId}-success`;
  const warningId = `${selectId}-warning`;
  const dropdownId = `${selectId}-dropdown`;
  
  // Determine actual variant based on props
  const actualVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant;
  
  // Filter options based on search term
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;
  
  // Group options if needed
  const groupedOptions = filteredOptions.reduce((groups, option) => {
    const group = option.group || '';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(option);
    return groups;
  }, {} as Record<string, SelectOption[]>);
  
  // Get selected option label
  const selectedOption = options.find(opt => opt.value === currentValue);
  const displayValue = selectedOption?.label || '';
  
  // Handle focus events
  const handleFocus = useCallback((e: React.FocusEvent<HTMLSelectElement>) => {
    setFocused(true);
    onFocus?.(e);
  }, [onFocus]);
  
  const handleBlur = useCallback((e: React.FocusEvent<HTMLSelectElement>) => {
    setFocused(false);
    onBlur?.(e);
  }, [onBlur]);
  
  // Handle change events
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (value === undefined) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  }, [onChange, value]);
  
  // Handle custom dropdown
  const handleDropdownToggle = useCallback(() => {
    if (disabled || loading) return;
    setIsOpen(!isOpen);
    setSearchTerm('');
    setHighlightedIndex(-1);
  }, [disabled, loading, isOpen]);
  
  const handleOptionSelect = useCallback((optionValue: string) => {
    if (value === undefined) {
      setInternalValue(optionValue);
    }
    
    // Create synthetic event for onChange
    const syntheticEvent = {
      target: { value: optionValue },
      currentTarget: { value: optionValue }
    } as React.ChangeEvent<HTMLSelectElement>;
    
    onChange?.(syntheticEvent);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  }, [onChange, value]);
  
  // Handle search
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
  }, []);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex].value);
        }
        break;
    }
  }, [isOpen, filteredOptions, highlightedIndex, handleOptionSelect]);
  
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);
  
  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);
  
  // Build aria-describedby
  const describedByIds = [
    ariaDescribedBy,
    helperText && helperTextId,
    error && errorId,
    success && successId,
    warning && warningId
  ].filter(Boolean).join(' ');
  
  // Generate CSS classes with template strings
  const wrapperClasses = [
    'select-wrapper',
    actualVariant && `select-wrapper--${actualVariant}`,
    size && `select-wrapper--${size}`,
    fullWidth && 'select-wrapper--full-width',
    disabled && 'select-wrapper--disabled',
    focused && 'select-wrapper--focused',
    loading && 'select-wrapper--loading',
    isOpen && 'select-wrapper--open',
    !native && 'select-wrapper--custom',
    wrapperClassName
  ].filter(Boolean).join(' ');
  
  const selectClasses = [
    'select',
    actualVariant && `select--${actualVariant}`,
    size && `select--${size}`,
    fullWidth && 'select--full-width',
    disabled && 'select--disabled',
    focused && 'select--focused',
    loading && 'select--loading',
    !native && 'select--custom',
    className
  ].filter(Boolean).join(' ');
  
  const fieldClasses = [
    'select-field',
    actualVariant && `select-field--${actualVariant}`,
    size && `select-field--${size}`,
    disabled && 'select-field--disabled',
    focused && 'select-field--focused',
    loading && 'select-field--loading',
    isOpen && 'select-field--open'
  ].filter(Boolean).join(' ');
  
  if (native) {
    // Native select implementation
    return (
      <div className={wrapperClasses} ref={wrapperRef}>
        {/* Label */}
        {label && (
          <label 
            htmlFor={selectId}
            id={labelId}
            className={createBemClass('select-label', undefined, [
              actualVariant,
              size,
              disabled && 'disabled',
              required && 'required'
            ])}
          >
            {label}
            {required && (
              <span className="select-label__required" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        
        {/* Select Field Container */}
        <div className={fieldClasses}>
          {/* Start Icon */}
          {startIcon && (
            <span className="select-field__start-icon" aria-hidden="true">
              {startIcon}
            </span>
          )}
          
          {/* Native Select Element */}
          <select
            ref={ref}
            id={selectId}
            className={selectClasses}
            disabled={disabled || loading}
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={actualVariant === 'error' ? 'true' : undefined}
            aria-describedby={describedByIds || undefined}
            aria-labelledby={label ? labelId : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Loading Spinner */}
          {loading && (
            <span className="select-field__spinner" aria-hidden="true">
              <span className="select-field__spinner-icon"></span>
            </span>
          )}
          
          {/* Dropdown Icon */}
          {!loading && (
            <span className="select-field__dropdown-icon" aria-hidden="true">
              {dropdownIcon || <DefaultDropdownIcon />}
            </span>
          )}
        </div>
        
        {/* Helper Text / Messages */}
        <div className="select-messages">
          {/* Error Message */}
          {error && (
            <span 
              id={errorId}
              className={createBemClass('select-message', undefined, ['error'])}
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
              className={createBemClass('select-message', undefined, ['success'])}
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
              className={createBemClass('select-message', undefined, ['warning'])}
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
              className={createBemClass('select-message', undefined, ['helper'])}
            >
              {helperText}
            </span>
          )}
        </div>
      </div>
    );
  }
  
  // Custom dropdown implementation
  return (
    <div className={wrapperClasses} ref={wrapperRef}>
      {/* Label */}
      {label && (
        <label 
          id={labelId}
          className={createBemClass('select-label', undefined, [
            actualVariant,
            size,
            disabled && 'disabled',
            required && 'required'
          ])}
        >
          {label}
          {required && (
            <span className="select-label__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      
      {/* Select Field Container */}
      <div className={fieldClasses}>
        {/* Start Icon */}
        {startIcon && (
          <span className="select-field__start-icon" aria-hidden="true">
            {startIcon}
          </span>
        )}
        
        {/* Custom Select Trigger - Entire field is clickable */}
        <div
          className={selectClasses}
          onClick={handleDropdownToggle}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? dropdownId : undefined}
          aria-haspopup="listbox"
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={describedByIds || undefined}
          aria-invalid={actualVariant === 'error' ? 'true' : undefined}
          style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          <span className="select__display">
            {displayValue || placeholder || 'Select...'}
          </span>
          
          {/* Loading Spinner */}
          {loading && (
            <span className="select-field__spinner" aria-hidden="true">
              <span className="select-field__spinner-icon"></span>
            </span>
          )}
          
          {/* Dropdown Icon - Part of clickable area */}
          {!loading && (
            <span 
              className="select-field__dropdown-icon" 
              aria-hidden="true"
            >
              {dropdownIcon || <DefaultDropdownIcon />}
            </span>
          )}
        </div>
        
        {/* Custom Dropdown */}
        {isOpen && (
          <div 
            className="select-dropdown"
            id={dropdownId}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            style={{ maxHeight: maxDropdownHeight }}
            ref={dropdownRef}
          >
            {/* Search Input */}
            {searchable && (
              <div className="select-dropdown__search">
                <SearchIcon />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="select-dropdown__search-input"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            
            {/* Options */}
            <div className="select-dropdown__options">
              {loading ? (
                <div className="select-dropdown__message">
                  {loadingMessage}
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="select-dropdown__message">
                  {noOptionsMessage}
                </div>
              ) : (
                Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                  <div key={groupName} className="select-dropdown__group">
                    {groupName && (
                      <div className="select-dropdown__group-label">
                        {groupName}
                      </div>
                    )}
                    {groupOptions.map((option) => {
                      const globalIndex = filteredOptions.indexOf(option);
                      return (
                        <div
                          key={option.value}
                          className={createBemClass('select-dropdown__option', undefined, [
                            option.disabled && 'disabled',
                            currentValue === option.value && 'selected',
                            highlightedIndex === globalIndex && 'highlighted'
                          ])}
                          role="option"
                          aria-selected={currentValue === option.value}
                          onClick={() => !option.disabled && handleOptionSelect(option.value)}
                        >
                          {option.label}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Helper Text / Messages */}
      <div className="select-messages">
        {/* Error Message */}
        {error && (
          <span 
            id={errorId}
            className={createBemClass('select-message', undefined, ['error'])}
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
            className={createBemClass('select-message', undefined, ['success'])}
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
            className={createBemClass('select-message', undefined, ['warning'])}
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
            className={createBemClass('select-message', undefined, ['helper'])}
          >
            {helperText}
          </span>
        )}
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export { Select };
export default Select;
