import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Tabs, TabsList, Tab, TabsPanel } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Disclosures — Blocx',
  description: 'Demo of Accordion and Tabs components with states.',
};

export default function DisclosuresDemoPage() {
  return (
    <main className="components components--disclosures" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Disclosures</Heading>

        <Heading level={2} size="h4">Accordion</Heading>
        <Accordion allowMultiple variant="contained">
          <AccordionItem itemId="a" title="Accordion A">Content A</AccordionItem>
          <AccordionItem itemId="b" title="Accordion B">Content B</AccordionItem>
        </Accordion>

        <Heading level={2} size="h4">Tabs</Heading>
        <Tabs defaultValue="one" variant="underline">
          <TabsList ariaLabel="Demo tabs">
            <Tab tabId="one">One</Tab>
            <Tab tabId="two">Two</Tab>
          </TabsList>
          <TabsPanel tabId="one">Panel One</TabsPanel>
          <TabsPanel tabId="two">Panel Two</TabsPanel>
        </Tabs>
      </Section>
    </main>
  );
}


