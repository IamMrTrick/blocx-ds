import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Tabs, TabsList, Tab, TabsPanel } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Tabs — Blocx',
  description: 'Demo of Tabs with underline variant.',
};

export default function TabsDemoPage() {
  return (
    <main className="components components--tabs" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Tabs</Heading>
        <Tabs defaultValue="one" variant="underline">
          <TabsList ariaLabel="Example tabs">
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


