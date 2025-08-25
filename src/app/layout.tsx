import type { Metadata } from "next";
import "../styles/_index.scss";
import { HeaderWithMobileMenu } from '@/components/header/HeaderWithMobileMenu';
import { Footer } from '@/components/footer';
import { Main } from '@/components/layout';
import { ToastProvider } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: "Blocx - Next.js Project",
  description: "Next.js project with SCSS ready for development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <HeaderWithMobileMenu sticky={true} />
        <ToastProvider>
          <Main width="full" id="main">
            {children}
          </Main>
        </ToastProvider>
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
          socialLinks={[
            { id: 'twitter', label: 'Twitter', href: 'https://twitter.com/blocx', icon: 'twitter', external: true },
            { id: 'github', label: 'GitHub', href: 'https://github.com/blocx', icon: 'github', external: true },
            { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/blocx', icon: 'linkedin', external: true },
            { id: 'discord', label: 'Discord', href: 'https://discord.gg/blocx', icon: 'discord', external: true }
          ]}
        />
      </body>
    </html>
  );
}
