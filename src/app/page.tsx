import React from 'react';
import type { Metadata } from 'next';
import './page.scss';

import { LandingHero } from '@/components/landing';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Tabs, TabsList, Tab, TabsPanel } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Blocx Design System — Clean, accessible, token-driven UI',
  description:
    'Blocx is a clean, accessible, BEM-first design system with CSS tokens, responsive layouts, and reusable UI components for building consistent interfaces fast.',
};

export default function Home() {
  return (
    <main className="landing" role="main">
      <LandingHero
        title="Blocx Design System"
        subtitle="A practical, accessible, and scalable system for building consistent interfaces — powered by CSS Variables, clear BEM classes, and modern utilities."
        tags={["Accessible", "SSR-friendly", "BEM-first", "Token-driven"]}
        primaryCta={{ label: 'Get Started', href: '#what-is' }}
        secondaryCta={{ label: 'Browse Components', href: '#building-blocks' }}
      />

      {/* What is Blocx */}
      <Section variant="content" id="what-is" aria-labelledby="heading-what-is">
        <div className="landing__container">
          <Row justify="center">
            <Col md={10} lg={8}>
              <Heading id="heading-what-is" level={2} size="h3" className="landing__heading">What is Blocx?</Heading>
              <Text size="md" className="landing__copy">
                Blocx is a design system focusing on clarity, accessibility, and performance. It provides tokenized design primitives (colors, spacing, typography, radius, z-index, transitions),
                a semantic layout layer (Section / Row / Col), and a set of UI primitives that are BEM-first and utility-friendly.
              </Text>
            </Col>
          </Row>

          {/* Media placeholder row */}
          <Row gap="lg" gutter={false} className="landing__media-grid" aria-label="Media overview">
            <Col md={6}>
              <div className="media-card" aria-label="Tokens preview image placeholder" />
            </Col>
            <Col md={6}>
              <div className="media-card" aria-label="Components preview image placeholder" />
            </Col>
          </Row>
        </div>
      </Section>

      {/* Why BEM */}
      <Section variant="content" id="why-bem" aria-labelledby="heading-why-bem">
        <div className="landing__container">
          <Row justify="center">
            <Col md={10} lg={8}>
              <Heading id="heading-why-bem" level={2} size="h3" className="landing__heading">Why BEM?</Heading>
              <ul className="landing__list">
                <li><strong>Predictable naming</strong>: `.block__element--modifier` reduces ambiguity and encourages composition.</li>
                <li><strong>Low specificity</strong>: easier overrides, no need for `!important`, stable cascade.</li>
                <li><strong>Component boundaries</strong>: each component owns its styles; utilities add behavior, not override intent.</li>
                <li><strong>Scaling teams</strong>: consistent conventions reduce onboarding cost and code review friction.</li>
              </ul>
            </Col>
          </Row>
        </div>
      </Section>

      {/* Token Architecture */}
      <Section variant="content" id="tokens" aria-labelledby="heading-tokens">
        <div className="landing__container">
          <Row justify="center">
            <Col md={10} lg={8}>
              <Heading id="heading-tokens" level={2} size="h3" className="landing__heading">Token Architecture</Heading>
              <Text size="md" className="landing__copy">
                Blocx tokens are CSS Variables grouped by domain (colors, spacing, typography, radius, transitions, z-index). Layout variables like `--content-effective` and `--gutter-inline`
                ensure responsive containers without ad-hoc magic numbers. All components pull from these sources of truth.
              </Text>
            </Col>
          </Row>
          <Row gap="lg">
            <Col md={6} lg={4}>
              <Heading level={3} size="h4">Colors</Heading>
              <Text size="sm">Neutral + brand + semantic palettes with transparency ramps for states and effects.</Text>
            </Col>
            <Col md={6} lg={4}>
              <Heading level={3} size="h4">Typography</Heading>
              <Text size="sm">Readable, fluid scales mapped to component sizes and aliases.</Text>
            </Col>
            <Col md={6} lg={4}>
              <Heading level={3} size="h4">Layout</Heading>
              <Text size="sm">`--content-effective`, `--gutter-inline`, and section rhythm drive consistent spacing.</Text>
            </Col>
          </Row>
        </div>
      </Section>

      {/* Tabs Showcase */}
      <Section variant="content" id="features" aria-labelledby="heading-features">
        <div className="landing__container">
          <Row justify="center">
            <Col md={10} lg={8}>
              <Heading id="heading-features" level={2} size="h3" className="landing__heading">Explore Features</Heading>
              <Text size="md" className="landing__copy">Switch between tabs to preview how components can be organized.</Text>
            </Col>
          </Row>

          <Tabs defaultValue="tokens" variant="underline" aria-label="Feature examples">
            <TabsList ariaLabel="Feature tabs">
              <Tab tabId="tokens">Tokens</Tab>
              <Tab tabId="components">Components</Tab>
              <Tab tabId="layout">Layout</Tab>
            </TabsList>
            <TabsPanel tabId="tokens">
              <div className="landing__cards-grid">
                <Card padding="lg" shadow="sm"><Heading level={3} size="h5">Colors</Heading><Text size="sm">Brand + semantic + neutral scales.</Text></Card>
                <Card padding="lg" shadow="sm"><Heading level={3} size="h5">Typography</Heading><Text size="sm">Readable sizes with strong contrast.</Text></Card>
                <Card padding="lg" shadow="sm"><Heading level={3} size="h5">Spacing</Heading><Text size="sm">Consistent vertical rhythm.</Text></Card>
              </div>
            </TabsPanel>
            <TabsPanel tabId="components">
              <div className="landing__cards-grid">
                <Card padding="lg" shadow="sm"><Heading level={3} size="h5">Buttons</Heading><Text size="sm">Accessible states, solid/faint/ghost variants.</Text></Card>
                <Card padding="lg" shadow="sm"><Heading level={3} size="h5">Forms</Heading><Text size="sm">Inputs, selects, checkboxes, and more.</Text></Card>
                <Card padding="lg" shadow="sm"><Heading level={3} size="h5">Navigation</Heading><Text size="sm">Breadcrumbs, pagination, primary nav.</Text></Card>
              </div>
            </TabsPanel>
            <TabsPanel tabId="layout">
              <div className="landing__cards-grid">
                <Card padding="lg" shadow="sm"><Heading level={3} size="h5">Grid</Heading><Text size="sm">Row/Col with gutters and responsive spans.</Text></Card>
                <Card padding="lg" shadow="sm"><Heading level={3} size="h5">Sections</Heading><Text size="sm">Token-driven containers and spacing.</Text></Card>
                <Card padding="lg" shadow="sm"><Heading level={3} size="h5">Utilities</Heading><Text size="sm">Display, spacing, text, and more.</Text></Card>
              </div>
            </TabsPanel>
          </Tabs>
        </div>
      </Section>

      {/* Building Blocks */}
      <Section variant="content" id="building-blocks" aria-labelledby="heading-blocks">
        <div className="landing__container">
          <Row gap="lg">
            <Col md={6} lg={4}>
              <Heading id="heading-blocks" level={2} size="h3" className="landing__heading">Building Blocks</Heading>
              <Text size="sm" className="landing__copy">Core parts you will use everywhere.</Text>
            </Col>
          </Row>
          <Row gap="lg">
            <Col md={6} lg={4}>
              <Heading level={3} size="h4">Tokens</Heading>
              <Text size="sm">Colors, typography, spacing, radius, transitions, z-index.</Text>
              <Row gap="sm">
                <Col span="auto"><Badge>colors</Badge></Col>
                <Col span="auto"><Badge>typography</Badge></Col>
                <Col span="auto"><Badge>spacing</Badge></Col>
                <Col span="auto"><Badge>radius</Badge></Col>
              </Row>
            </Col>
            <Col md={6} lg={4}>
              <Heading level={3} size="h4">Layout</Heading>
              <Text size="sm">Compose pages with Section, Row, Col and consistent gutters.</Text>
              <Row gap="sm">
                <Col span="auto"><Badge>section</Badge></Col>
                <Col span="auto"><Badge>row</Badge></Col>
                <Col span="auto"><Badge>col</Badge></Col>
              </Row>
            </Col>
            <Col md={6} lg={4}>
              <Heading level={3} size="h4">UI Components</Heading>
              <Text size="sm">Beautiful, accessible primitives ready to drop into your app.</Text>
              <Row gap="sm">
                <Col span="auto"><Badge>button</Badge></Col>
                <Col span="auto"><Badge>badge</Badge></Col>
                <Col span="auto"><Badge>forms</Badge></Col>
                <Col span="auto"><Badge>navigation</Badge></Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="content" id="faq" aria-labelledby="heading-faq">
        <div className="landing__container landing__faq">
          <Heading id="heading-faq" level={2} size="h3" className="landing__heading">FAQ</Heading>
          <Accordion allowMultiple={true} variant="contained">
            <AccordionItem itemId="what-is-blocx" title="What is Blocx?">
              <Text size="sm">A token-driven, BEM-first design system for fast, consistent UI.</Text>
            </AccordionItem>
            <AccordionItem itemId="why-bem" title="Why BEM?">
              <Text size="sm">Predictable classnames, low specificity, and easier scaling across teams.</Text>
            </AccordionItem>
            <AccordionItem itemId="tokens" title="How do tokens work?">
              <Text size="sm">All components consume CSS Variables defined in the tokens layer.</Text>
            </AccordionItem>
          </Accordion>
        </div>
      </Section>

      {/* Principles */}
      <Section variant="content" id="principles" aria-labelledby="heading-principles">
        <div className="landing__container">
          <Row justify="center">
            <Col md={10} lg={8}>
              <Heading id="heading-principles" level={2} size="h3" className="landing__heading">Principles</Heading>
              <ul className="landing__list">
                <li><strong>Clarity over complexity</strong> — predictable classnames, low cognitive load.</li>
                <li><strong>Accessibility</strong> — focus rings, keyboard flows, readable scales.</li>
                <li><strong>Consistency</strong> — one source of truth with tokens and utilities.</li>
                <li><strong>Performance</strong> — lean CSS, SSR-friendly, no runtime styling overhead.</li>
              </ul>
            </Col>
          </Row>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="cta" id="cta" aria-labelledby="heading-cta">
        <div className="landing__container">
          <Row justify="center" align="center">
            <Col md={10} lg={8} className="landing__cta-box">
              <Heading id="heading-cta" level={2} size="h3">Build faster with Blocx</Heading>
              <Text size="md">Use the tokens, layouts, and components to ship clean UI with confidence.</Text>
              <div className="landing__cta">
                <Badge>docs</Badge>
                <Badge>examples</Badge>
              </div>
            </Col>
          </Row>
        </div>
      </Section>
    </main>
  );
}
