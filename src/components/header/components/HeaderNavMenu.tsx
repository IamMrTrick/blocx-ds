'use client';
import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Nav as PrimaryNav, type PrimaryNavItem } from '@/components/ui/nav/primary-nav/PrimaryNav';

export interface HeaderNavMenuProps {
  activeId?: string;
}

const items: PrimaryNavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'components',
    label: 'Components',
    href: '/components',
    children: [
      { id: 'layout', label: 'Layout', href: '/components/layout' },
      { id: 'typography', label: 'Typography', href: '/components/typography' },
      { id: 'forms', label: 'Forms', href: '/components/forms' },
      { id: 'navigation', label: 'Navigation', href: '/components/navigation' },
      { id: 'disclosures', label: 'Disclosures', href: '/components/disclosures' },
      { id: 'feedback', label: 'Feedback', href: '/components/feedback' },
      { id: 'data-display', label: 'Data Display', href: '/components/data-display' },
    ],
  },
  { id: 'docs', label: 'Docs', href: '/docs', external: true },
];

export const HeaderNavMenu: React.FC<HeaderNavMenuProps> = ({ activeId }) => {
  const pathname = usePathname();

  const computedActiveId = useMemo(() => {
    if (activeId) return activeId;
    if (!pathname) return undefined;
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/components/')) {
      const seg = pathname.split('/')[2];
      return seg || 'components';
    }
    if (pathname.startsWith('/components')) return 'components';
    return undefined;
  }, [activeId, pathname]);

  return (
    <PrimaryNav
      items={items}
      activeId={computedActiveId}
      layout="gap"
      gap="md"
      dropdownTrigger="hover"
      dropdownDelay={350}
      variant="horizontal"
      size="md"
      collapsible={true}
    />
  );
};

export default HeaderNavMenu;


