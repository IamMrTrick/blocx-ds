import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import DatePickerClient from './Client';

export const metadata: Metadata = {
  title: 'DatePicker — Blocx',
  description: 'Demo of DatePicker component with various formats and configurations.',
};

export default function DatePickerDemoPage() {
  return (
    <main className="components components--date-picker" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">DatePicker</Heading>
        <DatePickerClient />
      </Section>
    </main>
  );
}
