import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Header, HeaderMiddle, HeaderContainer, HeaderLeft, HeaderCenter, HeaderRight, HeaderLogo, HeaderSearch, HeaderActions, HeaderMobileToggle, HeaderNav } from '@/components/header';

export const metadata: Metadata = {
  title: 'Header — Blocx',
  description: 'Demo of the Header layout and subcomponents.',
};

export default function HeaderDemoPage() {
  return (
    <main className="components components--header" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Header</Heading>
      </Section>
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
                <HeaderMobileToggle isOpen={false} aria-controls="demo-nav" />
              </HeaderActions>
            </HeaderRight>
          </HeaderContainer>
        </HeaderMiddle>
      </Header>
    </main>
  );
}


