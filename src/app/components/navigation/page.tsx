import React from 'react';
import type { Metadata } from 'next';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Breadcrumbs } from '@/components/ui/nav/breadcrumbs';
import { Pagination } from '@/components/ui/nav/pagination';
import { PrimaryNav } from '@/components/ui/nav/primary-nav';

export const metadata: Metadata = {
  title: 'Navigation — Blocx',
  description: 'Demo of navigation components: Breadcrumbs, Pagination, Primary Nav.',
};

export default function NavigationDemoPage() {
  return (
    <main className="components components--navigation" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Navigation</Heading>
        <Row gap="lg">
          <Col md={6}>
            <Heading level={2} size="h4">Breadcrumbs</Heading>
            <Breadcrumbs
              items={[
                { id: 'components', label: 'Components', href: '/components' },
                { id: 'navigation', label: 'Navigation' },
              ]}
            />
          </Col>
          <Col md={6}>
            <Heading level={2} size="h4">Pagination</Heading>
            <Pagination currentPage={2} totalPages={10} />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Heading level={2} size="h4">Primary Nav</Heading>
            <PrimaryNav
              items={[
                { id: 'home', label: 'Home', href: '/' },
                { id: 'components', label: 'Components', href: '/components' },
                { id: 'docs', label: 'Docs', href: '/docs' },
              ]}
            />
          </Col>
        </Row>
      </Section>
    </main>
  );
}


