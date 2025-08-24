"use client";
import React from 'react';
import { Row } from '@/components/layout/row';
import { Col } from '@/components/layout/col';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Nav, type PrimaryNavItem } from '@/components/ui/nav/primary-nav';
import './Footer.scss';

export interface FooterProps {
  /** Additional CSS class name */
  className?: string;
  /** Company name displayed in footer */
  companyName?: string;
  /** Company description text */
  description?: string;
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
  /** Whether to show newsletter signup */
  showNewsletter?: boolean;
  /** Newsletter section title */
  newsletterTitle?: string;
  /** Newsletter section description */
  newsletterDescription?: string;
  /** Callback for newsletter form submission */
  onNewsletterSubmit?: (email: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  className = '',
  companyName = 'Blocx',
  description = 'Building the future of blockchain technology with innovative solutions.',
  copyright,
  links = {},
  socialLinks = [],
  showNewsletter = true,
  newsletterTitle = 'Stay Updated',
  newsletterDescription = 'Get the latest news and updates delivered to your inbox.',
  onNewsletterSubmit,
}) => {
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright || `© ${currentYear} ${companyName}. All rights reserved.`;

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    if (email && onNewsletterSubmit) {
      onNewsletterSubmit(email);
    }
  };

  const footerClasses = [
    'footer',
    className
  ].filter(Boolean).join(' ');

  return (
    <footer className={footerClasses}>
      <div className="footer__container">
        {/* Main Footer Content */}
        <div className="footer__main">
          <Row gap="lg" className="footer__content">
            {/* Company Info */}
            <Col lg={4} md={6} className="footer__section">
              <div className="footer__brand">
                <Heading level={3} size="h4" className="footer__brand-name">
                  {companyName}
                </Heading>
                <Text size="sm" className="footer__description">
                  {description}
                </Text>
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="footer__social">
                  <Nav
                    items={socialLinks}
                    variant="horizontal"
                    size="sm"
                    showIcons={true}
                    showBadges={false}
                    className="footer__social-nav"
                  />
                </div>
              )}
            </Col>

            {/* Company Links */}
            {links.company && links.company.length > 0 && (
              <Col lg={2} md={3} sm={6} className="footer__section">
                <Heading level={4} size="h6" className="footer__section-title">
                  Company
                </Heading>
                <Nav
                  items={links.company}
                  variant="vertical"
                  size="sm"
                  showIcons={false}
                  showBadges={false}
                  className="footer__nav"
                />
              </Col>
            )}

            {/* Products Links */}
            {links.products && links.products.length > 0 && (
              <Col lg={2} md={3} sm={6} className="footer__section">
                <Heading level={4} size="h6" className="footer__section-title">
                  Products
                </Heading>
                <Nav
                  items={links.products}
                  variant="vertical"
                  size="sm"
                  showIcons={false}
                  showBadges={false}
                  className="footer__nav"
                />
              </Col>
            )}

            {/* Resources Links */}
            {links.resources && links.resources.length > 0 && (
              <Col lg={2} md={3} sm={6} className="footer__section">
                <Heading level={4} size="h6" className="footer__section-title">
                  Resources
                </Heading>
                <Nav
                  items={links.resources}
                  variant="vertical"
                  size="sm"
                  showIcons={false}
                  showBadges={false}
                  className="footer__nav"
                />
              </Col>
            )}

            {/* Newsletter Signup */}
            {showNewsletter && (
              <Col lg={2} md={6} className="footer__section">
                <Heading level={4} size="h6" className="footer__section-title">
                  {newsletterTitle}
                </Heading>
                <Text size="sm" className="footer__newsletter-description">
                  {newsletterDescription}
                </Text>
                <form className="footer__newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <div className="footer__newsletter-input-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="footer__newsletter-input"
                      required
                      aria-label="Email address for newsletter"
                    />
                    <button
                      type="submit"
                      className="footer__newsletter-button"
                      aria-label="Subscribe to newsletter"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </Col>
            )}
          </Row>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <Row justify="between" align="center" className="footer__bottom-content">
            <Col span="auto">
              <Text size="xs" className="footer__copyright">
                {copyrightText}
              </Text>
            </Col>
            
            {/* Legal Links */}
            {links.legal && links.legal.length > 0 && (
              <Col span="auto">
                <Nav
                  items={links.legal}
                  variant="horizontal"
                  size="sm"
                  showIcons={false}
                  showBadges={false}
                  gap="sm"
                  className="footer__legal-nav"
                />
              </Col>
            )}
          </Row>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
