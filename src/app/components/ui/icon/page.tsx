import React from 'react';
import type { Metadata } from 'next';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Icon } from '@/components/ui/icon';

export const metadata: Metadata = {
  title: 'Icon — Blocx',
  description: 'Demo of Icon sizes and colors.',
};

export default function IconDemoPage() {
  return (
    <main className="components components--icon" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Icon</Heading>
        <Row gap="lg">
          <Col md={6}>
            <Heading level={2} size="h4">Sizes</Heading>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Icon name="star" size="xs" />
              <Icon name="star" size="sm" />
              <Icon name="star" size="md" />
              <Icon name="star" size="lg" />
              <Icon name="star" size="xl" />
              <Icon name="star" size="h4" />
            </div>
          </Col>
          <Col md={6}>
            <Heading level={2} size="h4">Colors</Heading>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Icon name="heart" color="primary" />
              <Icon name="heart" color="secondary" />
              <Icon name="heart" color="success" />
              <Icon name="heart" color="warning" />
              <Icon name="heart" color="error" />
            </div>
          </Col>
        </Row>
      </Section>
    </main>
  );
}


