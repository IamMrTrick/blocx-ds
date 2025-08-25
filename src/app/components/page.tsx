import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Components — Blocx',
  description: 'Browse Blocx component groups with dedicated demo pages for easy testing.',
};

const groups: Array<{ href: string; title: string; description: string }> = [
  { href: '/components/layout', title: 'Layout', description: 'Section, Row, Col containers' },
  { href: '/components/typography', title: 'Typography', description: 'Headings and text styles' },
  { href: '/components/forms', title: 'Forms', description: 'Form, Input, TextArea, Select, Checkbox, Radio, OTP, Switcher' },
  { href: '/components/navigation', title: 'Navigation', description: 'Breadcrumbs, Pagination, Primary Nav' },
  { href: '/components/disclosures', title: 'Disclosures', description: 'Accordion and Tabs' },
  { href: '/components/feedback', title: 'Feedback', description: 'Modal and Toast' },
  { href: '/components/data-display', title: 'Data Display', description: 'Badge, Card, Icon' },
  { href: '/components/ui', title: 'All UI Components', description: 'Per-component demo pages (Buttons, Badges, Cards, Icons, etc.)' },
  { href: '/components/header', title: 'Header', description: 'Header layout and parts' },
  { href: '/components/footer', title: 'Footer', description: 'Footer layout and links' },
];

export default function ComponentsIndexPage() {
  return (
    <main className="components-index" role="main">
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Components</h1>
        <p>Explore component groups with dedicated demo pages.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
          {groups.map((g) => (
            <div key={g.href} style={{ 
              padding: '1.5rem', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <h3>
                <Link href={g.href} style={{ textDecoration: 'none', color: '#2563eb' }}>
                  {g.title}
                </Link>
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{g.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


