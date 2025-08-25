'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerHeader, DrawerBody, DrawerTitle } from '@/components/ui/drawer';
import type { PrimaryNavItem } from '@/components/ui/nav/primary-nav/PrimaryNav';

export interface HeaderMobileMenuProps {
  /** Navigation items (same structure as HeaderNavMenu) */
  items: PrimaryNavItem[];
  /** Whether the menu is open */
  isOpen: boolean;
  /** Callback when menu should close */
  onClose: () => void;
  /** Active navigation item ID */
  activeId?: string;
  /** Custom className */
  className?: string;
}

export const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
  items,
  isOpen,
  onClose,
  activeId,
  className = '',
}) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Route-change close is handled in HeaderWithMobileMenu

  // Toggle expanded state for items with children
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

  // Check if item is active
  const isItemActive = (item: PrimaryNavItem): boolean => {
    if (activeId === item.id) return true;
    if (pathname === item.href) return true;
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    return false;
  };

  const renderLeafLink = (item: PrimaryNavItem, isActive: boolean) => {
    const href = item.href ?? '#';
    const isExternal = Boolean(item.external) || /^https?:\/\//i.test(href);
    if (!isExternal) {
      return (
        <Link
          href={href as string}
          className={`mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`}
          onClick={onClose}
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
        onClick={onClose}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <span className="mobile-nav__label">{item.label}</span>
        {item.external && (
          <Icon name="external-link" className="mobile-nav__external" aria-hidden />
        )}
      </a>
    );
  };

  // Render navigation item
  const renderNavItem = (item: PrimaryNavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = isItemActive(item);

    return (
      <li key={item.id} className={`mobile-nav__item mobile-nav__item--level-${level}`}>
        {hasChildren ? (
          <>
            <button
              className={`mobile-nav__toggle ${isActive ? 'mobile-nav__toggle--active' : ''}`}
              onClick={() => toggleExpanded(item.id)}
              aria-expanded={isExpanded}
              aria-controls={`mobile-submenu-${item.id}`}
            >
              <span className="mobile-nav__label">{item.label}</span>
              <Icon 
                name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                className="mobile-nav__chevron"
                aria-hidden
              />
            </button>
            
            {isExpanded && (
              <ul 
                id={`mobile-submenu-${item.id}`}
                className={`mobile-nav__submenu mobile-nav__submenu--level-${level + 1}`}
              >
                {item.children!.map(child => renderNavItem(child, level + 1))}
              </ul>
            )}
          </>
        ) : (
          renderLeafLink(item, isActive)
        )}
      </li>
    );
  };

  return (
    <Drawer
        open={isOpen}
        onClose={onClose}
        side="bottom"
        size="l"
        dismissible={true}
        swipeToClose={true}
        backdrop={true}
        trapFocus={true}
        className={className}
        aria-label="Mobile navigation menu"
      >
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <Button
            iconOnly
            variant="ghost"
            size="m"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <Icon name="x" />
          </Button>
        </DrawerHeader>

        <DrawerBody>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <ul className="mobile-nav__list">
              {items.map(item => renderNavItem(item))}
            </ul>
          </nav>
        </DrawerBody>
      </Drawer>
  );
};

export default HeaderMobileMenu;
