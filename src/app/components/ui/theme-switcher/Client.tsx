'use client';

import React from 'react';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
// All variants are now part of ThemeSwitcher component
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/forms/input';

export default function ThemeSwitcherClient() {
  const handleThemeChange = (theme: 'light' | 'dark') => {
    console.log(`Theme changed to: ${theme}`);
    // You can add custom logic here
  };

  return (
    <div className="theme-switcher-demo">
      <div className="demo-header">
        <h1>Theme Switcher Component</h1>
        <p>Switch between light and dark themes with this interactive component</p>
      </div>

      <div className="demo-section">
        <h2>🎨 Theme Switcher Variants</h2>
        <p>Choose from 3 different designs:</p>
        
        <div className="demo-variants">
          <div className="variant-showcase">
            <h3>1. Button</h3>
            <p>Simple button with icon switching</p>
            <div className="variant-examples">
              <ThemeSwitcher variant="button" size="sm" onThemeChange={handleThemeChange} />
              <ThemeSwitcher variant="button" size="md" onThemeChange={handleThemeChange} />
              <ThemeSwitcher variant="button" size="lg" onThemeChange={handleThemeChange} />
            </div>
          </div>
          
          <div className="variant-showcase">
            <h3>2. Toggle</h3>
            <p>Classic toggle switch design</p>
            <div className="variant-examples">
              <ThemeSwitcher variant="toggle" size="sm" onThemeChange={handleThemeChange} />
              <ThemeSwitcher variant="toggle" size="md" onThemeChange={handleThemeChange} />
              <ThemeSwitcher variant="toggle" size="lg" onThemeChange={handleThemeChange} />
            </div>
          </div>
          
          <div className="variant-showcase">
            <h3>3. Pill</h3>
            <p>Pill-shaped with icons inside</p>
            <div className="variant-examples">
              <ThemeSwitcher variant="pill" size="sm" onThemeChange={handleThemeChange} />
              <ThemeSwitcher variant="pill" size="md" onThemeChange={handleThemeChange} />
              <ThemeSwitcher variant="pill" size="lg" onThemeChange={handleThemeChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Default Usage</h2>
        <div className="demo-examples">
          <div className="example">
            <h3>Default Button</h3>
            <ThemeSwitcher />
          </div>
          
          <div className="example">
            <h3>Small Button</h3>
            <ThemeSwitcher size="sm" />
          </div>
          
          <div className="example">
            <h3>Large Button</h3>
            <ThemeSwitcher size="lg" />
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Interactive Demo</h2>
        <p>Switch themes to see how other components adapt:</p>
        
        <div className="demo-components">
          <Card className="demo-card">
            <h3>Sample Card</h3>
            <p>This card will change appearance based on the selected theme.</p>
            <div className="demo-actions">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
            </div>
          </Card>
          
          <div className="demo-form">
            <h3>Sample Form</h3>
            <Input 
              placeholder="Type something here..."
              label="Sample Input"
              helperText="This input will also adapt to the theme"
            />
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Theme Change Callback</h2>
        <div className="demo-examples">
          <ThemeSwitcher onThemeChange={handleThemeChange} />
          <p>Check the console to see theme change events</p>
        </div>
      </div>

      <div className="demo-section">
        <h2>Custom Initial Theme</h2>
        <div className="demo-examples">
          <div className="example">
            <h3>Dark Theme Default</h3>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
