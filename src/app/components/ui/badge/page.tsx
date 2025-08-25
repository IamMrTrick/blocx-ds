import React from 'react';
import type { Metadata } from 'next';
import { ComponentShowcase } from '@/components/showcase';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';

export const metadata: Metadata = {
  title: 'Badge — Blocx Design System',
  description: 'Compact badge component for labels, status indicators, and tags with multiple variants and customization options.',
};

export default function BadgeDemoPage() {
  const examples = [
    {
      id: 'variants',
      title: 'Badge Variants',
      description: 'Semantic color variants to convey different meanings and states.',
      component: (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </div>
      ),
      code: `<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="neutral">Neutral</Badge>`
    },
    {
      id: 'sizes',
      title: 'Badge Sizes',
      description: 'Multiple size options for different use cases and visual hierarchies.',
      component: (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge size="xs">Extra Small</Badge>
          <Badge size="s">Small</Badge>
          <Badge size="m">Medium</Badge>
          <Badge size="l">Large</Badge>
        </div>
      ),
      code: `<Badge size="xs">Extra Small</Badge>
<Badge size="s">Small</Badge>
<Badge size="m">Medium</Badge>
<Badge size="l">Large</Badge>`
    },
    {
      id: 'shapes',
      title: 'Badge Shapes',
      description: 'Different shape variants for various design aesthetics.',
      component: (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge shape="rounded">Rounded</Badge>
          <Badge shape="pill">Pill Shape</Badge>
          <Badge shape="square">Square</Badge>
        </div>
      ),
      code: `<Badge shape="rounded">Rounded</Badge>
<Badge shape="pill">Pill Shape</Badge>
<Badge shape="square">Square</Badge>`
    },
    {
      id: 'with-icons',
      title: 'Badges with Icons',
      description: 'Enhanced badges with icons for better visual communication.',
      component: (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="success"><Icon name="check" /> Verified</Badge>
          <Badge variant="warning"><Icon name="alert-triangle" /> Warning</Badge>
          <Badge variant="error"><Icon name="x-circle" /> Error</Badge>
          <Badge variant="info"><Icon name="info" /> Info</Badge>
          <Badge variant="primary"><Icon name="star" /> Featured</Badge>
        </div>
      ),
      code: `<Badge variant="success">
  <Icon name="check" /> Verified
</Badge>
<Badge variant="warning">
  <Icon name="alert-triangle" /> Warning
</Badge>`
    },
    {
      id: 'removable',
      title: 'Removable Badges',
      description: 'Interactive badges with remove functionality for tags and filters.',
      component: (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge removable>Design</Badge>
          <Badge variant="secondary" removable>Frontend</Badge>
          <Badge variant="info" removable>React</Badge>
          <Badge variant="success" removable>TypeScript</Badge>
        </div>
      ),
      code: `<Badge removable>Design</Badge>
<Badge variant="secondary" removable>Frontend</Badge>
<Badge variant="info" removable>React</Badge>`
    },
    {
      id: 'status-examples',
      title: 'Status Examples',
      description: 'Real-world usage examples for different status indicators.',
      component: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>User Status:</span>
            <Badge variant="success" size="s"><Icon name="circle" /> Online</Badge>
            <Badge variant="warning" size="s"><Icon name="circle" /> Away</Badge>
            <Badge variant="error" size="s"><Icon name="circle" /> Offline</Badge>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>Order Status:</span>
            <Badge variant="info">Pending</Badge>
            <Badge variant="warning">Processing</Badge>
            <Badge variant="success">Shipped</Badge>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>Priority:</span>
            <Badge variant="error">Critical</Badge>
            <Badge variant="warning">High</Badge>
            <Badge variant="neutral">Low</Badge>
          </div>
        </div>
      ),
      code: `{/* Status indicators */}
<Badge variant="success" size="s">
  <Icon name="circle" /> Online
</Badge>

{/* Order status */}
<Badge variant="info">Pending</Badge>
<Badge variant="success">Shipped</Badge>

{/* Priority levels */}
<Badge variant="error">Critical</Badge>`
    }
  ];

  const props = [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'",
      default: "'primary'",
      description: 'Visual style variant of the badge'
    },
    {
      name: 'size',
      type: "'xs' | 'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the badge affecting padding and font size'
    },
    {
      name: 'shape',
      type: "'rounded' | 'pill' | 'square'",
      default: "'rounded'",
      description: 'Shape variant of the badge'
    },
    {
      name: 'removable',
      type: 'boolean',
      default: 'false',
      description: 'Whether the badge shows a remove button and is interactive'
    },
    {
      name: 'onRemove',
      type: '() => void',
      description: 'Callback function when the remove button is clicked (only when removable is true)'
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply'
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Badge content (text, icons, etc.)'
    }
  ];

  return (
    <ComponentShowcase
      title="Badge"
      description="A compact, versatile badge component perfect for labels, status indicators, tags, and notifications. Features multiple variants, sizes, and interactive capabilities."
      category="Feedback"
      examples={examples}
      props={props}
    >
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Badge variant="primary"><Icon name="star" /> Featured</Badge>
        <Badge variant="success"><Icon name="check" /> Verified</Badge>
        <Badge variant="info">New</Badge>
        <Badge variant="warning" removable>Tag</Badge>
      </div>
    </ComponentShowcase>
  );
}


