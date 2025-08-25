import React from 'react';
import type { Metadata } from 'next';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export const metadata: Metadata = {
  title: 'Button — Blocx',
  description: 'Demo of Button variants, sizes, and icon-only buttons.',
};

export default function ButtonDemoPage() {
  return (
    <main className="components components--button" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Button</Heading>
        <Row gap="lg">
          <Col md={6}>
            <Heading level={2} size="h4">Variants</Heading>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="error">Error</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </Col>
          <Col md={6}>
            <Heading level={2} size="h4">Sizes & Icons</Heading>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button size="xs"><Icon name="star" /> XS</Button>
              <Button size="s"><Icon name="star" /> S</Button>
              <Button size="m"><Icon name="star" /> M</Button>
              <Button size="l"><Icon name="star" /> L</Button>
              <Button size="xl"><Icon name="star" /> XL</Button>
              <Button iconOnly aria-label="Search"><Icon name="search" /></Button>
            </div>
          </Col>
        </Row>
      </Section>
    </main>
  );
}


