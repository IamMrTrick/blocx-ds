'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/ui/icon';
import './PrimaryNav.scss';

export interface PrimaryNavItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  badge?: string | number;
  children?: PrimaryNavItem[];
  disabled?: boolean;
  external?: boolean;
}

export interface NavProps {
  items: PrimaryNavItem[];
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'tabs' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  activeId?: string;
  onItemClick?: (item: PrimaryNavItem) => void;
  showIcons?: boolean;
  showBadges?: boolean;
  collapsible?: boolean;
  sticky?: boolean;
  // Dropdown behavior
  dropdownTrigger?: 'hover' | 'click';
  dropdownDelay?: number;
  // Layout options
  layout?: 'gap' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Nav: React.FC<NavProps> = ({
  items,
  className = '',
  variant = 'horizontal',
  size = 'md',
  activeId,
  onItemClick,
  showIcons = true,
  showBadges = true,
  collapsible = false,
  sticky = false,
  dropdownTrigger = 'click',
  dropdownDelay = 150,
  layout = 'gap',
  gap = 'md',
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdown when clicking outside (only for click trigger)
  useEffect(() => {
    if (dropdownTrigger === 'click') {
      const handleClickOutside = (event: MouseEvent) => {
        if (navRef.current && !navRef.current.contains(event.target as Node)) {
          setActiveDropdown(null);
          setOpenDropdowns(new Set());
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownTrigger]);

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Helper function to find siblings of an item
  const findSiblings = (targetId: string, itemsList: PrimaryNavItem[] = items, parentPath: string[] = []): string[] => {
    for (const item of itemsList) {
      if (item.id === targetId) {
        // Found the target item, return IDs of its siblings
        return itemsList.filter(sibling => sibling.id !== targetId && sibling.children && sibling.children.length > 0).map(sibling => sibling.id);
      }
      if (item.children) {
        const result = findSiblings(targetId, item.children, [...parentPath, item.id]);
        if (result.length > 0) {
          return result;
        }
      }
    }
    return [];
  };

  // Helper function to close children recursively
  const closeChildrenRecursively = (items: PrimaryNavItem[], openDropdowns: Set<string>) => {
    items.forEach(child => {
      openDropdowns.delete(child.id);
      if (child.children) {
        closeChildrenRecursively(child.children, openDropdowns);
      }
    });
  };

  const handleItemClick = (item: PrimaryNavItem, event: React.MouseEvent) => {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    const hasChildren = item.children && item.children.length > 0;

    if (dropdownTrigger === 'click' && hasChildren) {
      event.preventDefault();
      
      if (openDropdowns.has(item.id)) {
        // Close this dropdown and all its children recursively
        const newOpenDropdowns = new Set(openDropdowns);
        newOpenDropdowns.delete(item.id);
        if (item.children) {
          closeChildrenRecursively(item.children, newOpenDropdowns);
        }
        
        setOpenDropdowns(newOpenDropdowns);
        setActiveDropdown(newOpenDropdowns.size > 0 ? Array.from(newOpenDropdowns)[newOpenDropdowns.size - 1] : null);
      } else {
        // Close only sibling dropdowns, keep parent hierarchy
        const newOpenDropdowns = new Set(openDropdowns);
        const siblings = findSiblings(item.id);
        
        // Close siblings and their children
        siblings.forEach(siblingId => {
          newOpenDropdowns.delete(siblingId);
          // Find the sibling item to close its children
          const findAndCloseSibling = (itemsList: PrimaryNavItem[]) => {
            for (const searchItem of itemsList) {
              if (searchItem.id === siblingId && searchItem.children) {
                closeChildrenRecursively(searchItem.children, newOpenDropdowns);
                return;
              }
              if (searchItem.children) {
                findAndCloseSibling(searchItem.children);
              }
            }
          };
          findAndCloseSibling(items);
        });
        
        // Open this dropdown
        newOpenDropdowns.add(item.id);
        
        setOpenDropdowns(newOpenDropdowns);
        setActiveDropdown(item.id);
      }
      
    } else if (dropdownTrigger === 'hover' && hasChildren) {
      // For hover mode, clicking on parent should navigate if it has href
      if (item.href) {
        onItemClick?.(item);
      } else {
        event.preventDefault();
      }
    } else {
      // This is a leaf item (no children) - close all dropdowns and navigate
      if (item.href) {
        setActiveDropdown(null);
        setOpenDropdowns(new Set());
        onItemClick?.(item);
      } else {
        // Item without href and without children - just call onClick
        onItemClick?.(item);
      }
    }
  };

  const handleItemHover = (item: PrimaryNavItem) => {
    if (dropdownTrigger === 'hover' && item.children && item.children.length > 0) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      
      // For hover mode, close only sibling dropdowns, keep parent hierarchy
      const newOpenDropdowns = new Set(openDropdowns);
      const siblings = findSiblings(item.id);
      
      // Close siblings and their children
      siblings.forEach(siblingId => {
        newOpenDropdowns.delete(siblingId);
        // Find the sibling item to close its children
        const findAndCloseSibling = (itemsList: PrimaryNavItem[]) => {
          for (const searchItem of itemsList) {
            if (searchItem.id === siblingId && searchItem.children) {
              closeChildrenRecursively(searchItem.children, newOpenDropdowns);
              return;
            }
            if (searchItem.children) {
              findAndCloseSibling(searchItem.children);
            }
          }
        };
        findAndCloseSibling(items);
      });
      
      // Open this dropdown
      newOpenDropdowns.add(item.id);
      setActiveDropdown(item.id);
      setOpenDropdowns(newOpenDropdowns);
    }
  };

  const handleItemLeave = () => {
    if (dropdownTrigger === 'hover') {
      const timeout = setTimeout(() => {
        setActiveDropdown(null);
        setOpenDropdowns(new Set());
      }, dropdownDelay);
      setHoverTimeout(timeout);
    }
  };

  const handleDropdownEnter = () => {
    if (dropdownTrigger === 'hover' && hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleDropdownLeave = () => {
    if (dropdownTrigger === 'hover') {
      const timeout = setTimeout(() => {
        setActiveDropdown(null);
      }, dropdownDelay);
      setHoverTimeout(timeout);
    }
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
    setActiveDropdown(null);
    setOpenDropdowns(new Set());
  };

  const renderPrimaryNavItem = (item: PrimaryNavItem, level: number = 0) => {
    const isActive = activeId === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = dropdownTrigger === 'click' 
      ? openDropdowns.has(item.id)
      : activeDropdown === item.id;

    const itemClasses = [
      'nav__item',
      isActive && 'nav__item--active',
      item.disabled && 'nav__item--disabled',
      hasChildren && 'nav__item--has-children',
      isDropdownOpen && 'nav__item--dropdown-open',
      level > 0 && `nav__item--level-${level}`,
    ].filter(Boolean).join(' ');

    const linkClasses = [
      'nav__link',
      item.external && 'nav__link--external',
    ].filter(Boolean).join(' ');

    const LinkComponent = item.href ? 'a' : 'button';
    const linkProps = item.href 
      ? { 
          href: item.href,
          ...(item.external && { target: '_blank', rel: 'noopener noreferrer' })
        }
      : { type: 'button' as const };

    return (
      <li 
        key={item.id} 
        className={itemClasses}
        onMouseEnter={() => handleItemHover(item)}
        onMouseLeave={handleItemLeave}
      >
        <LinkComponent
          className={linkClasses}
          onClick={(e) => handleItemClick(item, e)}
          aria-expanded={hasChildren ? isDropdownOpen : undefined}
          aria-haspopup={hasChildren ? 'menu' : undefined}
          {...linkProps}
        >
          {showIcons && item.icon && (
            <Icon 
              name={item.icon} 
              className="nav__icon" 
              aria-hidden={true}
            />
          )}
          
          <span className="nav__label">{item.label}</span>
          
          {showBadges && item.badge && (
            <span className="nav__badge" aria-label={`${item.badge} notifications`}>
              {item.badge}
            </span>
          )}
          
          {hasChildren && (
            <Icon 
              name={isDropdownOpen ? 'chevron-up' : 'chevron-down'} 
              className="nav__chevron"
              aria-hidden={true}
            />
          )}
          
          {item.external && (
            <Icon 
              name="external-link" 
              className="nav__external-icon"
              aria-hidden={true}
            />
          )}
        </LinkComponent>

        {hasChildren && (
          <ul 
            className={`nav__dropdown ${isDropdownOpen ? 'nav__dropdown--open' : ''}`}
            role="menu"
            aria-label={`${item.label} submenu`}
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            {item.children?.map(child => renderPrimaryNavItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  const navClasses = [
    'nav',
    `nav--${variant}`,
    `nav--${size}`,
    `nav--layout-${layout}`,
    `nav--gap-${gap}`,
    `nav--trigger-${dropdownTrigger}`,
    sticky && 'nav--sticky',
    collapsed && 'nav--collapsed',
    className
  ].filter(Boolean).join(' ');

  return (
    <nav 
      ref={navRef}
      className={navClasses}
      role="navigation"
      aria-label="Primary navigation"
    >
      {collapsible && (
        <button
          className="nav__toggle"
          onClick={handleToggleCollapse}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          <Icon name={collapsed ? 'menu' : 'x'} />
        </button>
      )}

      <ul className="nav__list" role="menubar">
        {items.map(item => renderPrimaryNavItem(item))}
      </ul>
    </nav>
  );
};

export default Nav;
