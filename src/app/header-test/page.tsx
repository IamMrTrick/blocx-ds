'use client';
import React, { useState, useEffect } from 'react';

export default function HeaderTestPage() {
  const [headerInfo, setHeaderInfo] = useState({
    currentHeight: '80px',
    spacingTop: '80px',
    isTransparent: '0'
  });
  const [variant, setVariant] = useState<'default' | 'transparent' | 'minimal'>('default');

  // Read CSS variables
  useEffect(() => {
    const updateHeaderInfo = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      setHeaderInfo({
        currentHeight: computedStyle.getPropertyValue('--header-current-height').trim() || '80px',
        spacingTop: computedStyle.getPropertyValue('--header-spacing-top').trim() || '80px',
        isTransparent: computedStyle.getPropertyValue('--header-is-transparent').trim() || '0'
      });
    };

    // Initial read
    updateHeaderInfo();

    // Update periodically to catch changes
    const interval = setInterval(updateHeaderInfo, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Header Spacing Test Page</h1>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '1rem', 
        marginBottom: '2rem',
        borderRadius: '8px'
      }}>
        <h2>Header State Information (CSS Variables)</h2>
        <ul>
          <li><strong>Current Height:</strong> {headerInfo.currentHeight}</li>
          <li><strong>Spacing Top:</strong> {headerInfo.spacingTop}</li>
          <li><strong>Is Transparent:</strong> {headerInfo.isTransparent === '1' ? 'Yes' : 'No'}</li>
          <li><strong>Calculated Padding:</strong> {headerInfo.isTransparent === '1' ? '0px' : headerInfo.spacingTop}</li>
        </ul>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Test Different Variants</h2>
        <p>Change the header variant to see how spacing changes:</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            onClick={() => setVariant('default')}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: variant === 'default' ? '#007bff' : '#e9ecef',
              color: variant === 'default' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Default
          </button>
          <button 
            onClick={() => setVariant('transparent')}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: variant === 'transparent' ? '#007bff' : '#e9ecef',
              color: variant === 'transparent' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Transparent
          </button>
          <button 
            onClick={() => setVariant('minimal')}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: variant === 'minimal' ? '#007bff' : '#e9ecef',
              color: variant === 'minimal' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Minimal
          </button>
        </div>
      </div>

      <div style={{ 
        background: '#fff3cd', 
        padding: '1rem', 
        marginBottom: '2rem',
        borderRadius: '8px',
        border: '1px solid #ffeaa7'
      }}>
        <h3>How It Works</h3>
        <p>
          این سیستم به طور خودکار تشخیص می‌دهد که آیا هدر transparent است یا نه و بر اساس آن 
          به main content مقدار padding-top مناسب اضافه می‌کند:
        </p>
        <ul>
          <li><strong>Default/Minimal:</strong> padding-top اضافه می‌شود</li>
          <li><strong>Transparent (غیر sticky):</strong> padding-top اضافه نمی‌شود</li>
          <li><strong>Transparent (sticky شده):</strong> padding-top اضافه می‌شود</li>
        </ul>
      </div>

      <div style={{ height: '200vh', background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)' }}>
        <h3>Scroll down to test sticky behavior</h3>
        <p>وقتی اسکرول کنید، هدر sticky می‌شود و spacing به طور خودکار تنظیم می‌شود.</p>
        
        <div style={{ marginTop: '50vh', padding: '2rem', background: 'white', borderRadius: '8px' }}>
          <h4>Middle of page</h4>
          <p>اینجا وسط صفحه است. اگر اسکرول کرده باشید، هدر باید sticky شده باشد.</p>
        </div>
        
        <div style={{ marginTop: '50vh', padding: '2rem', background: 'white', borderRadius: '8px' }}>
          <h4>End of page</h4>
          <p>اینجا انتهای صفحه است.</p>
        </div>
      </div>
    </div>
  );
}
