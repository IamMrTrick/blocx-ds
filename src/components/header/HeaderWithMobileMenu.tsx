'use client';
import React, { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Header, HeaderMiddle, HeaderContainer, HeaderLeft, HeaderLogo, HeaderCenter, HeaderRight, HeaderMobileToggle, HeaderThemeSwitcherSimple } from './Header';
import { HeaderNavMenu, HeaderMobileMenu } from './components';
import type { PrimaryNavItem } from '@/components/ui/nav/primary-nav/PrimaryNav';

// Navigation items (shared between desktop and mobile)
const navigationItems: PrimaryNavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'foundations',
    label: 'Foundations',
    href: '/foundations',
    children: [
      { id: 'design-tokens', label: 'Design Tokens', href: '/foundations/tokens' },
      { id: 'colors', label: 'Colors', href: '/foundations/colors' },
      { id: 'typography', label: 'Typography', href: '/foundations/typography' },
      { id: 'spacing', label: 'Spacing', href: '/foundations/spacing' },
      { id: 'icons', label: 'Icons', href: '/foundations/icons' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    href: '/components',
    children: [
      {
        id: 'layout',
        label: 'Layout',
        href: '/components/layout',
        children: [
          { id: 'section', label: 'Section', href: '/components/ui/section' },
          { id: 'row', label: 'Row', href: '/components/ui/row' },
          { id: 'col', label: 'Col', href: '/components/ui/col' },
          { id: 'main', label: 'Main', href: '/components/ui/main' },
          { id: 'aside', label: 'Aside', href: '/components/ui/aside' },
        ],
      },
      {
        id: 'typography',
        label: 'Typography',
        href: '/components/typography',
        children: [
          { id: 'heading', label: 'Heading', href: '/components/ui/heading' },
          { id: 'text', label: 'Text', href: '/components/ui/text' },
        ],
      },
      {
        id: 'forms',
        label: 'Forms',
        href: '/components/forms',
        children: [
          { id: 'form', label: 'Form', href: '/components/ui/form' },
          { id: 'input', label: 'Input', href: '/components/ui/input' },
          { id: 'textarea', label: 'TextArea', href: '/components/ui/textarea' },
          { id: 'select', label: 'Select', href: '/components/ui/select' },
          { id: 'checkbox', label: 'Checkbox', href: '/components/ui/checkbox' },
          { id: 'radio', label: 'Radio', href: '/components/ui/radio' },
          { id: 'switcher', label: 'Switcher', href: '/components/ui/switcher' },
          { id: 'otp', label: 'OTP', href: '/components/ui/otp' },
          { id: 'date-picker', label: 'Date Picker', href: '/components/ui/date-picker' },
          { id: 'time-picker', label: 'Time Picker', href: '/components/ui/time-picker' },
        ],
      },
      {
        id: 'actions',
        label: 'Actions',
        href: '/components/actions',
        children: [
          { id: 'button', label: 'Button', href: '/components/ui/button' },
          { id: 'icon-button', label: 'Icon Button', href: '/components/ui/icon-button' },
        ],
      },
      {
        id: 'navigation',
        label: 'Navigation',
        href: '/components/navigation',
        children: [
          { id: 'nav', label: 'Primary Nav', href: '/components/ui/nav' },
          { id: 'breadcrumbs', label: 'Breadcrumbs', href: '/components/ui/breadcrumbs' },
          { id: 'pagination', label: 'Pagination', href: '/components/ui/pagination' },
          { id: 'tabs', label: 'Tabs', href: '/components/ui/tabs' },
        ],
      },
      {
        id: 'disclosure',
        label: 'Disclosure',
        href: '/components/disclosure',
        children: [
          { id: 'accordion', label: 'Accordion', href: '/components/ui/accordion' },
          { id: 'modal', label: 'Modal', href: '/components/ui/modal' },
          { id: 'drawer', label: 'Drawer', href: '/components/ui/drawer' },
        ],
      },
      {
        id: 'feedback',
        label: 'Feedback',
        href: '/components/feedback',
        children: [
          { id: 'toast', label: 'Toast', href: '/components/ui/toast' },
          { id: 'badge', label: 'Badge', href: '/components/ui/badge' },
          { id: 'theme-switcher', label: 'Theme Switcher', href: '/components/ui/theme-switcher' },
        ],
      },
      {
        id: 'data-display',
        label: 'Data Display',
        href: '/components/data-display',
        children: [
          { id: 'card', label: 'Card', href: '/components/ui/card' },
          { id: 'icon', label: 'Icon', href: '/components/ui/icon' },
        ],
      },
    ],
  },
  {
    id: 'templates',
    label: 'Templates',
    href: '/templates',
    children: [
      { id: 'header', label: 'Header', href: '/components/header' },
      { id: 'footer', label: 'Footer', href: '/components/footer' },
      { id: 'landing', label: 'Landing Pages', href: '/templates/landing' },
    ],
  },
  { id: 'playground', label: 'Playground', href: '/playground' },
];

export interface HeaderWithMobileMenuProps {
  /** Custom className */
  className?: string;
  /** Header variant */
  variant?: 'default' | 'transparent' | 'minimal';
  /** Whether header should be sticky */
  sticky?: boolean;
  /** Whether to use center mode layout */
  centerMode?: boolean;
}

export const HeaderWithMobileMenu: React.FC<HeaderWithMobileMenuProps> = ({
  className = '',
  variant = 'default',
  sticky = false,
  centerMode = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Calculate active navigation ID
  const activeId = useMemo(() => {
    if (!pathname) return undefined;
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/foundations')) return 'foundations';
    if (pathname.startsWith('/templates')) return 'templates';
    if (pathname.startsWith('/playground')) return 'playground';
    if (pathname.startsWith('/components/')) {
      const segments = pathname.split('/');
      if (segments.length >= 3) {
        const category = segments[2];
        // Map URLs to navigation categories
        if (category === 'ui') {
          const component = segments[3];
          // Map component to its category
          if (['section', 'row', 'col', 'main', 'aside'].includes(component)) return 'layout';
          if (['heading', 'text'].includes(component)) return 'typography';
          if (['form', 'input', 'textarea', 'select', 'checkbox', 'radio', 'switcher', 'otp', 'date-picker', 'time-picker'].includes(component)) return 'forms';
          if (['button', 'icon-button'].includes(component)) return 'actions';
          if (['nav', 'breadcrumbs', 'pagination', 'tabs'].includes(component)) return 'navigation';
          if (['accordion', 'modal', 'drawer'].includes(component)) return 'disclosure';
          if (['toast', 'badge', 'theme-switcher'].includes(component)) return 'feedback';
          if (['card', 'icon'].includes(component)) return 'data-display';
        }
        return category;
      }
      return 'components';
    }
    if (pathname.startsWith('/components')) return 'components';
    return undefined;
  }, [pathname]);

  const handleMobileMenuToggle = () => {
    console.log('Toggle clicked, current state:', isMobileMenuOpen);
    setIsMobileMenuOpen(prev => {
      const newState = !prev;
      console.log('New state:', newState);
      return newState;
    });
  };

  const handleMobileMenuClose = () => {
    console.log('Closing mobile menu');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <Header className={className} variant={variant} sticky={sticky} centerMode={centerMode}>
        <HeaderMiddle>
          <HeaderContainer>
            <HeaderLeft>
              <HeaderLogo alt="Blocx" href="/" />
            </HeaderLeft>
            <HeaderCenter>
              <HeaderNavMenu activeId={activeId} />
            </HeaderCenter>
            <HeaderRight>
            <HeaderThemeSwitcherSimple />
              <HeaderMobileToggle
                isOpen={isMobileMenuOpen}
                onToggle={handleMobileMenuToggle}
                aria-controls="mobile-navigation-menu"
              />
            </HeaderRight>
          </HeaderContainer>
        </HeaderMiddle>
      </Header>

      <HeaderMobileMenu
        items={navigationItems}
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        activeId={activeId}
      />
    </>
  );
};

export default HeaderWithMobileMenu;
