'use client';
import React, { useState } from 'react';
import { Header, HeaderMiddle, HeaderContainer, HeaderLeft, HeaderLogo, HeaderCenter, HeaderRight, HeaderThemeSwitcherSimple } from './Header';
import { HeaderNavigation, HeaderMobileToggle } from './components';
import { useActiveNavigation } from './hooks/useActiveNavigation';



export interface HeaderWithMobileMenuProps {
  /** Custom className */
  className?: string;
  /** Header variant */
  variant?: 'default' | 'transparent' | 'minimal';
  /** Whether header should be sticky */
  sticky?: boolean;
  /** Whether to use center mode layout */
  centerMode?: boolean;
  /** When true, transparent variant only applies to desktop (>=769px) */
  desktopOnlyTransparent?: boolean;
  /** When true, transparent variant only applies to mobile (<=768px) */
  mobileOnlyTransparent?: boolean;
}

export const HeaderWithMobileMenu: React.FC<HeaderWithMobileMenuProps> = ({
  className = '',
  variant = 'default',
  sticky = false,
  centerMode = false,
  desktopOnlyTransparent = false,
  mobileOnlyTransparent = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeId = useActiveNavigation();

  const handleMobileMenuToggle = () => {
    console.log('Toggle clicked, current state:', isMobileMenuOpen);
    setIsMobileMenuOpen(prev => {
      const newState = !prev;
      console.log('New state:', newState);
      return newState;
    });
  };

  return (
    <Header className={className} variant={variant} sticky={sticky} centerMode={centerMode} desktopOnlyTransparent={desktopOnlyTransparent} mobileOnlyTransparent={mobileOnlyTransparent}>
      <HeaderMiddle>
        <HeaderContainer>
          <HeaderLeft>
            <HeaderLogo alt="Blocx" href="/" />
          </HeaderLeft>
          <HeaderCenter>
            <HeaderNavigation 
              activeId={activeId}
              isMobileMenuOpen={isMobileMenuOpen}
              onMobileMenuClose={() => setIsMobileMenuOpen(false)}
            />
          </HeaderCenter>
          <HeaderRight>
            <HeaderThemeSwitcherSimple />
            <HeaderMobileToggle
              isOpen={isMobileMenuOpen}
              onToggle={handleMobileMenuToggle}
              aria-controls="mobile-navigation-menu"
            />
          </HeaderRight>
        </HeaderContainer>
      </HeaderMiddle>
    </Header>
  );
};

export default HeaderWithMobileMenu;
