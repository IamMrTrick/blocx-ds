'use client';
import React, { useState } from 'react';
import { 
  PrimaryNav, 
  Breadcrumbs, 
  Pagination, 
  SocialLinks, 
  NavItem,
  SOCIAL_PLATFORMS,
  type PrimaryNavItem as NavItemType,
  type BreadcrumbItem,
  type SocialLink
} from '@/components/ui/nav';
import { Section, Row, Col } from '@/components/layout';
import './nav-test.scss';

export default function NavigationTestPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeNavId, setActiveNavId] = useState('home');

  // Sample navigation items
  const navItems: NavItemType[] = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: 'home'
    },
    {
      id: 'products',
      label: 'Products',
      icon: 'package',
      badge: '12',
      children: [
        { id: 'web-apps', label: 'Web Apps', href: '/products/web' },
        { id: 'mobile-apps', label: 'Mobile Apps', href: '/products/mobile' },
        { id: 'desktop-apps', label: 'Desktop Apps', href: '/products/desktop' }
      ]
    },
    {
      id: 'services',
      label: 'Services',
      icon: 'settings',
      children: [
        { id: 'consulting', label: 'Consulting', href: '/services/consulting' },
        { id: 'development', label: 'Development', href: '/services/development' },
        { id: 'support', label: 'Support', href: '/services/support' }
      ]
    },
    {
      id: 'about',
      label: 'About',
      href: '/about',
      icon: 'info'
    },
    {
      id: 'contact',
      label: 'Contact',
      href: '/contact',
      icon: 'mail'
    },
    {
      id: 'external',
      label: 'GitHub',
      href: 'https://github.com',
      icon: 'github',
      external: true
    }
  ];

  // Sample breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'web-apps', label: 'Web Applications', href: '/products/web' },
    { id: 'react', label: 'React Components' }
  ];

  // Sample social links
  const socialLinks: SocialLink[] = [
    {
      id: 'github',
      platform: SOCIAL_PLATFORMS.GITHUB.platform,
      icon: SOCIAL_PLATFORMS.GITHUB.icon,
      url: 'https://github.com',
      username: 'blocx'
    },
    {
      id: 'twitter',
      platform: SOCIAL_PLATFORMS.TWITTER.platform,
      icon: SOCIAL_PLATFORMS.TWITTER.icon,
      url: 'https://twitter.com',
      username: 'blocx'
    },
    {
      id: 'linkedin',
      platform: SOCIAL_PLATFORMS.LINKEDIN.platform,
      icon: SOCIAL_PLATFORMS.LINKEDIN.icon,
      url: 'https://linkedin.com'
    },
    {
      id: 'instagram',
      platform: SOCIAL_PLATFORMS.INSTAGRAM.platform,
      icon: SOCIAL_PLATFORMS.INSTAGRAM.icon,
      url: 'https://instagram.com'
    }
  ];

  return (
    <div className="nav-test-page">
      <Section variant="content" background="surface">
        <Row gutter>
          <Col span={12}>
            <div className="nav-test-header">
              <h1>Navigation Components Test</h1>
              <p>Testing all navigation components with different variants and configurations.</p>
            </div>
          </Col>
        </Row>
      </Section>

      {/* Primary Navigation Tests */}
      <Section variant="content">
        <Row gutter>
          <Col span={12}>
            <div className="test-section">
              <h2>Primary Navigation</h2>
              
              <div className="test-group">
                <h3>Horizontal Navigation (Default)</h3>
                <PrimaryNav
                  items={navItems}
                  variant="horizontal"
                  size="md"
                  activeId={activeNavId}
                  onItemClick={(item) => setActiveNavId(item.id)}
                  showIcons
                  showBadges
                />
              </div>

              <div className="test-group">
                <h3>Tabs Navigation</h3>
                <PrimaryNav
                  items={navItems.slice(0, 4)}
                  variant="tabs"
                  size="md"
                  activeId={activeNavId}
                  onItemClick={(item) => setActiveNavId(item.id)}
                  showIcons={false}
                />
              </div>

              <div className="test-group">
                <h3>Pills Navigation</h3>
                <PrimaryNav
                  items={navItems.slice(0, 4)}
                  variant="pills"
                  size="sm"
                  activeId={activeNavId}
                  onItemClick={(item) => setActiveNavId(item.id)}
                />
              </div>

              <div className="test-group">
                <h3>Vertical Navigation</h3>
                <div style={{ maxWidth: '300px' }}>
                  <PrimaryNav
                    items={navItems}
                    variant="vertical"
                    size="md"
                    activeId={activeNavId}
                    onItemClick={(item) => setActiveNavId(item.id)}
                    showIcons
                    showBadges
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Section>

      {/* Breadcrumbs Tests */}
      <Section variant="content" background="surface-secondary">
        <Row gutter>
          <Col span={12}>
            <div className="test-section">
              <h2>Breadcrumbs Navigation</h2>
              
              <div className="test-group">
                <h3>Default Breadcrumbs</h3>
                <Breadcrumbs
                  items={breadcrumbItems}
                  separator="chevron"
                  size="md"
                  showHome
                />
              </div>

              <div className="test-group">
                <h3>Slash Separator</h3>
                <Breadcrumbs
                  items={breadcrumbItems}
                  separator="slash"
                  size="sm"
                  showHome
                />
              </div>

              <div className="test-group">
                <h3>Arrow Separator</h3>
                <Breadcrumbs
                  items={breadcrumbItems}
                  separator="arrow"
                  size="lg"
                  showHome={false}
                />
              </div>

              <div className="test-group">
                <h3>With Max Items (3)</h3>
                <Breadcrumbs
                  items={[
                    ...breadcrumbItems,
                    { id: 'components', label: 'Components' },
                    { id: 'navigation', label: 'Navigation' },
                    { id: 'primary-nav', label: 'Primary Nav' }
                  ]}
                  separator="chevron"
                  size="md"
                  maxItems={3}
                  showHome
                />
              </div>
            </div>
          </Col>
        </Row>
      </Section>

      {/* Pagination Tests */}
      <Section variant="content">
        <Row gutter>
          <Col span={12}>
            <div className="test-section">
              <h2>Pagination Navigation</h2>
              
              <div className="test-group">
                <h3>Default Pagination</h3>
                <Pagination
                  currentPage={currentPage}
                  totalPages={20}
                  onPageChange={setCurrentPage}
                  size="md"
                  showFirstLast
                  showPrevNext
                />
              </div>

              <div className="test-group">
                <h3>Minimal Pagination</h3>
                <Pagination
                  currentPage={currentPage}
                  totalPages={20}
                  onPageChange={setCurrentPage}
                  variant="minimal"
                  size="sm"
                />
              </div>

              <div className="test-group">
                <h3>Compact Pagination</h3>
                <Pagination
                  currentPage={currentPage}
                  totalPages={20}
                  onPageChange={setCurrentPage}
                  variant="compact"
                  size="lg"
                  showPageInfo
                />
              </div>

              <div className="test-group">
                <h3>With Jump to Page</h3>
                <Pagination
                  currentPage={currentPage}
                  totalPages={50}
                  onPageChange={setCurrentPage}
                  showJumpToPage
                  showPageInfo
                />
              </div>
            </div>
          </Col>
        </Row>
      </Section>

      {/* Social Links Tests */}
      <Section variant="content" background="surface-secondary">
        <Row gutter>
          <Col span={12}>
            <div className="test-section">
              <h2>Social Links Navigation</h2>
              
              <div className="test-group">
                <h3>Default Social Links</h3>
                <SocialLinks
                  links={socialLinks}
                  variant="default"
                  size="md"
                  layout="horizontal"
                />
              </div>

              <div className="test-group">
                <h3>Filled Social Links</h3>
                <SocialLinks
                  links={socialLinks}
                  variant="filled"
                  size="lg"
                  layout="horizontal"
                  animated
                />
              </div>

              <div className="test-group">
                <h3>Outlined with Labels</h3>
                <SocialLinks
                  links={socialLinks.slice(0, 2)}
                  variant="outlined"
                  size="md"
                  layout="horizontal"
                  showLabels
                  showUsernames
                />
              </div>

              <div className="test-group">
                <h3>Floating Vertical</h3>
                <div style={{ maxWidth: '200px' }}>
                  <SocialLinks
                    links={socialLinks}
                    variant="floating"
                    size="md"
                    layout="vertical"
                    animated
                  />
                </div>
              </div>

              <div className="test-group">
                <h3>Grid Layout</h3>
                <div style={{ maxWidth: '300px' }}>
                  <SocialLinks
                    links={socialLinks}
                    variant="minimal"
                    size="xl"
                    layout="grid"
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Section>

      {/* NavItem Tests */}
      <Section variant="content">
        <Row gutter>
          <Col span={12}>
            <div className="test-section">
              <h2>Navigation Items</h2>
              
              <div className="test-group">
                <h3>NavItem Variants</h3>
                <div className="nav-item-showcase">
                  <NavItem variant="default" icon="home">Default</NavItem>
                  <NavItem variant="ghost" icon="settings">Ghost</NavItem>
                  <NavItem variant="filled" icon="star">Filled</NavItem>
                  <NavItem variant="outlined" icon="heart">Outlined</NavItem>
                </div>
              </div>

              <div className="test-group">
                <h3>NavItem Sizes</h3>
                <div className="nav-item-showcase">
                  <NavItem size="sm" icon="zap">Small</NavItem>
                  <NavItem size="md" icon="zap">Medium</NavItem>
                  <NavItem size="lg" icon="zap">Large</NavItem>
                </div>
              </div>

              <div className="test-group">
                <h3>NavItem States</h3>
                <div className="nav-item-showcase">
                  <NavItem icon="check" badge="5">With Badge</NavItem>
                  <NavItem icon="user" active>Active</NavItem>
                  <NavItem icon="lock" disabled>Disabled</NavItem>
                  <NavItem icon="loader" loading>Loading</NavItem>
                  <NavItem href="https://github.com" external icon="external-link">External</NavItem>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Section>
    </div>
  );
}
