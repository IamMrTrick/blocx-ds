"use client";
import React from 'react';
import { Section } from '@/components/layout/section';
import { Row } from '@/components/layout/row';
import { Col } from '@/components/layout/col';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/forms/input';
import { Button } from '@/components/ui/button';
import { SocialLinks } from '@/components/ui/nav/social-links';
import { Icon } from '@/components/ui/icon';
import type { PrimaryNavItem } from '@/components/ui/nav/primary-nav';
import './Footer.scss';

export interface FooterProps {
  /** Additional CSS class name */
  className?: string;
  /** Company name displayed in footer */
  companyName?: string;
  /** Company description */
  description?: string;
  /** Company address for contact */
  companyAddress?: string;
  /** Company phone number */
  companyPhone?: string;
  /** Custom copyright text (auto-generated if not provided) */
  copyright?: string;
  /** Navigation links organized by category */
  links?: {
    company?: PrimaryNavItem[];
    products?: PrimaryNavItem[];
    resources?: PrimaryNavItem[];
    legal?: PrimaryNavItem[];
  };
  /** Social media links */
  socialLinks?: PrimaryNavItem[];
  /** Whether to show newsletter signup in footer top */
  showNewsletter?: boolean;
  /** Newsletter section title */
  newsletterTitle?: string;
  /** Newsletter section description */
  newsletterDescription?: string;
  /** Callback for newsletter form submission */
  onNewsletterSubmit?: (email: string) => void;
  /** Whether to show footer top section */
  showFooterTop?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  className = '',
  companyName = 'Blocx',
  companyAddress = '123 Market St, City',
  companyPhone = '+1 234 567 890',
  copyright,
  links = {},
  socialLinks = [],
  showNewsletter = true,
  newsletterTitle = 'Stay Updated',
  newsletterDescription = 'Get the latest news and updates delivered to your inbox.',
  onNewsletterSubmit,
  showFooterTop = true,
}) => {
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright || `© ${currentYear} ${companyName}`;

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    if (email && onNewsletterSubmit) {
      onNewsletterSubmit(email);
    }
  };

  const footerClasses = ['footer', className].filter(Boolean).join(' ');

  return (
    <footer className={footerClasses}>
      {/* Footer Top (Optional) - Newsletter/CTA */}
      {showFooterTop && showNewsletter && (
        <Section className="footer__top" variant="footer" padding="md" background="surface-secondary">
          <Row justify="center" align="center" className="footer__bar footer__bar--top" gutter>
            <Col span={12} md={10} lg={8} className="footer__left">
              <div className="footer__newsletter">
                <Heading level={4} size="h5" className="footer__heading">{newsletterTitle}</Heading>
                <Text size="sm" className="footer__newsletter-description">{newsletterDescription}</Text>
                <form className="footer__newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <Input
                    id="footer-email"
                    name="email"
                    type="email"
                    placeholder="Your email"
                    aria-label="Email address for newsletter"
                    required
                    wrapperClassName="footer__newsletter-input"
                    endIcon={<Icon name="mail" />}
                  />
                  <Button type="submit" variant="primary" size="m" aria-label="Subscribe to newsletter">
                    <Icon name="send" /> Subscribe
                  </Button>
                </form>
              </div>
            </Col>
          </Row>
        </Section>
      )}

      {/* Footer Middle (Core) - Main Navigation & Contact */}
      <Section className="footer__middle" variant="footer" padding="lg" background="surface">
        <Row className="footer__bar footer__bar--middle" justify="start" gutter>
          {/* Company Navigation */}
          <Col span={12} md={6} lg={3} className="footer__left">
            {links.company && links.company.length > 0 && (
              <nav className="footer__nav" aria-labelledby="footer-company">
                <Heading level={4} id="footer-company" size="h6" className="footer__heading">Company</Heading>
                <ul className="footer__nav-list">
                  {links.company.map((item) => (
                    <li key={item.id} className="footer__nav-item">
                      <a href={item.href} className="footer__link">{item.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </Col>

          {/* Products Navigation */}
          <Col span={12} md={6} lg={3} className="footer__left">
            {links.products && links.products.length > 0 && (
              <nav className="footer__nav" aria-labelledby="footer-products">
                <Heading level={4} id="footer-products" size="h6" className="footer__heading">Products</Heading>
                <ul className="footer__nav-list">
                  {links.products.map((item) => (
                    <li key={item.id} className="footer__nav-item">
                      <a href={item.href} className="footer__link">{item.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </Col>

          {/* Resources Navigation */}
          <Col span={12} md={6} lg={3} className="footer__center">
            {links.resources && links.resources.length > 0 && (
              <nav className="footer__nav" aria-labelledby="footer-resources">
                <Heading level={4} id="footer-resources" size="h6" className="footer__heading">Resources</Heading>
                <ul className="footer__nav-list">
                  {links.resources.map((item) => (
                    <li key={item.id} className="footer__nav-item">
                      <a href={item.href} className="footer__link">{item.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </Col>

          {/* Contact & Social */}
          <Col span={12} md={12} lg={6} className="footer__right">
            <div className="footer__contact">
              <address className="footer__address">
                <strong>{companyName}</strong><br />
                {companyAddress}<br />
                <a href={`tel:${companyPhone.replace(/\s/g, '')}`} className="footer__phone">{companyPhone}</a>
              </address>
              
              {socialLinks.length > 0 && (
                <SocialLinks
                  links={socialLinks.map(l => ({ 
                    id: l.id, 
                    platform: l.label || l.id, 
                    url: l.href!, 
                    icon: l.icon || l.id 
                  }))}
                  className="footer__social"
                  variant="minimal"
                  size="md"
                />
              )}
            </div>
          </Col>
        </Row>
      </Section>

      {/* Footer Bottom (Required) - Legal & Copyright */}
      <Section className="footer__bottom" variant="footer" padding="sm" background="surface-secondary">
        <Row justify="between" align="center" className="footer__bar footer__bar--bottom" gutter>
          <Col span="auto" className="footer__left">
            <Text size="xs" className="footer__copyright">{copyrightText}</Text>
          </Col>
          
          <Col span="auto" className="footer__center">
            {links.legal && links.legal.length > 0 && (
              <nav aria-label="Legal">
                {links.legal.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <a href={item.href} className="footer__link">{item.label}</a>
                    {index < links.legal!.length - 1 && <span className="footer__separator"> · </span>}
                  </React.Fragment>
                ))}
              </nav>
            )}
          </Col>
          
          <Col span="auto" className="footer__right">
            <a href="#top" className="footer__backtotop">Back to top</a>
          </Col>
        </Row>
      </Section>
    </footer>
  );
};

export default Footer;
