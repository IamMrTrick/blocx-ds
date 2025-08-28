# Effects Utilities

This directory contains utility classes for creating visual effects including opacity, backdrop-blur, and shadows.

## Files

- `_color-utils.scss` - Color and opacity utilities
- `_effects-utils.scss` - Backdrop-blur and shadow utilities

## Opacity Utilities

Control element transparency with opacity utility classes.

### Basic Opacity Classes

```scss
.opacity-0    { opacity: 0; }      // Completely transparent
.opacity-10   { opacity: 0.1; }    // 10% opacity
.opacity-20   { opacity: 0.2; }    // 20% opacity
.opacity-30   { opacity: 0.3; }    // 30% opacity
.opacity-40   { opacity: 0.4; }    // 40% opacity
.opacity-50   { opacity: 0.5; }    // 50% opacity
.opacity-60   { opacity: 0.6; }    // 60% opacity
.opacity-70   { opacity: 0.7; }    // 70% opacity
.opacity-80   { opacity: 0.8; }    // 80% opacity
.opacity-90   { opacity: 0.9; }    // 90% opacity
.opacity-100  { opacity: 1; }      // Completely opaque
```

### Usage Examples

```html
<!-- Semi-transparent overlay -->
<div class="opacity-50 bg-black">Overlay content</div>

<!-- Faded text -->
<p class="opacity-70">Secondary information</p>

<!-- Hidden element -->
<div class="opacity-0">Hidden content</div>
```

## Backdrop Blur Utilities

Apply backdrop blur effects to create frosted glass effects.

### Basic Blur Classes

```scss
.backdrop-blur-none  { backdrop-filter: blur(0); }      // No blur
.backdrop-blur-sm    { backdrop-filter: blur(4px); }    // Small blur
.backdrop-blur       { backdrop-filter: blur(8px); }    // Default blur
.backdrop-blur-md    { backdrop-filter: blur(12px); }   // Medium blur
.backdrop-blur-lg    { backdrop-filter: blur(16px); }   // Large blur
.backdrop-blur-xl    { backdrop-filter: blur(24px); }   // Extra large blur
.backdrop-blur-2xl   { backdrop-filter: blur(40px); }   // 2x blur
.backdrop-blur-3xl   { backdrop-filter: blur(64px); }   // 3x blur
```

### Usage Examples

```html
<!-- Frosted glass card -->
<div class="backdrop-blur-md bg-white/80">
  <h3>Glass Effect Card</h3>
  <p>Content with backdrop blur</p>
</div>

<!-- Modal backdrop -->
<div class="backdrop-blur-lg bg-black/50">
  Modal content
</div>
```

## Shadow Utilities

Apply various shadow effects for depth and visual hierarchy.

### Basic Shadow Classes

```scss
.shadow-none  { box-shadow: none; }
.shadow-sm    { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.shadow       { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
.shadow-md    { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
.shadow-lg    { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
.shadow-xl    { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
.shadow-2xl   { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
```

### Colored Shadows

```scss
.shadow-primary    { box-shadow: 0 4px 12px var(--transparent-primary-20); }
.shadow-secondary  { box-shadow: 0 4px 12px var(--transparent-secondary-20); }
.shadow-success    { box-shadow: 0 4px 12px var(--transparent-success-20); }
.shadow-warning    { box-shadow: 0 4px 12px var(--transparent-warning-20); }
.shadow-error      { box-shadow: 0 4px 12px var(--transparent-error-20); }
.shadow-info       { box-shadow: 0 4px 12px var(--transparent-info-20); }
```

### Button Shadows

```scss
.shadow-btn-primary    { box-shadow: 0 4px 12px var(--shadow-btn-primary); }
.shadow-btn-secondary  { box-shadow: 0 4px 12px var(--shadow-btn-secondary); }
.shadow-btn-success    { box-shadow: 0 4px 12px var(--shadow-btn-success); }
.shadow-btn-warning    { box-shadow: 0 4px 12px var(--shadow-btn-warning); }
.shadow-btn-error      { box-shadow: 0 4px 12px var(--shadow-btn-error); }
.shadow-btn-info       { box-shadow: 0 4px 12px var(--shadow-btn-info); }
```

### Card Shadows

```scss
.shadow-card      { box-shadow: 0 4px 8px var(--card-shadow); }
.shadow-card-lg   { box-shadow: 0 8px 24px var(--card-shadow); }
.shadow-card-xl   { box-shadow: 0 12px 32px var(--card-shadow); }
```

### Header Shadows

```scss
.shadow-header         { box-shadow: var(--header-shadow-sticky); }
.shadow-header-search  { box-shadow: var(--header-shadow-search-focus); }
.shadow-header-mobile  { box-shadow: var(--header-shadow-mobile); }
```

### Navigation Shadows

```scss
.shadow-nav-submenu    { box-shadow: var(--nav-submenu-shadow); }
.shadow-nav-nested     { box-shadow: var(--nav-submenu-nested-shadow); }
.shadow-nav-mega       { box-shadow: var(--nav-mega-shadow); }
.shadow-nav-mobile     { box-shadow: var(--nav-mobile-shadow); }
```

### Inner Shadows

```scss
.shadow-inner      { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
.shadow-inner-sm   { box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.shadow-inner-md   { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
.shadow-inner-lg   { box-shadow: inset 0 4px 6px 0 rgba(0, 0, 0, 0.1); }
```

### Focus Shadows

```scss
.shadow-focus           { box-shadow: 0 0 0 3px var(--transparent-primary-10); }
.shadow-focus-primary   { box-shadow: 0 0 0 3px var(--transparent-primary-20); }
.shadow-focus-secondary { box-shadow: 0 0 0 3px var(--transparent-secondary-20); }
.shadow-focus-success   { box-shadow: 0 0 0 3px var(--transparent-success-20); }
.shadow-focus-warning   { box-shadow: 0 0 0 3px var(--transparent-warning-20); }
.shadow-focus-error     { box-shadow: 0 0 0 3px var(--transparent-error-20); }
.shadow-focus-info      { box-shadow: 0 0 0 3px var(--transparent-info-20); }
```

### Usage Examples

```html
<!-- Basic shadow -->
<div class="shadow-md bg-white p-4 rounded-lg">
  Card with medium shadow
</div>

<!-- Colored shadow -->
<button class="shadow-primary bg-primary-05 text-white px-4 py-2 rounded">
  Button with primary shadow
</button>

<!-- Focus shadow -->
<input class="focus:shadow-focus border border-gray-300 px-3 py-2 rounded" />

<!-- Inner shadow -->
<div class="shadow-inner bg-gray-100 p-4 rounded">
  Inset shadow effect
</div>
```

## State Variants

### Hover Effects

```scss
.hover\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
.hover\:shadow-primary:hover { box-shadow: 0 4px 12px var(--transparent-primary-20); }
```

### Focus Effects

```scss
.focus\:shadow-focus:focus { box-shadow: 0 0 0 3px var(--transparent-primary-10); }
.focus\:shadow-focus-primary:focus { box-shadow: 0 0 0 3px var(--transparent-primary-20); }
```

### Active Effects

```scss
.active\:shadow-sm:active { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.active\:shadow:active { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
```

## Responsive Variants

### Small Screen (max-width: 768px)

```scss
.sm\:backdrop-blur-sm { backdrop-filter: blur(4px); }
.sm\:shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
```

### Medium Screen (min-width: 768px)

```scss
.md\:backdrop-blur-md { backdrop-filter: blur(12px); }
.md\:shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
```

### Large Screen (min-width: 1024px)

```scss
.lg\:backdrop-blur-lg { backdrop-filter: blur(16px); }
.lg\:shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
```

### Extra Large Screen (min-width: 1280px)

```scss
.xl\:backdrop-blur-xl { backdrop-filter: blur(24px); }
.xl\:shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
```

## Print Styles

```scss
.print\:shadow-none { box-shadow: none !important; }
.print\:backdrop-blur-none { backdrop-filter: none !important; }
```

## Best Practices

1. **Use shadows sparingly** - Too many shadows can create visual noise
2. **Match shadow intensity to elevation** - Higher elements should have stronger shadows
3. **Consider color context** - Use colored shadows that complement your design system
4. **Test on different backgrounds** - Ensure shadows are visible and appropriate
5. **Use backdrop-blur for modern UI** - Great for modals, overlays, and glass effects
6. **Combine with transitions** - Smooth transitions make effects feel more polished

## Browser Support

- **Opacity**: All modern browsers
- **Box-shadow**: All modern browsers
- **Backdrop-filter**: Modern browsers (check [caniuse.com](https://caniuse.com/?search=backdrop-filter) for details)

## Demo

Visit `/components/ui/effects` to see all utilities in action with interactive examples.
