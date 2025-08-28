# Theme Switcher Component

A beautiful and accessible theme switcher component that allows users to toggle between light and dark themes.

## Features

- 🌓 **Light/Dark Theme Toggle** - Smooth transitions between themes
- 📱 **Responsive Design** - Works perfectly on all device sizes
- ♿ **Accessibility First** - Full keyboard navigation and screen reader support
- 🎨 **Customizable Sizes** - Small, medium, and large variants
- 🏷️ **Optional Labels** - Show or hide theme labels
- 💾 **Persistent Storage** - Remembers user preference in localStorage
- 🌐 **System Theme Detection** - Automatically detects system preference
- 🎭 **Smooth Animations** - Beautiful transitions and hover effects

## Usage

### Basic Usage

```tsx
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

function App() {
  return (
    <div>
      <ThemeSwitcher />
    </div>
  );
}
```

### With Custom Props

```tsx
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

function App() {
  const handleThemeChange = (theme: 'light' | 'dark') => {
    console.log(`Theme changed to: ${theme}`);
    // Add your custom logic here
  };

  return (
    <div>
      <ThemeSwitcher
        defaultTheme="dark"
        size="lg"
        showLabels={false}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultTheme` | `'light' \| 'dark'` | `'light'` | Initial theme to display |
| `onThemeChange` | `(theme: 'light' \| 'dark') => void` | `undefined` | Callback when theme changes |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the theme switcher |
| `showLabels` | `boolean` | `true` | Whether to show theme labels |
| `className` | `string` | `''` | Additional CSS class name |

## Sizes

### Small (`size="sm"`)
- Container: 32px × 20px
- Toggle: 16px × 16px
- Icons: 16px
- Labels: Extra small text

### Medium (`size="md"`) - Default
- Container: 40px × 24px
- Toggle: 20px × 20px
- Icons: 20px
- Labels: Small text

### Large (`size="lg"`)
- Container: 48px × 28px
- Toggle: 24px × 24px
- Icons: 24px
- Labels: Base text

## Theme Integration

The component automatically integrates with your CSS custom properties:

### Light Theme (Default)
```css
:root {
  --bg-primary: #FFFFFF;
  --text-primary: #0C0C0E;
  --border-primary: #9E8DB0;
  /* ... other variables */
}
```

### Dark Theme
```css
[data-theme="dark"] {
  --bg-primary: #070708;
  --text-primary: #FAFAFA;
  --border-primary: #29232F;
  /* ... other variables */
}
```

## Accessibility

- **Keyboard Navigation**: Full focus support with `Tab` key
- **Screen Readers**: Proper ARIA labels and descriptions
- **High Contrast**: Enhanced visibility in high contrast mode
- **Reduced Motion**: Respects user's motion preferences
- **Touch Targets**: Minimum 44px touch targets on mobile

## Browser Support

- ✅ Chrome 88+
- ✅ Firefox 87+
- ✅ Safari 14+
- ✅ Edge 88+

## Examples

### Header Integration

```tsx
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <Logo />
      </div>
      <div className="header__right">
        <ThemeSwitcher size="sm" showLabels={false} />
        <UserMenu />
      </div>
    </header>
  );
}
```

### Sidebar Integration

```tsx
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        {/* Navigation items */}
      </nav>
      <div className="sidebar__footer">
        <ThemeSwitcher size="md" />
      </div>
    </aside>
  );
}
```

### Modal Integration

```tsx
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

function SettingsModal() {
  return (
    <Modal title="Settings">
      <div className="settings-section">
        <h3>Appearance</h3>
        <ThemeSwitcher 
          size="lg" 
          onThemeChange={(theme) => {
            // Update user preferences
            updateUserPreference('theme', theme);
          }}
        />
      </div>
    </Modal>
  );
}
```

## Styling

The component uses CSS custom properties for theming. You can customize the appearance by overriding these variables:

```scss
.theme-switcher {
  // Custom colors
  --theme-switcher-bg: var(--bg-quinary-alt);
  --theme-switcher-border: var(--border-primary);
  --theme-switcher-toggle-bg: var(--bg-primary);
  
  // Custom sizes
  --theme-switcher-container-width: 40px;
  --theme-switcher-container-height: 24px;
}
```

## Performance

- **Efficient Rendering**: Only re-renders when theme changes
- **Smooth Animations**: Uses CSS transforms for optimal performance
- **Minimal DOM Updates**: Efficient state management
- **Lazy Loading**: Icons are loaded only when needed

## Troubleshooting

### Theme Not Persisting
Make sure localStorage is available and not blocked:
```tsx
// Check if localStorage is available
if (typeof window !== 'undefined' && window.localStorage) {
  // ThemeSwitcher will work
}
```

### Icons Not Showing
Ensure the Icon component is properly imported and configured:
```tsx
import { Icon } from '@/components/ui/icon';
// Make sure sun and moon icons are available
```

### Theme Not Applying
Verify your CSS custom properties are properly defined:
```css
:root {
  /* Light theme variables */
}

[data-theme="dark"] {
  /* Dark theme variables */
}
```

## Contributing

When contributing to this component:

1. Follow the BEM methodology for CSS classes
2. Ensure all props are properly typed
3. Add comprehensive tests
4. Update this README with new features
5. Test accessibility with screen readers
6. Verify performance on mobile devices

## License

This component is part of the Blocx Design System and follows the same licensing terms.
