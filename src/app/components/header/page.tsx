import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import HeaderSimple from './HeaderSimple';
import HeaderClient from './HeaderClient';

export const metadata: Metadata = {
  title: 'Header — Blocx',
  description: 'Demo of the Header layout and subcomponents.',
};

export default function HeaderDemoPage() {
  return (
    <main className="components components--header" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Header Components</Heading>
        <p>Demo of Header components with Theme Switcher integration.</p>
      </Section>
      
      <Section variant="content">
        <Heading level={2} size="h3">Simple Header (Server Component)</Heading>
        <p>Basic header with theme switcher - no callbacks needed.</p>
        <HeaderSimple />
      </Section>
      
      <Section variant="content">
        <Heading level={2} size="h3">Interactive Header (Client Component)</Heading>
        <p>Header with theme change callback for custom logic.</p>
        <HeaderClient />
      </Section>
    </main>
  );
}


