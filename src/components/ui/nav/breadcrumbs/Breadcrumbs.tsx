'use client';
import React from 'react';
import { Icon } from '@/components/ui/icon';
import './Breadcrumbs.scss';

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  disabled?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: 'chevron' | 'slash' | 'arrow' | 'dot';
  size?: 'sm' | 'md' | 'lg';
  showHome?: boolean;
  homeIcon?: string;
  homeHref?: string;
  maxItems?: number;
  onItemClick?: (item: BreadcrumbItem) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  separator = 'chevron',
  size = 'md',
  showHome = true,
  homeIcon = 'home',
  homeHref = '/',
  maxItems,
  onItemClick,
}) => {
  // Add home item if requested
  const allItems = showHome 
    ? [{ id: 'home', label: 'Home', href: homeHref, icon: homeIcon }, ...items]
    : items;

  // Handle max items with ellipsis
  let displayItems = allItems;
  let hasEllipsis = false;

  if (maxItems && allItems.length > maxItems) {
    hasEllipsis = true;
    const keepFirst = Math.floor((maxItems - 1) / 2);
    const keepLast = maxItems - 1 - keepFirst;
    
    displayItems = [
      ...allItems.slice(0, keepFirst),
      ...allItems.slice(-keepLast)
    ];
  }

  const handleItemClick = (item: BreadcrumbItem, event: React.MouseEvent) => {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    onItemClick?.(item);
  };

  const getSeparatorIcon = () => {
    switch (separator) {
      case 'slash': return '/';
      case 'arrow': return '→';
      case 'dot': return '•';
      case 'chevron':
      default: return 'chevron-right';
    }
  };

  const renderSeparator = (index: number) => {
    if (separator === 'chevron') {
      return (
        <Icon 
          name={getSeparatorIcon() as string}
          className="breadcrumbs__separator"
          aria-hidden="true"
        />
      );
    }
    
    return (
      <span className="breadcrumbs__separator" aria-hidden="true">
        {getSeparatorIcon()}
      </span>
    );
  };

  const renderEllipsis = () => (
    <li className="breadcrumbs__item breadcrumbs__item--ellipsis">
      <span className="breadcrumbs__ellipsis" aria-label="More items">
        <Icon name="more-horizontal" />
      </span>
    </li>
  );

  const renderBreadcrumbItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const itemClasses = [
      'breadcrumbs__item',
      item.disabled && 'breadcrumbs__item--disabled',
      isLast && 'breadcrumbs__item--current',
    ].filter(Boolean).join(' ');

    const linkClasses = [
      'breadcrumbs__link',
      item.icon && 'breadcrumbs__link--has-icon',
    ].filter(Boolean).join(' ');

    const LinkComponent = item.href && !isLast ? 'a' : 'span';
    const linkProps = item.href && !isLast 
      ? { href: item.href }
      : {};

    return (
      <li key={item.id} className={itemClasses}>
        <LinkComponent
          className={linkClasses}
          onClick={(e) => handleItemClick(item, e)}
          aria-current={isLast ? 'page' : undefined}
          {...linkProps}
        >
          {item.icon && (
            <Icon 
              name={item.icon} 
              className="breadcrumbs__icon"
              aria-hidden="true"
            />
          )}
          <span className="breadcrumbs__label">{item.label}</span>
        </LinkComponent>
      </li>
    );
  };

  const breadcrumbsClasses = [
    'breadcrumbs',
    `breadcrumbs--${size}`,
    `breadcrumbs--separator-${separator}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <nav 
      className={breadcrumbsClasses}
      aria-label="Breadcrumb navigation"
    >
      <ol className="breadcrumbs__list">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const shouldShowEllipsis = hasEllipsis && index === Math.floor((maxItems! - 1) / 2);
          
          return (
            <React.Fragment key={item.id}>
              {shouldShowEllipsis && renderEllipsis()}
              {shouldShowEllipsis && renderSeparator(index)}
              
              {renderBreadcrumbItem(item, index, isLast)}
              
              {!isLast && renderSeparator(index)}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
