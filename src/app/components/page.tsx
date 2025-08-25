import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Components — Blocx Design System',
  description: 'Comprehensive collection of production-ready UI components organized by category with live examples and documentation.',
};

const componentCategories = [
  {
    id: 'layout',
    title: 'Layout',
    description: 'Structural components for building consistent page layouts and content organization.',
    href: '/components/layout',
    count: 5,
    badge: 'Structure',
    components: ['Section', 'Row', 'Col', 'Main', 'Aside']
  },
  {
    id: 'typography',
    title: 'Typography',
    description: 'Text components with semantic styling and consistent visual hierarchy.',
    href: '/components/typography',
    count: 2,
    badge: 'Content',
    components: ['Heading', 'Text']
  },
  {
    id: 'forms',
    title: 'Forms',
    description: 'Complete form controls with validation, accessibility, and modern interactions.',
    href: '/components/forms',
    count: 10,
    badge: 'Input',
    components: ['Input', 'TextArea', 'Select', 'Checkbox', 'Radio', 'Switcher', 'OTP', 'Date Picker', 'Time Picker', 'Form']
  },
  {
    id: 'actions',
    title: 'Actions',
    description: 'Interactive elements that trigger actions and state changes.',
    href: '/components/actions',
    count: 2,
    badge: 'Interactive',
    components: ['Button', 'Icon Button']
  },
  {
    id: 'navigation',
    title: 'Navigation',
    description: 'Components for site navigation, content organization, and user journey guidance.',
    href: '/components/navigation',
    count: 4,
    badge: 'Navigation',
    components: ['Primary Nav', 'Breadcrumbs', 'Pagination', 'Tabs']
  },
  {
    id: 'disclosure',
    title: 'Disclosure',
    description: 'Components that reveal or hide content with smooth interactions.',
    href: '/components/disclosure',
    count: 3,
    badge: 'Interactive',
    components: ['Modal', 'Drawer', 'Accordion']
  },
  {
    id: 'feedback',
    title: 'Feedback',
    description: 'Components for status communication, notifications, and user feedback.',
    href: '/components/feedback',
    count: 2,
    badge: 'Feedback',
    components: ['Toast', 'Badge']
  },
  {
    id: 'data-display',
    title: 'Data Display',
    description: 'Components for presenting information in clear, organized formats.',
    href: '/components/data-display',
    count: 2,
    badge: 'Display',
    components: ['Card', 'Icon']
  }
];

export default function ComponentsIndexPage() {
  return (
    <main className="components-index" role="main">
      {/* Hero Section */}
      <Section variant="content">
        <Row justify="center">
          <Col md={10} lg={8}>
            <div className="components-index__header">
              <Heading level={1} size="h1" className="text-center">
                Component Library
              </Heading>
              <Text size="lg" className="text-center components-index__description">
                Production-ready UI components built with accessibility, performance, and developer experience in mind.
                Each component includes comprehensive documentation, usage examples, and API references.
              </Text>
              <div className="components-index__stats">
                <Badge variant="primary" size="l">25+ Components</Badge>
                <Badge variant="secondary" size="l">8 Categories</Badge>
                <Badge variant="info" size="l">TypeScript</Badge>
                <Badge variant="success" size="l">Accessible</Badge>
              </div>
            </div>
          </Col>
        </Row>
      </Section>

      {/* Categories Grid */}
      <Section variant="content" background="secondary">
        <Row justify="center">
          <Col span={12}>
            <Heading level={2} size="h2" className="text-center components-index__section-title">
              Organized by Category
            </Heading>
            <Text size="md" className="text-center components-index__section-description">
              Components are thoughtfully organized into categories for easy discovery and implementation.
            </Text>
          </Col>
        </Row>

        <Row gap="lg" className="components-index__categories">
          {componentCategories.map((category) => (
            <Col key={category.id} md={6} lg={4}>
              <Card padding="xl" shadow="sm" className="components-index__category-card">
                <div className="components-index__category-header">
                  <div className="components-index__category-meta">
                    <Badge variant="secondary" size="s">{category.badge}</Badge>
                    <Badge variant="neutral" size="s">{category.count} components</Badge>
                  </div>
                  <Heading level={3} size="h4" className="components-index__category-title">
                    {category.title}
                  </Heading>
                  <Text size="sm" className="components-index__category-description">
                    {category.description}
                  </Text>
                </div>
                
                <div className="components-index__category-components">
                  {category.components.slice(0, 5).map((component) => (
                    <Badge key={component} size="xs" variant="neutral">
                      {component}
                    </Badge>
                  ))}
                  {category.components.length > 5 && (
                    <Badge size="xs" variant="neutral">
                      +{category.components.length - 5} more
                    </Badge>
                  )}
                </div>
                
                <Link href={category.href} className="components-index__category-link">
                  <Button variant="ghost" size="s">
                    Explore {category.title} →
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </Section>

      {/* Quick Access */}
      <Section variant="content">
        <Row justify="center">
          <Col md={10} lg={8}>
            <div className="components-index__quick-access">
              <Heading level={2} size="h3" className="text-center">
                Quick Access
              </Heading>
              <Text size="md" className="text-center components-index__quick-description">
                Jump directly to specific components or explore by usage patterns.
              </Text>
              
              <div className="components-index__quick-links">
                <Link href="/components/ui/button">
                  <Button variant="primary" size="l">Browse All Components</Button>
                </Link>
                <Link href="/foundations">
                  <Button variant="ghost" size="l">Design Foundations</Button>
                </Link>
                <Link href="/playground">
                  <Button variant="secondary" size="l">Try Playground</Button>
                </Link>
              </div>
              
              <div className="components-index__popular">
                <Text size="sm" className="components-index__popular-label">Popular components:</Text>
                <div className="components-index__popular-links">
                  <Link href="/components/ui/button"><Badge variant="primary">Button</Badge></Link>
                  <Link href="/components/ui/card"><Badge variant="primary">Card</Badge></Link>
                  <Link href="/components/ui/modal"><Badge variant="primary">Modal</Badge></Link>
                  <Link href="/components/ui/input"><Badge variant="primary">Input</Badge></Link>
                  <Link href="/components/ui/badge"><Badge variant="primary">Badge</Badge></Link>
                </div>
        </div>
      </div>
          </Col>
        </Row>
      </Section>
    </main>
  );
}


