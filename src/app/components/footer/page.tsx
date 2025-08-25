import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Footer — Blocx',
  description: 'Demo of the Footer component.',
};

export default function FooterDemoPage() {
  return (
    <main className="components components--footer" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Footer</Heading>
      </Section>
      <Footer
        companyName="Blocx"
        description="Building the future of blockchain technology with innovative solutions and cutting-edge development tools."
        links={{
          company: [
            { id: 'about', label: 'About Us', href: '/about' },
            { id: 'careers', label: 'Careers', href: '/careers' },
            { id: 'contact', label: 'Contact', href: '/contact' },
            { id: 'blog', label: 'Blog', href: '/blog' }
          ],
          products: [
            { id: 'platform', label: 'Platform', href: '/platform' },
            { id: 'api', label: 'API', href: '/api' },
            { id: 'sdk', label: 'SDK', href: '/sdk' },
            { id: 'tools', label: 'Developer Tools', href: '/tools' }
          ],
          resources: [
            { id: 'docs', label: 'Documentation', href: '/docs' },
            { id: 'tutorials', label: 'Tutorials', href: '/tutorials' },
            { id: 'community', label: 'Community', href: '/community' },
            { id: 'support', label: 'Support', href: '/support' }
          ],
          legal: [
            { id: 'privacy', label: 'Privacy Policy', href: '/privacy' },
            { id: 'terms', label: 'Terms of Service', href: '/terms' },
            { id: 'cookies', label: 'Cookie Policy', href: '/cookies' }
          ]
        }}
        socialLinks={[]}
      />
    </main>
  );
}


