import React from 'react';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import { Tabs, TabsList, Tab, TabsPanel } from '@/components/ui/tabs';
import './ComponentShowcase.scss';

export interface ComponentShowcaseProps {
  title: string;
  description: string;
  category?: string;
  children: React.ReactNode;
  examples?: {
    id: string;
    title: string;
    description?: string;
    component: React.ReactNode;
    code?: string;
  }[];
  props?: {
    name: string;
    type: string;
    required?: boolean;
    default?: string;
    description: string;
  }[];
}

export const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({
  title,
  description,
  category,
  children,
  examples = [],
  props = [],
}) => {
  return (
    <main className="component-showcase" role="main">
      {/* Hero Section */}
      <Section variant="content" className="component-showcase__hero">
        <Row justify="center">
          <Col md={10} lg={8}>
            <div className="component-showcase__header">
              {category && (
                <div className="component-showcase__category">
                  <Badge variant="secondary" size="s">{category}</Badge>
                </div>
              )}
              <Heading level={1} size="h1" className="component-showcase__title">
                {title}
              </Heading>
              <Text size="lg" className="component-showcase__description">
                {description}
              </Text>
            </div>
          </Col>
        </Row>
      </Section>

      {/* Main Content */}
      <Section variant="content">
        <div className="component-showcase__content">
          {/* Basic Usage */}
          <Row justify="center">
            <Col span={12}>
              <div className="component-showcase__demo-container">
                <Heading level={2} size="h3" className="component-showcase__section-title">
                  Overview
                </Heading>
                <Card padding="xl" shadow="sm" className="component-showcase__demo">
                  {children}
                </Card>
              </div>
            </Col>
          </Row>

          {/* Examples & Documentation */}
          {(examples.length > 0 || props.length > 0) && (
            <Row justify="center">
              <Col span={12}>
                <Tabs defaultValue={examples.length > 0 ? "examples" : "props"} variant="underline">
                  <TabsList ariaLabel="Component documentation tabs">
                    {examples.length > 0 && <Tab tabId="examples">Examples</Tab>}
                    {props.length > 0 && <Tab tabId="props">Props</Tab>}
                  </TabsList>

                  {examples.length > 0 && (
                    <TabsPanel tabId="examples">
                      <div className="component-showcase__examples">
                        {examples.map((example) => (
                          <div key={example.id} className="component-showcase__example">
                            <div className="component-showcase__example-header">
                              <Heading level={3} size="h4">{example.title}</Heading>
                              {example.description && (
                                <Text size="sm" className="component-showcase__example-description">
                                  {example.description}
                                </Text>
                              )}
                            </div>
                            <Card padding="lg" shadow="sm" className="component-showcase__example-demo">
                              {example.component}
                            </Card>
                            {example.code && (
                              <Card padding="md" className="component-showcase__code">
                                <pre><code>{example.code}</code></pre>
                              </Card>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsPanel>
                  )}

                  {props.length > 0 && (
                    <TabsPanel tabId="props">
                      <div className="component-showcase__props">
                        <div className="component-showcase__props-table">
                          <div className="component-showcase__props-header">
                            <div>Name</div>
                            <div>Type</div>
                            <div>Default</div>
                            <div>Description</div>
                          </div>
                          {props.map((prop) => (
                            <div key={prop.name} className="component-showcase__props-row">
                              <div className="component-showcase__prop-name">
                                <code>{prop.name}</code>
                                {prop.required && <Badge size="xs" variant="error">required</Badge>}
                              </div>
                              <div className="component-showcase__prop-type">
                                <code>{prop.type}</code>
                              </div>
                              <div className="component-showcase__prop-default">
                                {prop.default && <code>{prop.default}</code>}
                              </div>
                              <div className="component-showcase__prop-description">
                                <Text size="sm">{prop.description}</Text>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsPanel>
                  )}
                </Tabs>
              </Col>
            </Row>
          )}
        </div>
      </Section>
    </main>
  );
};

export default ComponentShowcase;