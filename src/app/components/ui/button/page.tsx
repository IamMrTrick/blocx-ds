import React from 'react';
import type { Metadata } from 'next';
import { ComponentShowcase } from '@/components/showcase';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export const metadata: Metadata = {
  title: 'Button — Blocx Design System',
  description: 'Versatile button component with multiple variants, sizes, states, and icon support for all user interactions.',
};

export default function ButtonDemoPage() {
  const examples = [
    {
      id: 'variants',
      title: 'Button Variants',
      description: 'Different visual styles for various contexts and importance levels.',
      component: (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="error">Error</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
      ),
      code: `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="error">Error</Button>
<Button variant="ghost">Ghost</Button>`
    },
    {
      id: 'sizes',
      title: 'Button Sizes',
      description: 'Multiple size options to fit different design needs and hierarchies.',
      component: (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="xs">Extra Small</Button>
          <Button size="s">Small</Button>
          <Button size="m">Medium</Button>
          <Button size="l">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      ),
      code: `<Button size="xs">Extra Small</Button>
<Button size="s">Small</Button>
<Button size="m">Medium</Button>
<Button size="l">Large</Button>
<Button size="xl">Extra Large</Button>`
    },
    {
      id: 'with-icons',
      title: 'Buttons with Icons',
      description: 'Enhanced buttons with icons for better visual communication.',
      component: (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="primary"><Icon name="download" /> Download</Button>
          <Button variant="secondary"><Icon name="share" /> Share</Button>
          <Button variant="success"><Icon name="check" /> Complete</Button>
          <Button variant="error"><Icon name="trash" /> Delete</Button>
          <Button variant="ghost"><Icon name="edit" /> Edit</Button>
        </div>
      ),
      code: `<Button variant="primary">
  <Icon name="download" /> Download
</Button>
<Button variant="secondary">
  <Icon name="share" /> Share
</Button>`
    },
    {
      id: 'icon-only',
      title: 'Icon-Only Buttons',
      description: 'Compact buttons with only icons for space-efficient interfaces.',
      component: (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button iconOnly aria-label="Search" variant="primary"><Icon name="search" /></Button>
          <Button iconOnly aria-label="Settings" variant="secondary"><Icon name="settings" /></Button>
          <Button iconOnly aria-label="Favorite" variant="ghost"><Icon name="heart" /></Button>
          <Button iconOnly aria-label="Menu" variant="ghost"><Icon name="menu" /></Button>
          <Button iconOnly aria-label="Close" variant="error"><Icon name="x" /></Button>
        </div>
      ),
      code: `<Button iconOnly aria-label="Search" variant="primary">
  <Icon name="search" />
</Button>
<Button iconOnly aria-label="Settings" variant="secondary">
  <Icon name="settings" />
</Button>`
    },
    {
      id: 'states',
      title: 'Button States',
      description: 'Different interaction states including disabled and loading states.',
      component: (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="primary">Normal</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="secondary">Normal</Button>
          <Button variant="secondary" disabled>Disabled</Button>
          <Button variant="ghost">Normal</Button>
          <Button variant="ghost" disabled>Disabled</Button>
        </div>
      ),
      code: `<Button variant="primary">Normal</Button>
<Button variant="primary" disabled>Disabled</Button>`
    }
  ];

  const props = [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'ghost'",
      default: "'primary'",
      description: 'Visual style variant of the button'
    },
    {
      name: 'size',
      type: "'xs' | 's' | 'm' | 'l' | 'xl'",
      default: "'m'",
      description: 'Size of the button affecting padding and font size'
    },
    {
      name: 'iconOnly',
      type: 'boolean',
      default: 'false',
      description: 'Whether the button contains only an icon (applies compact styling)'
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether the button is disabled and non-interactive'
    },
    {
      name: 'onClick',
      type: '() => void',
      description: 'Click handler function'
    },
    {
      name: 'type',
      type: "'button' | 'submit' | 'reset'",
      default: "'button'",
      description: 'HTML button type attribute'
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply'
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Button content (text, icons, etc.)'
    }
  ];

  return (
    <ComponentShowcase
      title="Button"
      description="A versatile button component designed for all user interactions. Features multiple variants, sizes, states, and comprehensive icon support with built-in accessibility."
      category="Actions"
      examples={examples}
      props={props}
    >
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button variant="primary" size="l">
          <Icon name="rocket" /> Get Started
        </Button>
        <Button variant="secondary" size="l">
          Learn More
        </Button>
        <Button variant="ghost" size="l" iconOnly aria-label="More options">
          <Icon name="more-horizontal" />
        </Button>
            </div>
    </ComponentShowcase>
  );
}


