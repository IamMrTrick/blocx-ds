import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Accordion, AccordionItem } from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'Accordion — Blocx',
  description: 'Demo of Accordion with contained variant.',
};

export default function AccordionDemoPage() {
  return (
    <main className="components components--accordion" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Accordion</Heading>
        <Accordion allowMultiple variant="contained">
          <AccordionItem itemId="a" title="Section A">Content A</AccordionItem>
          <AccordionItem itemId="b" title="Section B">Content B</AccordionItem>
        </Accordion>
      </Section>
    </main>
  );
}


