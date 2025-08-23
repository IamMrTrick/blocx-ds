import React from 'react';
import type { IconSize } from './Icon';

interface IconSkeletonProps {
  size?: IconSize | number | string;
  className?: string;
}

// Helper function to get CSS variable for skeleton size (same as Icon)
const getSkeletonSize = (size: IconSize | number | string): string => {
  if (typeof size === 'number') return `${size}px`;
  
  // Convert to pixel values matching Icon component
  const sizeMap: Record<IconSize, string> = {
    'xxs': '8px',   // --text-xxs-size: 0.5rem (8px)
    'xs': '10px',   // --text-xs-size: 0.625rem (10px)
    'sm': '12px',   // --text-sm-size: 0.75rem (12px)
    'md': '14px',   // --text-md-size: 0.875rem (14px)
    'lg': '16px',   // --text-lg-size: 1rem (16px)
    'xl': '18px',   // --text-xl-size: 1.125rem (18px)
    'h6': '18px',   // --heading-06-size: 1.125rem (18px)
    'h5': '20px',   // --heading-05-size: 1.25rem (20px)
    'h4': '24px',   // --heading-04-size: 1.5rem (24px)
    'h3': '28px',   // --heading-03-size: 1.75rem (28px)
    'h2': '36px',   // --heading-02-size: 2.25rem (36px)
    'h1': '48px',   // --heading-01-size: 3rem (48px)
  };
  
  return sizeMap[size as IconSize] || '16px';
};

/**
 * Loading skeleton for icons
 * Displayed until the main icon is loaded
 */
export const IconSkeleton: React.FC<IconSkeletonProps> = ({ 
  size = 'lg', // Default to text-lg (16px) - same as Icon
  className = '' 
}) => {
  const sizeValue = getSkeletonSize(size);
  
  return (
    <span
      className={`icon-skeleton ${className}`}
      style={{
        width: sizeValue,
        height: sizeValue,
        minWidth: sizeValue,
        minHeight: sizeValue,
      }}
      aria-hidden="true"
    />
  );
};

export default IconSkeleton;
