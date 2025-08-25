'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './Header.scss';

// ===== Header Base Component =====
export interface HeaderProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'transparent' | 'minimal';
  sticky?: boolean;
  centerMode?: boolean;
  onStickyChange?: (isSticky: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  children,
  className = '',
  variant = 'default',
  sticky = false,
  centerMode = false,
  onStickyChange,
}) => {
  const [isSticky, setIsSticky] = useState(false);

  // Handle sticky header on scroll
  useEffect(() => {
    if (!sticky) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newIsSticky = scrollY > 100;
      
      if (newIsSticky !== isSticky) {
        setIsSticky(newIsSticky);
        onStickyChange?.(newIsSticky);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky, isSticky, onStickyChange]);

  const headerClasses = [
    'header',
    `header--${variant}`,
    sticky && isSticky && 'header--sticky',
    centerMode && 'header--center-mode',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      
      <header className={headerClasses}>
        {children}
      </header>
    </>
  );
};

// ===== Header Top Bar =====
export interface HeaderTopProps {
  children: React.ReactNode;
  className?: string;
}

export const HeaderTop: React.FC<HeaderTopProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`header__top ${className}`.trim()}>
      {children}
    </div>
  );
};

// ===== Header Middle Bar =====
export interface HeaderMiddleProps {
  children: React.ReactNode;
  className?: string;
}

export const HeaderMiddle: React.FC<HeaderMiddleProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`header__middle ${className}`.trim()}>
      {children}
    </div>
  );
};

// ===== Header Bottom Bar =====
export interface HeaderBottomProps {
  children: React.ReactNode;
  className?: string;
}

export const HeaderBottom: React.FC<HeaderBottomProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`header__bottom ${className}`.trim()}>
      {children}
    </div>
  );
};

// ===== Header Container =====
export interface HeaderContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'top' | 'middle' | 'bottom';
}

export const HeaderContainer: React.FC<HeaderContainerProps> = ({
  children,
  className = '',
  variant = 'middle',
}) => {
  // Check if HeaderCenter exists in children
  const hasCenter = React.Children.toArray(children).some((child) => {
    return React.isValidElement(child) && 
           (child.type === HeaderCenter || 
            (typeof child.type === 'function' && child.type.name === 'HeaderCenter'));
  });

  const containerClasses = [
    'header__container',
    `header__container--${variant}`,
    hasCenter ? 'header__container--has-center' : 'header__container--no-center',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

// ===== Header Left Section =====
export interface HeaderLeftProps {
  children: React.ReactNode;
  className?: string;
}

export const HeaderLeft: React.FC<HeaderLeftProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`header__left ${className}`.trim()}>
      {children}
    </div>
  );
};

// ===== Header Center Section =====
export interface HeaderCenterProps {
  children: React.ReactNode;
  className?: string;
}

export const HeaderCenter: React.FC<HeaderCenterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`header__center ${className}`.trim()}>
      {children}
    </div>
  );
};

// ===== Header Right Section =====
export interface HeaderRightProps {
  children: React.ReactNode;
  className?: string;
}

export const HeaderRight: React.FC<HeaderRightProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`header__right ${className}`.trim()}>
      {children}
    </div>
  );
};

// ===== Header Logo =====
export interface HeaderLogoProps {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  src?: string;
  alt?: string;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({
  children,
  className = '',
  href = '/',
  src,
  alt = 'Logo',
}) => {
  return (
    <a href={href} className={`header__logo ${className}`.trim()}>
      {src ? (
        <Image src={src} alt={alt} className="header__logo-img" width={150} height={40} />
      ) : children ? (
        children
      ) : (
        <span className="header__logo-text">{alt}</span>
      )}
    </a>
  );
};

// ===== Header Search =====
export interface HeaderSearchProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  className = '',
  placeholder = 'Search...',
  onSearch,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
    }
  };

  return (
    <form 
      role="search" 
      className={`header__search ${className}`.trim()}
      onSubmit={handleSubmit}
    >
      <label htmlFor="header-search" className="sr-only">
        Search
      </label>
      <div className="header__search-input">
        <svg className="header__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="search"
          id="header-search"
          name="q"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="header__search-field"
        />
      </div>
    </form>
  );
};

// ===== Header Actions =====
export interface HeaderActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`header__actions ${className}`.trim()}>
      {children}
    </div>
  );
};

// ===== Header Mobile Toggle =====
export interface HeaderMobileToggleProps {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  'aria-controls'?: string;
}

export const HeaderMobileToggle: React.FC<HeaderMobileToggleProps> = ({
  className = '',
  isOpen = false,
  onToggle,
  'aria-controls': ariaControls,
}) => {
  return (
    <button
      className={`header__mobile-toggle ${className}`.trim()}
      aria-expanded={isOpen}
      aria-controls={ariaControls}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      onClick={onToggle}
    >
      <svg className="header__toggle-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        {isOpen ? (
          <>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </>
        ) : (
          <>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </>
        )}
      </svg>
    </button>
  );
};

// ===== Header Navigation =====
export interface HeaderNavProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
  id?: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  children,
  className = '',
  'aria-label': ariaLabel = 'Primary',
  id,
}) => {
  return (
    <nav 
      className={`header__nav ${className}`.trim()}
      aria-label={ariaLabel}
      id={id}
    >
      {children}
    </nav>
  );
};

export default Header;