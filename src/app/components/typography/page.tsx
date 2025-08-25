import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export const metadata: Metadata = {
  title: 'Typography — Blocx',
  description: 'Demo of Heading and Text components with sizes and semantics.',
};

export default function TypographyDemoPage() {
  return (
    <main className="components components--typography" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Typography</Heading>
        <Heading level={2} size="h3">Headings</Heading>
        <Heading level={1} size="h1">H1 Heading</Heading>
        <Heading level={2} size="h2">H2 Heading</Heading>
        <Heading level={3} size="h3">H3 Heading</Heading>
        <Heading level={4} size="h4">H4 Heading</Heading>
        <Heading level={5} size="h5">H5 Heading</Heading>
        <Heading level={6} size="h6">H6 Heading</Heading>

        <Heading level={2} size="h3">Text</Heading>
        <Text size="sm">Small text size</Text>
        <Text size="md">Medium text size</Text>
        <Text size="lg">Large text size</Text>
      </Section>
    </main>
  );
}


