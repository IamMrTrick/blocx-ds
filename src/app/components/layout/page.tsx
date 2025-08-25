import React from 'react';
import type { Metadata } from 'next';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export const metadata: Metadata = {
  title: 'Layout Components — Blocx',
  description: 'Demo of Section, Row, and Col layout primitives with responsive gutters.',
};

export default function LayoutDemoPage() {
  return (
    <main className="components components--layout" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Layout</Heading>
        <Text size="md">Section, Row and Col building blocks.</Text>
        <Row gap="lg">
          <Col md={6}>
            <div className="demo-box">md=6</div>
          </Col>
          <Col md={6}>
            <div className="demo-box">md=6</div>
          </Col>
        </Row>
        <Row gap="md">
          <Col md={4}><div className="demo-box">md=4</div></Col>
          <Col md={4}><div className="demo-box">md=4</div></Col>
          <Col md={4}><div className="demo-box">md=4</div></Col>
        </Row>
      </Section>
    </main>
  );
}


