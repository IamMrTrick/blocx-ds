import React from 'react';
import type { Metadata } from 'next';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

export const metadata: Metadata = {
  title: 'Data Display — Blocx',
  description: 'Demo of data display components: Badge, Card, Icon.',
};

export default function DataDisplayDemoPage() {
  return (
    <main className="components components--data-display" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Data Display</Heading>

        <Row gap="lg">
          <Col md={6}>
            <Heading level={2} size="h4">Badges</Heading>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge>default</Badge>
              <Badge variant="success">success</Badge>
              <Badge variant="warning">warning</Badge>
              <Badge variant="error">error</Badge>
            </div>
          </Col>
          <Col md={6}>
            <Heading level={2} size="h4">Icons</Heading>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Icon name="check" />
              <Icon name="x" />
              <Icon name="alert-circle" />
            </div>
          </Col>
        </Row>

        <Heading level={2} size="h4">Cards</Heading>
        <Row gap="lg">
          <Col md={4}><Card><Heading level={3} size="h5">Card A</Heading><Text size="sm">Some text</Text></Card></Col>
          <Col md={4}><Card><Heading level={3} size="h5">Card B</Heading><Text size="sm">Some text</Text></Card></Col>
          <Col md={4}><Card><Heading level={3} size="h5">Card C</Heading><Text size="sm">Some text</Text></Card></Col>
        </Row>
      </Section>
    </main>
  );
}


