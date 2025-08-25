import React from 'react';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Debug CSS
const debugStyles = `
  .col {
    outline: 2px solid red !important;
    outline-offset: -2px !important;
    background: rgba(255, 0, 0, 0.1) !important;
  }
  
  .col--md-4 {
    outline: 3px solid green !important;
    background: rgba(0, 255, 0, 0.2) !important;
  }
  
  .row {
    outline: 2px solid blue !important;
    outline-offset: -2px !important;
    background: rgba(0, 0, 255, 0.1) !important;
    position: relative !important;
  }
  
  .row:before {
    content: "ROW max-width: var(--grid-container-xxl)" !important;
    position: absolute !important;
    top: -20px !important;
    left: 0 !important;
    background: blue !important;
    color: white !important;
    padding: 2px 8px !important;
    font-size: 10px !important;
  }
`;

// Add debug component
const DebugStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: debugStyles }} />
);

export default function TestLayoutPage() {
  return (
    <>
      <DebugStyles />
      <main style={{ padding: '2rem' }}>
        <Heading level={1} size="h2">Layout Test Page</Heading>
        
        {/* Test 1: Inline CSS (Should Work) */}
        <div style={{ marginTop: '2rem', border: '2px solid #333' }}>
          <h3>Test 1: Inline CSS (Should Work)</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: '0 0 33.333333%', background: 'red', color: 'white', padding: '1rem' }}>
              Col 1 (33.33%)
            </div>
            <div style={{ flex: '0 0 33.333333%', background: 'green', color: 'white', padding: '1rem' }}>
              Col 2 (33.33%)
            </div>
            <div style={{ flex: '0 0 33.333333%', background: 'blue', color: 'white', padding: '1rem' }}>
              Col 3 (33.33%)
            </div>
          </div>
        </div>
      
        {/* Test 2: Grid System */}
        <div style={{ marginTop: '2rem', border: '2px solid #333' }}>
          <h3>Test 2: Grid System (Row + Col)</h3>
          <Row gutter>
            <Col md={4}>
              <div style={{ background: 'red', color: 'white', padding: '1rem' }}>
                Col md=4
              </div>
            </Col>
            <Col md={4}>
              <div style={{ background: 'green', color: 'white', padding: '1rem' }}>
                Col md=4
              </div>
            </Col>
            <Col md={4}>
              <div style={{ background: 'blue', color: 'white', padding: '1rem' }}>
                Col md=4
              </div>
            </Col>
          </Row>
        </div>

      {/* Test 2: Two Column Layout */}
      <Section variant="content" padding="lg">
        <Heading level={2} size="h4">Test 2: Two Columns (6+6)</Heading>
        <Row gutter>
          <Col md={6}>
            <Card padding="xl" style={{ background: '#fce7f3', border: '2px solid #ec4899' }}>
              <Heading level={3} size="h5">Left Column</Heading>
              <Badge variant="primary">md={6}</Badge>
              <p style={{ marginTop: '1rem' }}>This is the left column content.</p>
            </Card>
          </Col>
          <Col md={6}>
            <Card padding="xl" style={{ background: '#ede9fe', border: '2px solid #8b5cf6' }}>
              <Heading level={3} size="h5">Right Column</Heading>
              <Badge variant="secondary">md={6}</Badge>
              <p style={{ marginTop: '1rem' }}>This is the right column content.</p>
            </Card>
          </Col>
        </Row>
      </Section>

      {/* Test 3: Responsive Layout */}
      <Section variant="content" padding="lg">
        <Heading level={2} size="h4">Test 3: Responsive Layout</Heading>
        <Row gutter>
          <Col sm={12} md={8} lg={9}>
            <Card padding="xl" style={{ background: '#f0f9ff', border: '2px solid #0ea5e9' }}>
              <Heading level={3} size="h5">Main Content</Heading>
              <Badge variant="info">sm=12 md=8 lg=9</Badge>
              <p style={{ marginTop: '1rem' }}>This column takes full width on mobile, 8/12 on tablet, and 9/12 on desktop.</p>
            </Card>
          </Col>
          <Col sm={12} md={4} lg={3}>
            <Card padding="xl" style={{ background: '#fef3c7', border: '2px solid #f59e0b' }}>
              <Heading level={3} size="h5">Sidebar</Heading>
              <Badge variant="warning">sm=12 md=4 lg=3</Badge>
              <p style={{ marginTop: '1rem' }}>Sidebar content.</p>
            </Card>
          </Col>
        </Row>
      </Section>

      {/* Test 4: No Gap */}
      <Section variant="content" padding="lg">
        <Heading level={2} size="h4">Test 4: No Gap</Heading>
        <Row noGutters>
          <Col md={3}>
            <Card padding="lg" style={{ background: '#fee2e2', border: '2px solid #ef4444', borderRadius: '0' }}>
              <Badge variant="error">No Gap 1</Badge>
            </Card>
          </Col>
          <Col md={3}>
            <Card padding="lg" style={{ background: '#dcfce7', border: '2px solid #22c55e', borderRadius: '0' }}>
              <Badge variant="success">No Gap 2</Badge>
            </Card>
          </Col>
          <Col md={3}>
            <Card padding="lg" style={{ background: '#dbeafe', border: '2px solid #3b82f6', borderRadius: '0' }}>
              <Badge variant="info">No Gap 3</Badge>
            </Card>
          </Col>
          <Col md={3}>
            <Card padding="lg" style={{ background: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '0' }}>
              <Badge variant="warning">No Gap 4</Badge>
            </Card>
          </Col>
        </Row>
      </Section>

      {/* Test 5: Auto Columns */}
      <Section variant="content" padding="lg">
        <Heading level={2} size="h4">Test 5: Auto Columns</Heading>
        <Row gap="sm">
          <Col span="auto">
            <Card padding="md" style={{ background: '#f3e8ff', border: '2px solid #a855f7' }}>
              <Badge>Auto 1</Badge>
            </Card>
          </Col>
          <Col span="auto">
            <Card padding="md" style={{ background: '#fce7f3', border: '2px solid #ec4899' }}>
              <Badge>Auto 2</Badge>
            </Card>
          </Col>
          <Col span="auto">
            <Card padding="md" style={{ background: '#ecfccb', border: '2px solid #65a30d' }}>
              <Badge>Auto 3</Badge>
            </Card>
          </Col>
          <Col span="auto">
            <Card padding="md" style={{ background: '#fef2f2', border: '2px solid #dc2626' }}>
              <Badge>Auto 4</Badge>
            </Card>
          </Col>
        </Row>
      </Section>
      </main>
    </>
  );
}
