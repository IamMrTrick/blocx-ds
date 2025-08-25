import React from 'react';
import type { Metadata } from 'next';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

export const metadata: Metadata = {
  title: 'Card — Blocx',
  description: 'Demo of Card paddings, shadows, and states.',
};

export default function CardDemoPage() {
  return (
    <main className="components components--card" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Card</Heading>
        <Row gap="lg">
          <Col md={4}><Card padding="lg" shadow="sm"><Heading level={3} size="h5">Card A</Heading><Text size="sm">Small shadow</Text></Card></Col>
          <Col md={4}><Card padding="lg" shadow="md"><Heading level={3} size="h5">Card B</Heading><Text size="sm">Medium shadow</Text></Card></Col>
          <Col md={4}><Card padding="lg" shadow="lg"><Heading level={3} size="h5">Card C</Heading><Text size="sm">Large shadow</Text></Card></Col>
        </Row>
      </Section>
    </main>
  );
}


