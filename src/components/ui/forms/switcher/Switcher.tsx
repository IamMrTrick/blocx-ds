'use client';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

export type SwitcherSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export type SwitcherVariant = 'default' | 'error' | 'success' | 'warning';

export interface SwitcherProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  variant?: SwitcherVariant;
  size?: SwitcherSize;
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  warning?: string;
  loading?: boolean;
  wrapperClassName?: string;
  required?: boolean;
}

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
      .map(mod => (typeof mod === 'string' ? mod : ''))
      .filter(Boolean);

    if (validModifiers.length > 0) {
      const baseClass = element ? `${block}__${element}` : block;
      className += ` ${validModifiers.map(mod => `${baseClass}--${mod}`).join(' ')}`;
    }
  }

  return className;
};

let switcherIdCounter = 0;
const generateSwitcherId = () => `switcher-${++switcherIdCounter}`;

const Switcher = forwardRef<HTMLInputElement, SwitcherProps>(function Switcher(
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
    className = '',
    id,
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
  const [focused, setFocused] = useState(false);
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isChecked = checked !== undefined ? checked : internalChecked;

  const switcherId = id || generateSwitcherId();
  const labelId = `${switcherId}-label`;
  const helperTextId = `${switcherId}-helper`;
  const errorId = `${switcherId}-error`;
  const successId = `${switcherId}-success`;
  const warningId = `${switcherId}-warning`;

  const actualVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant;

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  }, [onFocus]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  }, [onBlur]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (checked === undefined) {
      setInternalChecked(e.target.checked);
    }
    onChange?.(e);
  }, [onChange, checked]);

  useEffect(() => {
    if (typeof ref === 'function') {
      ref(inputRef.current as HTMLInputElement);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = inputRef.current;
    }
  }, [ref]);

  const describedByIds = [
    ariaDescribedBy,
    helperText && helperTextId,
    error && errorId,
    success && successId,
    warning && warningId
  ].filter(Boolean).join(' ');

  const wrapperClasses = [
    createBemClass('switcher-wrapper', undefined, [
      actualVariant,
      size,
      disabled && 'disabled',
      focused && 'focused',
      loading && 'loading',
      isChecked && 'checked'
    ]),
    wrapperClassName
  ].filter(Boolean).join(' ');

  const inputClasses = [
    createBemClass('switcher', undefined, [
      actualVariant,
      size,
      disabled && 'disabled',
      focused && 'focused',
      loading && 'loading',
      isChecked && 'checked'
    ]),
    className
  ].filter(Boolean).join(' ');

  const controlClasses = createBemClass('switcher-control', undefined, [
    actualVariant,
    size,
    disabled && 'disabled',
    focused && 'focused',
    loading && 'loading',
    isChecked && 'checked'
  ]);

  return (
    <div className={wrapperClasses}>
      <div className="switcher-field">
        <div className={controlClasses}>
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') ref(node as HTMLInputElement);
            }}
            id={switcherId}
            type="checkbox"
            role="switch"
            className={inputClasses}
            disabled={disabled || loading}
            checked={isChecked}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-checked={isChecked}
            aria-invalid={actualVariant === 'error' ? 'true' : undefined}
            aria-describedby={describedByIds || undefined}
            aria-labelledby={label ? labelId : undefined}
            {...props}
          />

          <span className="switcher-control__track" aria-hidden="true">
            {loading && (
              <span className="switcher-control__spinner" aria-hidden="true">
                <span className="switcher-control__spinner-icon"></span>
              </span>
            )}
            <span className="switcher-control__thumb" aria-hidden="true" />
          </span>
        </div>

        {label && (
          <label
            htmlFor={switcherId}
            id={labelId}
            className={createBemClass('switcher-label', undefined, [
              actualVariant,
              size,
              disabled && 'disabled',
              required && 'required'
            ])}
          >
            {label}
            {required && (
              <span className="switcher-label__required" aria-label="required">*</span>
            )}
          </label>
        )}
      </div>

      <div className="switcher-messages">
        {error && (
          <span
            id={errorId}
            className={createBemClass('switcher-message', undefined, ['error'])}
            role="alert"
            aria-live="polite"
          >
            {error}
          </span>
        )}

        {success && !error && (
          <span
            id={successId}
            className={createBemClass('switcher-message', undefined, ['success'])}
            role="status"
            aria-live="polite"
          >
            {success}
          </span>
        )}

        {warning && !error && !success && (
          <span
            id={warningId}
            className={createBemClass('switcher-message', undefined, ['warning'])}
            role="alert"
            aria-live="polite"
          >
            {warning}
          </span>
        )}

        {helperText && !error && !success && !warning && (
          <span
            id={helperTextId}
            className={createBemClass('switcher-message', undefined, ['helper'])}
          >
            {helperText}
          </span>
        )}
      </div>
    </div>
  );
});

Switcher.displayName = 'Switcher';

export { Switcher };
export default Switcher;


