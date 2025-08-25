import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import './page.scss';

import { LandingHero } from '@/components/landing';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

import { Tabs, TabsList, Tab, TabsPanel } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Blocx Design System — Modern, Elegant, Token-Driven UI',
  description:
    'Blocx is a modern, elegant design system featuring comprehensive components, design tokens, and beautiful templates for building exceptional user interfaces.',
};

export default function Home() {
  return (
    <main className="landing" role="main">
      {/* Hero Section */}
      <LandingHero
        title="Blocx Design System"
        subtitle="Build exceptional user interfaces with our comprehensive design system featuring elegant components, thoughtful design tokens, and seamless developer experience."
        tags={["Modern", "Accessible", "Token-driven", "BEM Methodology"]}
        primaryCta={{ label: 'Explore Components', href: '/components' }}
        secondaryCta={{ label: 'View Foundations', href: '/foundations' }}
      />

      {/* Features Overview */}
      <Section variant="content" id="features" aria-labelledby="heading-features">
        <div className="landing__container">
          <Row justify="center">
            <Col md={10} lg={8} className="text-center">
              <Heading id="heading-features" level={2} size="h2" className="landing__heading">
                Everything you need to build beautiful interfaces
              </Heading>
              <Text size="lg" className="landing__copy">
                From foundational design tokens to complex components, Blocx provides a complete toolkit for modern web development.
              </Text>
            </Col>
          </Row>

          <Row gap="lg" className="landing__feature-cards">
            <Col md={6} lg={4}>
              <Card padding="xl" shadow="md" className="landing__feature-card">
                <div className="landing__feature-icon">
                  <Badge variant="primary"><Icon name="palette" /></Badge>
                </div>
                <Heading level={3} size="h4">Design Foundations</Heading>
                <Text size="md">Comprehensive design tokens including colors, typography, spacing, and more for consistent visual design.</Text>
                <Link href="/foundations" className="landing__feature-link">
                  <Button variant="ghost" size="s">Explore Foundations →</Button>
                </Link>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card padding="xl" shadow="md" className="landing__feature-card">
                <div className="landing__feature-icon">
                  <Badge variant="secondary"><Icon name="grid-3x3" /></Badge>
                </div>
                <Heading level={3} size="h4">Rich Components</Heading>
                <Text size="md">Over 25 production-ready components organized by category with extensive customization options.</Text>
                <Link href="/components" className="landing__feature-link">
                  <Button variant="ghost" size="s">Browse Components →</Button>
                </Link>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card padding="xl" shadow="md" className="landing__feature-card">
                <div className="landing__feature-icon">
                  <Badge variant="info"><Icon name="code" /></Badge>
                </div>
                <Heading level={3} size="h4">Developer Experience</Heading>
                <Text size="md">TypeScript support, excellent documentation, and a powerful playground for rapid prototyping.</Text>
                <Link href="/playground" className="landing__feature-link">
                  <Button variant="ghost" size="s">Try Playground →</Button>
                </Link>
              </Card>
            </Col>
          </Row>
        </div>
      </Section>

      {/* Component Categories */}
      <Section variant="content" id="component-categories" background="surface-secondary" aria-labelledby="heading-categories">
        <div className="landing__container">
          <Row justify="center">
            <Col md={10} lg={8} className="text-center">
              <Heading id="heading-categories" level={2} size="h2" className="landing__heading">
                Organized Component Library
              </Heading>
              <Text size="lg" className="landing__copy">
                Components are thoughtfully categorized for easy discovery and implementation.
              </Text>
            </Col>
          </Row>

          <Tabs defaultValue="layout" variant="underline" aria-label="Component categories">
            <TabsList ariaLabel="Component category tabs" className="landing__tabs-list">
              <Tab tabId="layout">Layout</Tab>
              <Tab tabId="forms">Forms</Tab>
              <Tab tabId="actions">Actions</Tab>
              <Tab tabId="navigation">Navigation</Tab>
              <Tab tabId="feedback">Feedback</Tab>
              <Tab tabId="disclosure">Disclosure</Tab>
            </TabsList>
            
            <TabsPanel tabId="layout">
              <div className="landing__component-grid">
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Section</Heading>
                  <Text size="sm">Semantic container with consistent spacing and background variants</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Container</Badge>
                    <Badge size="s">Semantic</Badge>
                  </div>
                </Card>
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Row & Col</Heading>
                  <Text size="sm">Flexible grid system with responsive breakpoints and gutters</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Grid</Badge>
                    <Badge size="s">Responsive</Badge>
                  </div>
                </Card>
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Main & Aside</Heading>
                  <Text size="sm">Structural layout components for page architecture</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Structure</Badge>
                    <Badge size="s">Semantic</Badge>
                  </div>
                </Card>
              </div>
            </TabsPanel>

            <TabsPanel tabId="forms">
              <div className="landing__component-grid">
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Input & TextArea</Heading>
                  <Text size="sm">Accessible form inputs with validation states and helper text</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Accessible</Badge>
                    <Badge size="s">Validation</Badge>
                  </div>
                </Card>
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Select & Multi-Select</Heading>
                  <Text size="sm">Custom dropdown components with search and multi-selection</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Dropdown</Badge>
                    <Badge size="s">Search</Badge>
                  </div>
                </Card>
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Checkbox & Radio</Heading>
                  <Text size="sm">Form controls with custom styling and group management</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Control</Badge>
                    <Badge size="s">Groups</Badge>
                  </div>
                </Card>
              </div>
            </TabsPanel>

            <TabsPanel tabId="actions">
              <div className="landing__component-grid">
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Button</Heading>
                  <Text size="sm">Multiple variants, sizes, and states for all interaction needs</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Variants</Badge>
                    <Badge size="s">States</Badge>
                  </div>
                </Card>
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Icon Button</Heading>
                  <Text size="sm">Compact buttons for actions with clear iconography</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Icons</Badge>
                    <Badge size="s">Compact</Badge>
                  </div>
                </Card>
              </div>
            </TabsPanel>

            <TabsPanel tabId="navigation">
              <div className="landing__component-grid">
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Primary Nav</Heading>
                  <Text size="sm">Responsive navigation with dropdown menus and active states</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Responsive</Badge>
                    <Badge size="s">Dropdown</Badge>
                  </div>
                </Card>
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Breadcrumbs</Heading>
                  <Text size="sm">Navigation trail for hierarchical content structure</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Hierarchy</Badge>
                    <Badge size="s">Trail</Badge>
                  </div>
                </Card>
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Tabs</Heading>
                  <Text size="sm">Content organization with multiple styling variants</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Content</Badge>
                    <Badge size="s">Variants</Badge>
                  </div>
                </Card>
              </div>
            </TabsPanel>

            <TabsPanel tabId="feedback">
              <div className="landing__component-grid">
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Toast</Heading>
                  <Text size="sm">Temporary notifications with different message types</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Notification</Badge>
                    <Badge size="s">Temporary</Badge>
                  </div>
                </Card>
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Badge</Heading>
                  <Text size="sm">Status indicators and labels with semantic colors</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Status</Badge>
                    <Badge size="s">Labels</Badge>
                  </div>
                </Card>
              </div>
            </TabsPanel>

            <TabsPanel tabId="disclosure">
              <div className="landing__component-grid">
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Modal</Heading>
                  <Text size="sm">Overlays for focused interactions with backdrop and escape handling</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Overlay</Badge>
                    <Badge size="s">Focus</Badge>
                  </div>
                </Card>
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Drawer</Heading>
                  <Text size="sm">Side panels for navigation and content with smooth animations</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Panel</Badge>
                    <Badge size="s">Animation</Badge>
                  </div>
                </Card>
                <Card padding="lg" shadow="sm">
                  <Heading level={4} size="h5">Accordion</Heading>
                  <Text size="sm">Expandable content sections with single or multiple open states</Text>
                  <div className="landing__component-tags">
                    <Badge size="s">Expandable</Badge>
                    <Badge size="s">Content</Badge>
                  </div>
                </Card>
              </div>
            </TabsPanel>
          </Tabs>
        </div>
      </Section>

      {/* Design Principles */}
      <Section variant="content" id="principles" aria-labelledby="heading-principles">
        <div className="landing__container">
          <Row justify="center">
            <Col md={10} lg={8} className="text-center">
              <Heading id="heading-principles" level={2} size="h2" className="landing__heading">
                Built on Solid Principles
              </Heading>
              <Text size="lg" className="landing__copy">
                Every component and token follows our core principles for sustainable design systems.
              </Text>
            </Col>
          </Row>

          <Row gap="lg">
                        <Col md={6} lg={3}>
              <div className="landing__principle">
                <div className="landing__principle-icon">
                  <Badge variant="primary" size="l"><Icon name="shield-check" /></Badge>
                </div>
                <Heading level={3} size="h4">Accessibility First</Heading>
                <Text size="sm">WCAG compliant components with proper ARIA attributes, keyboard navigation, and screen reader support.</Text>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="landing__principle">
                <div className="landing__principle-icon">
                  <Badge variant="secondary" size="l"><Icon name="layers" /></Badge>
                </div>
                <Heading level={3} size="h4">BEM Methodology</Heading>
                <Text size="sm">Predictable CSS class naming that scales well across teams and reduces stylesheet conflicts.</Text>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="landing__principle">
                <div className="landing__principle-icon">
                  <Badge variant="info" size="l"><Icon name="zap" /></Badge>
                </div>
                <Heading level={3} size="h4">Performance</Heading>
                <Text size="sm">Optimized for fast loading with minimal runtime overhead and efficient CSS delivery.</Text>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="landing__principle">
                <div className="landing__principle-icon">
                  <Badge variant="warning" size="l"><Icon name="settings" /></Badge>
                </div>
                <Heading level={3} size="h4">Developer Experience</Heading>
                <Text size="sm">TypeScript support, comprehensive documentation, and intuitive APIs that make development enjoyable.</Text>
        </div>
            </Col>
          </Row>
        </div>
      </Section>

      {/* Getting Started CTA */}
      <Section variant="cta" id="get-started" aria-labelledby="heading-get-started">
        <div className="landing__container">
          <Row justify="center" align="center">
            <Col md={10} lg={8} className="text-center">
              <Heading id="heading-get-started" level={2} size="h2">
                Ready to build something amazing?
              </Heading>
              <Text size="lg" className="landing__cta-text">
                Start exploring our components and design tokens to create beautiful, consistent user interfaces.
              </Text>
              <div className="landing__cta-actions">
                <Link href="/components">
                  <Button variant="primary" size="l">Browse All Components</Button>
                </Link>
                <Link href="/foundations">
                  <Button variant="ghost" size="l">View Design Tokens</Button>
                </Link>
              </div>
              <div className="landing__cta-badges">
                <Badge>25+ Components</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Accessible</Badge>
                <Badge>BEM Methodology</Badge>
              </div>
            </Col>
          </Row>
        </div>
      </Section>
    </main>
  );
}
