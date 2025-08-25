import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import DrawerClient from './Client';

export const metadata: Metadata = {
  title: 'Drawer — Blocx',
  description: 'Demo of Drawer open/close behavior.',
};

export default function DrawerDemoPage() {
  return (
    <main className="components components--drawer" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Drawer</Heading>
        <DrawerClient />
      </Section>
    </main>
  );
}


