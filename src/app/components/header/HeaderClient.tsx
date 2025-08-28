'use client';

import React from 'react';
import Link from 'next/link';
import { Header, HeaderMiddle, HeaderContainer, HeaderLeft, HeaderCenter, HeaderRight, HeaderLogo, HeaderSearch, HeaderActions, HeaderMobileToggle, HeaderNav, HeaderThemeSwitcher } from '@/components/header';

export default function HeaderClient() {
  const handleThemeChange = (theme: 'light' | 'dark') => {
    console.log('Theme changed to:', theme);
    // You can add additional logic here
  };

  return (
    <Header sticky centerMode>
      <HeaderMiddle>
        <HeaderContainer>
          <HeaderLeft>
            <HeaderLogo alt="Blocx" href="/" />
          </HeaderLeft>
          <HeaderCenter>
            <HeaderNav aria-label="Demo Nav">
              <Link href="/">Home</Link>
              <Link href="/components">Components</Link>
            </HeaderNav>
          </HeaderCenter>
          <HeaderRight>
            <HeaderSearch />
            <HeaderActions>
              <HeaderThemeSwitcher onThemeChange={handleThemeChange} />
              <HeaderMobileToggle isOpen={false} aria-controls="demo-nav" />
            </HeaderActions>
          </HeaderRight>
        </HeaderContainer>
      </HeaderMiddle>
    </Header>
  );
}
