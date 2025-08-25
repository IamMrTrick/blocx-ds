import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export const metadata: Metadata = {
  title: 'Text — Blocx',
  description: 'Demo of Text sizes and weights.',
};

export default function TextDemoPage() {
  return (
    <main className="components components--text" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Text</Heading>
        <Text size="sm">Small text</Text>
        <Text size="md">Medium text</Text>
        <Text size="lg">Large text</Text>
        <Text weight="bold">Bold text</Text>
      </Section>
    </main>
  );
}


