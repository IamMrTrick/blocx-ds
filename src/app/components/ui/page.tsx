import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export const metadata: Metadata = {
  title: 'UI Components — Blocx',
  description: 'Per-component demos: Button, Badge, Card, Icon, Text, Accordion, Tabs, Drawer, Modal, Toast, Nav, etc.',
};

const pages = [
  { href: '/components/ui/button', title: 'Button' },
  { href: '/components/ui/badge', title: 'Badge' },
  { href: '/components/ui/card', title: 'Card' },
  { href: '/components/ui/icon', title: 'Icon' },
  { href: '/components/ui/text', title: 'Text' },
  { href: '/components/ui/accordion', title: 'Accordion' },
  { href: '/components/ui/tabs', title: 'Tabs' },
  { href: '/components/ui/modal', title: 'Modal' },
  { href: '/components/ui/drawer', title: 'Drawer' },
  { href: '/components/ui/toast', title: 'Toast' },
  { href: '/components/ui/nav', title: 'Navigation' },
];

export default function UIIndexPage() {
  return (
    <main className="components components--ui" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">UI Components</Heading>
        <Text size="md">Pick a component to view its dedicated demo page.</Text>
        <Row gap="lg">
          {pages.map((p) => (
            <Col key={p.href} md={6} lg={4}>
              <Heading level={3} size="h4"><Link href={p.href}>{p.title}</Link></Heading>
            </Col>
          ))}
        </Row>
      </Section>
    </main>
  );
}


