import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import ModalClient from './Client';

export const metadata: Metadata = {
  title: 'Modal — Blocx',
  description: 'Demo of Modal open/close behavior.',
};

export default function ModalDemoPage() {
  return (
    <main className="components components--modal" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Modal</Heading>
        <ModalClient />
      </Section>
    </main>
  );
}


