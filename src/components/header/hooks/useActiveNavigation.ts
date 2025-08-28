import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook to calculate the active navigation ID based on current pathname
 * Shared logic between desktop and mobile navigation
 */
export const useActiveNavigation = (providedActiveId?: string) => {
  const pathname = usePathname();

  const activeId = useMemo(() => {
    // If activeId is explicitly provided, use it
    if (providedActiveId) return providedActiveId;
    
    if (!pathname) return undefined;
    
    // Home page
    if (pathname === '/') return 'home';
    
    // Top-level sections
    if (pathname.startsWith('/foundations')) return 'foundations';
    if (pathname.startsWith('/templates')) return 'templates';
    if (pathname.startsWith('/playground')) return 'playground';
    
    // Components section with detailed mapping
    if (pathname.startsWith('/components/')) {
      const segments = pathname.split('/');
      if (segments.length >= 3) {
        const category = segments[2];
        
        // Map URLs to navigation categories for UI components
        if (category === 'ui') {
          const component = segments[3];
          
          // Layout components
          if (['section', 'row', 'col', 'main', 'aside'].includes(component)) {
            return 'layout';
          }
          
          // Typography components
          if (['heading', 'text'].includes(component)) {
            return 'typography';
          }
          
          // Form components
          if ([
            'form', 'input', 'textarea', 'select', 'checkbox', 
            'radio', 'switcher', 'otp', 'date-picker', 'time-picker'
          ].includes(component)) {
            return 'forms';
          }
          
          // Action components
          if (['button', 'icon-button'].includes(component)) {
            return 'actions';
          }
          
          // Navigation components
          if (['nav', 'breadcrumbs', 'pagination', 'tabs'].includes(component)) {
            return 'navigation';
          }
          
          // Disclosure components
          if (['accordion', 'modal', 'drawer'].includes(component)) {
            return 'disclosure';
          }
          
          // Feedback components
          if (['toast', 'badge', 'theme-switcher'].includes(component)) {
            return 'feedback';
          }
          
          // Data display components
          if (['card', 'icon'].includes(component)) {
            return 'data-display';
          }
        }
        
        // Return category if not mapped above
        return category;
      }
      
      // Fallback to components
      return 'components';
    }
    
    // Fallback for any components path
    if (pathname.startsWith('/components')) return 'components';
    
    return undefined;
  }, [pathname, providedActiveId]);

  return activeId;
};
