import React from 'react';
import type { Metadata } from 'next';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';

export const metadata: Metadata = {
  title: 'Badge — Blocx',
  description: 'Demo of Badge variants, shapes, and sizes.',
};

export default function BadgeDemoPage() {
  return (
    <main className="components components--badge" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Badge</Heading>
        <Row gap="lg">
          <Col md={6}>
            <Heading level={2} size="h4">Variants</Heading>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge>primary</Badge>
              <Badge variant="secondary">secondary</Badge>
              <Badge variant="success">success</Badge>
              <Badge variant="warning">warning</Badge>
              <Badge variant="error">error</Badge>
              <Badge variant="info">info</Badge>
              <Badge variant="neutral">neutral</Badge>
            </div>
          </Col>
          <Col md={6}>
            <Heading level={2} size="h4">Shapes & Icons</Heading>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge shape="pill"><Icon name="check" /> verified</Badge>
              <Badge shape="rounded"><Icon name="alert-circle" /> alert</Badge>
              <Badge shape="square" removable>tag</Badge>
            </div>
          </Col>
        </Row>
      </Section>
    </main>
  );
}


