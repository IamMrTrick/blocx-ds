import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import TimePickerClient from './Client';

export const metadata: Metadata = {
  title: 'TimePicker — Blocx',
  description: 'Demo of TimePicker component with 12h/24h formats and various configurations.',
};

export default function TimePickerDemoPage() {
  return (
    <main className="components components--time-picker" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">TimePicker</Heading>
        <TimePickerClient />
      </Section>
    </main>
  );
}
