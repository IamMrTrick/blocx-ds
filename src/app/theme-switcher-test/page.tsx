'use client';
import React from 'react';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeSwitcherTestPage() {
  const { theme } = useTheme();

  return (
    <div style={{ 
      padding: '2rem',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      transition: 'all 0.3s ease'
    }}>
      <h1>Theme Switcher Test</h1>
      <p>Current theme: <strong>{theme}</strong></p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginTop: '2rem'
      }}>
        
        {/* Test در کارت */}
        <div style={{ 
          padding: '2rem', 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: '12px',
          border: '1px solid var(--border-primary)'
        }}>
          <h3>در کارت</h3>
          <p>Theme switcher در داخل کارت:</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <ThemeSwitcher variant="button" size="sm" />
            <ThemeSwitcher variant="toggle" size="md" />
            <ThemeSwitcher variant="pill" size="lg" />
          </div>
        </div>

        {/* Test در header شبیه‌سازی شده */}
        <div style={{ 
          padding: '1rem 2rem', 
          backgroundColor: 'var(--nav-main-bg)', 
          borderRadius: '12px',
          border: '1px solid var(--nav-main-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3>شبیه‌سازی Header</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <ThemeSwitcher variant="button" size="sm" />
            <button style={{ 
              padding: '8px 16px', 
              backgroundColor: 'transparent',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}>
              Menu
            </button>
          </div>
        </div>

        {/* Test ThemeSwitcher variant="pill" */}
        <div style={{ 
          padding: '2rem', 
          backgroundColor: 'var(--bg-tertiary)', 
          borderRadius: '12px',
          border: '1px solid var(--border-primary)'
        }}>
          <h3>ThemeSwitcher variant=&quot;pill&quot; Variants</h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            alignItems: 'flex-start',
            marginTop: '1rem'
          }}>
            <div>
              <p>Small:</p>
              <ThemeSwitcher variant="pill" size="sm" />
            </div>
            <div>
              <p>Medium:</p>
              <ThemeSwitcher variant="pill" size="md" />
            </div>
            <div>
              <p>Large:</p>
              <ThemeSwitcher variant="pill" size="lg" />
            </div>
          </div>
        </div>

        {/* Test در sidebar شبیه‌سازی شده */}
        <div style={{ 
          padding: '2rem', 
          backgroundColor: 'var(--bg-quaternary)', 
          borderRadius: '12px',
          border: '1px solid var(--border-primary)',
          minHeight: '300px'
        }}>
          <h3>شبیه‌سازی Sidebar</h3>
          <div style={{ marginTop: '2rem' }}>
            <p>Navigation items...</p>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-primary)' }}>
              <p>Theme:</p>
              <ThemeSwitcher variant="button" size="md" />
            </div>
          </div>
        </div>

        {/* Test در modal شبیه‌سازی شده */}
        <div style={{ 
          padding: '2rem', 
          backgroundColor: 'var(--bg-primary)', 
          borderRadius: '12px',
          border: '2px solid var(--border-active)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
        }}>
          <h3>شبیه‌سازی Modal</h3>
          <p>Theme switcher در modal:</p>
          <div style={{ 
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-primary)'
          }}>
            <span>تنظیمات تم:</span>
            <ThemeSwitcher variant="pill" size="sm" />
          </div>
        </div>

        {/* Test در footer شبیه‌سازی شده */}
        <div style={{ 
          padding: '2rem', 
          backgroundColor: 'var(--bg-senary)', 
          borderRadius: '12px',
          border: '1px solid var(--border-primary)'
        }}>
          <h3>شبیه‌سازی Footer</h3>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem'
          }}>
            <div>
              <p>© 2024 Company</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span>Theme:</span>
              <ThemeSwitcher variant="button" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Test اضافی برای اطمینان */}
      <div style={{ 
        marginTop: '3rem',
        padding: '2rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h2>تست نهایی</h2>
        <p>اگر همه switcher های بالا کار می‌کنند، پس theme switcher در همه جا قابل استفاده است!</p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2rem', 
          marginTop: '2rem',
          flexWrap: 'wrap'
        }}>
          <ThemeSwitcher variant="button" size="lg" />
          <ThemeSwitcher variant="pill" size="lg" />
        </div>
      </div>
    </div>
  );
}
