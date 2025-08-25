import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import FeedbackClient from './page.client';

export const metadata: Metadata = {
  title: 'Feedback — Blocx',
  description: 'Demo of feedback components: Modal and Toast.',
};

export default function FeedbackDemoPage() {
  return (
    <main className="components components--feedback" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Feedback</Heading>
        <FeedbackClient />
      </Section>
    </main>
  );
}


