import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { PrimaryNav } from '@/components/ui/nav/primary-nav';

export const metadata: Metadata = {
  title: 'Navigation (Primary) — Blocx',
  description: 'Demo of PrimaryNav with simple items.',
};

export default function NavDemoPage() {
  return (
    <main className="components components--nav" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">PrimaryNav</Heading>
        <PrimaryNav
          items={[
            { id: 'home', label: 'Home', href: '/' },
            { id: 'components', label: 'Components', href: '/components' },
            { id: 'docs', label: 'Docs', href: '/docs' },
          ]}
        />
      </Section>
    </main>
  );
}


