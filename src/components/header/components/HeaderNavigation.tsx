'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerHeader, DrawerBody, DrawerTitle } from '@/components/ui/drawer';
import { Nav as PrimaryNav } from '@/components/ui/nav/primary-nav/PrimaryNav';
import { navigationItems } from '../constants/navigationItems';
import { useActiveNavigation } from '../hooks/useActiveNavigation';
import type { PrimaryNavItem } from '@/components/ui/nav/primary-nav/PrimaryNav';
import './HeaderNavigation.scss';

export interface HeaderNavigationProps {
  /** Custom className */
  className?: string;
  /** Active navigation item ID (if not provided, will be calculated from pathname) */
  activeId?: string;
  /** Mobile menu open state */
  isMobileMenuOpen?: boolean;
  /** Callback when mobile menu should close */
  onMobileMenuClose?: () => void;
}

export interface HeaderMobileToggleProps {
  /** Whether the mobile menu is open */
  isOpen: boolean;
  /** Callback when toggle is clicked */
  onToggle: () => void;
  /** ARIA controls attribute */
  ariaControls?: string;
  /** Custom className */
  className?: string;
}

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  className = '',
  activeId: providedActiveId,
  isMobileMenuOpen = false,
  onMobileMenuClose,
}) => {
  const activeId = useActiveNavigation(providedActiveId);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Toggle expanded state for mobile menu items with children
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Handle keyboard navigation for toggle buttons
  const handleToggleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpanded(itemId);
    }
  };

  // Check if item is active in mobile menu
  const isItemActive = (item: PrimaryNavItem): boolean => {
    if (activeId === item.id) return true;
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    return false;
  };

  const handleMobileMenuClose = () => {
    onMobileMenuClose?.();
  };

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        handleMobileMenuClose();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isMobileMenuOpen]);



  // Render leaf link for mobile menu
  const renderMobileLeafLink = (item: PrimaryNavItem, isActive: boolean) => {
    const href = item.href ?? '#';
    const isExternal = Boolean(item.external) || /^https?:\/\//i.test(href);
    if (!isExternal) {
      return (
        <Link
          href={href as string}
          className={`mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`}
          onClick={handleMobileMenuClose}
          prefetch={false}
        >
          <span className="mobile-nav__label">{item.label}</span>
        </Link>
      );
    }
    return (
      <a
        href={href}
        className={`mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`}
        onClick={handleMobileMenuClose}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <span className="mobile-nav__label">{item.label}</span>
        {item.external && (
          <Icon name="external-link" className="mobile-nav__external" aria-hidden />
        )}
      </a>
    );
  };

  // Render navigation item for mobile menu
  const renderMobileNavItem = (item: PrimaryNavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = isItemActive(item);

    return (
      <li key={item.id} className={`mobile-nav__item mobile-nav__item--level-${level}`}>
        {hasChildren ? (
          <>
            {/* Parent item with both link and toggle */}
            <div className="mobile-nav__parent">
              {/* Link to parent page */}
              {renderMobileLeafLink(item, isActive)}
              
              {/* Toggle button for submenu */}
              <button
                className="mobile-nav__toggle"
                onClick={() => toggleExpanded(item.id)}
                onKeyDown={(e) => handleToggleKeyDown(e, item.id)}
                aria-expanded={isExpanded}
                aria-controls={`mobile-submenu-${item.id}`}
                aria-label={`Toggle ${item.label} submenu`}
              >
                <Icon 
                  name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                  className="mobile-nav__chevron"
                  aria-hidden
                />
              </button>
            </div>
            
            {/* Submenu */}
            <ul 
              id={`mobile-submenu-${item.id}`}
              className={`mobile-nav__submenu mobile-nav__submenu--level-${level + 1}`}
              hidden={!isExpanded}
            >
              {item.children!.map(child => renderMobileNavItem(child, level + 1))}
            </ul>
          </>
        ) : (
          renderMobileLeafLink(item, isActive)
        )}
      </li>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className={`header-nav header-nav--desktop ${className}`}>
        <PrimaryNav
          items={navigationItems}
          activeId={activeId}
          layout="gap"
          gap="md"
          dropdownTrigger="hover"
          dropdownDelay={350}
          variant="horizontal"
          size="md"
          collapsible={true}
        />
      </div>



      {/* Mobile Navigation Drawer */}
      <Drawer
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        side="bottom"
        size="l"
        dismissible={true}
        swipeToClose={true}
        backdrop={true}
        trapFocus={true}
        className="header-nav__mobile-drawer"
        aria-label="Mobile navigation menu"
      >
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <Button
            iconOnly
            variant="ghost"
            size="m"
            onClick={handleMobileMenuClose}
            aria-label="Close navigation menu"
          >
            <Icon name="x" />
          </Button>
        </DrawerHeader>

        <DrawerBody scrollable={true}>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <ul className="mobile-nav__list">
              {navigationItems.map(item => renderMobileNavItem(item))}
            </ul>
          </nav>
        </DrawerBody>
      </Drawer>
    </>
  );
};

// Separate Mobile Toggle Button Component
export const HeaderMobileToggle: React.FC<HeaderMobileToggleProps> = ({
  isOpen,
  onToggle,
  ariaControls = "mobile-navigation-menu",
  className = '',
}) => {
  return (
    <button
      className={`header__mobile-toggle ${className}`.trim()}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={ariaControls}
      aria-label="Toggle mobile navigation"
    >
      <Icon name={isOpen ? 'x' : 'menu'}>
        <span className="header__toggle-icon"></span>
      </Icon>
    </button>
  );
};

export default HeaderNavigation;
