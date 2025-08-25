import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import ToastClient from './Client';

export const metadata: Metadata = {
  title: 'Toast — Blocx',
  description: 'Demo of Toast notifications with provider in layout.',
};

export default function ToastDemoPage() {
  return (
    <main className="components components--toast" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Toast</Heading>
        <ToastClient />
      </Section>
    </main>
  );
}


