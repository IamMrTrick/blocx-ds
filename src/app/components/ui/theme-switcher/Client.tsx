'use client';

import React from 'react';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { MorphingToggle } from '@/components/ui/theme-switcher/variants/MorphingToggle';
import { SlidingCard } from '@/components/ui/theme-switcher/variants/SlidingCard';
import { RotatingSphere } from '@/components/ui/theme-switcher/variants/RotatingSphere';
import { MinimalistPill } from '@/components/ui/theme-switcher/variants/MinimalistPill';
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
        <h2>🎨 Beautiful Theme Switcher Variants</h2>
        <p>Choose from 4 stunning designs, each with unique animations and interactions:</p>
        
        <div className="demo-variants">
          <div className="variant-showcase">
            <h3>1. Morphing Toggle</h3>
            <p>Dynamic background with floating elements and smooth morphing animations</p>
            <div className="variant-examples">
              <MorphingToggle size="sm" onThemeChange={handleThemeChange} />
              <MorphingToggle size="md" onThemeChange={handleThemeChange} />
              <MorphingToggle size="lg" onThemeChange={handleThemeChange} />
            </div>
          </div>
          
          <div className="variant-showcase">
            <h3>2. Sliding Card</h3>
            <p>Elegant card-based design with sliding transitions and atmospheric effects</p>
            <div className="variant-examples">
              <SlidingCard size="sm" onThemeChange={handleThemeChange} />
              <SlidingCard size="md" onThemeChange={handleThemeChange} />
              <SlidingCard size="lg" onThemeChange={handleThemeChange} />
            </div>
          </div>
          
          <div className="variant-showcase">
            <h3>3. Rotating Sphere</h3>
            <p>3D sphere with celestial bodies, stars, and atmospheric rotation effects</p>
            <div className="variant-examples">
              <RotatingSphere size="sm" onThemeChange={handleThemeChange} />
              <RotatingSphere size="md" onThemeChange={handleThemeChange} />
              <RotatingSphere size="lg" onThemeChange={handleThemeChange} />
            </div>
          </div>
          
          <div className="variant-showcase">
            <h3>4. Minimalist Pill</h3>
            <p>Clean, minimal design perfect for headers and compact spaces</p>
            <div className="variant-examples">
              <MinimalistPill size="sm" onThemeChange={handleThemeChange} />
              <MinimalistPill size="md" onThemeChange={handleThemeChange} />
              <MinimalistPill size="lg" onThemeChange={handleThemeChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Original Design (Legacy)</h2>
        <div className="demo-examples">
          <div className="example">
            <h3>Default (Medium)</h3>
            <ThemeSwitcher />
          </div>
          
          <div className="example">
            <h3>Small Size</h3>
            <ThemeSwitcher size="sm" />
          </div>
          
          <div className="example">
            <h3>Large Size</h3>
            <ThemeSwitcher size="lg" />
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Without Labels</h2>
        <div className="demo-examples">
          <div className="example">
            <h3>No Labels</h3>
            <ThemeSwitcher showLabels={false} />
          </div>
          
          <div className="example">
            <h3>Small No Labels</h3>
            <ThemeSwitcher size="sm" showLabels={false} />
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Compact Mode (Header Style)</h2>
        <div className="demo-examples">
          <div className="example">
            <h3>Compact</h3>
            <ThemeSwitcher compact={true} showLabels={false} />
          </div>
          
          <div className="example">
            <h3>Compact Small</h3>
            <ThemeSwitcher size="sm" compact={true} showLabels={false} />
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Animation Styles</h2>
        <div className="demo-examples">
          <div className="example">
            <h3>Smooth Animation</h3>
            <ThemeSwitcher animationStyle="smooth" />
          </div>
          
          <div className="example">
            <h3>Bounce Animation</h3>
            <ThemeSwitcher animationStyle="bounce" />
          </div>
          
          <div className="example">
            <h3>Slide Animation</h3>
            <ThemeSwitcher animationStyle="slide" />
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
            <ThemeSwitcher defaultTheme="dark" />
          </div>
        </div>
      </div>
    </div>
  );
}
