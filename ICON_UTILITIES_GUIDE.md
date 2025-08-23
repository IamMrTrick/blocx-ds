# Icon Utilities Guide

This guide covers the comprehensive SCSS utility system for icons that aligns with your design tokens and follows best practices.

## 🎯 Overview

The icon utility system provides:
- **Typography-aligned sizes** - Icons that match your text and heading sizes
- **Semantic colors** - Consistent color system across your design
- **Interactive states** - Hover, focus, active, and disabled states
- **Animations** - Loading, pulse, bounce, shake, and fade effects
- **Context utilities** - Special styling for buttons, forms, navigation, etc.
- **Responsive utilities** - Different icon sizes and visibility across breakpoints

## 📏 Size Utilities

### Typography-Aligned Sizes
Icons are sized to match your typography system for perfect alignment:

```scss
// Utility classes
.icon-xxs   // 8px  - matches text-xxs
.icon-xs    // 10px - matches text-xs
.icon-sm    // 12px - matches text-sm
.icon-md    // 14px - matches text-md
.icon-lg    // 16px - matches text-lg (default)
.icon-xl    // 18px - matches text-xl

// Heading-aligned sizes
.icon-h6    // 18px - matches heading-06
.icon-h5    // 20px - matches heading-05
.icon-h4    // 24px - matches heading-04
.icon-h3    // 28px - matches heading-03
.icon-h2    // 36px - matches heading-02
.icon-h1    // 48px - matches heading-01
```

### BEM-Style Modifiers (Alternative)
```scss
.icon--xxs, .icon--xs, .icon--sm, .icon--md, .icon--lg, .icon--xl
.icon--h6, .icon--h5, .icon--h4, .icon--h3, .icon--h2, .icon--h1
```

## 🎨 Color Utilities

### Semantic Colors
```scss
.icon-primary     // Primary text color
.icon-secondary   // Secondary text color
.icon-tertiary    // Tertiary text color
.icon-disabled    // Disabled state color
.icon-accent      // Accent/brand color
.icon-success     // Success state color
.icon-warning     // Warning state color
.icon-error       // Error state color
.icon-info        // Info state color
.icon-inherit     // Inherits parent color (currentColor)
```

### BEM-Style Modifiers (Alternative)
```scss
.icon--primary, .icon--secondary, .icon--tertiary, .icon--disabled
.icon--accent, .icon--success, .icon--warning, .icon--error, .icon--info
```

## 🎭 Interactive States

### Basic Interactive Icon
```scss
.icon-interactive  // Adds hover/focus/active states with scaling
```

### State-Specific Utilities
```scss
// Hover states
.hover:icon-primary:hover
.hover:icon-accent:hover
.hover:icon-success:hover

// Focus states
.focus:icon-primary:focus
.focus:icon-accent:focus

// Active states
.active:icon-primary:active
.active:icon-accent:active

// Disabled states
.disabled:icon-disabled:disabled
```

## 🎬 Animation Utilities

### Loading & Status Animations
```scss
.icon-loading     // Spinning animation
.animate-spin     // Alternative class name

.icon-pulse       // Pulsing animation for notifications
.animate-pulse    // Alternative class name

.icon-bounce      // Bounce animation for success
.animate-bounce   // Alternative class name

.icon-shake       // Shake animation for errors
.animate-shake    // Alternative class name

.icon-fade-in     // Fade in animation
.animate-fade-in  // Alternative class name

.icon-fade-out    // Fade out animation
.animate-fade-out // Alternative class name
```

## 🏗️ Context Utilities

### Icon Buttons
```scss
.icon-btn          // Basic icon button
.icon-btn-primary  // Primary colored icon button
.icon-btn-accent   // Accent colored icon button
.icon-btn-success  // Success colored icon button
.icon-btn-warning  // Warning colored icon button
.icon-btn-error    // Error colored icon button
```

### Icon + Text Combinations
```scss
.icon-text         // Icon followed by text
.icon-text-reverse // Text followed by icon
```

### Icon with Badge/Notification
```scss
.icon-with-badge         // Adds red notification dot
.icon-with-badge.badge-success  // Green notification dot
.icon-with-badge.badge-warning  // Orange notification dot
.icon-with-badge.badge-info     // Blue notification dot
```

### Context-Specific Styling
Icons automatically get proper spacing and colors when used in:
- `.btn` (buttons)
- `.input-group` (form inputs)
- `.nav-item` (navigation)
- `.alert` (alerts/notifications)

## 📱 Responsive Utilities

### Responsive Visibility
```scss
// Hide/show icons at different breakpoints
.sm:icon-hide    // Hide on small screens
.sm:icon-show    // Show on small screens
.md:icon-hide    // Hide on medium screens
.md:icon-show    // Show on medium screens
.lg:icon-hide    // Hide on large screens
.lg:icon-show    // Show on large screens
```

### Responsive Sizing
```scss
// Different sizes at different breakpoints
.sm:icon-xs      // Extra small on small screens
.md:icon-sm      // Small on medium screens
.lg:icon-md      // Medium on large screens
```

## 🔧 Usage Examples

### Basic Icon with Size and Color
```html
<svg class="icon icon-lg icon-primary">
  <!-- icon content -->
</svg>
```

### Interactive Icon Button
```html
<button class="icon-btn-primary">
  <svg class="icon icon-md">
    <!-- icon content -->
  </svg>
</button>
```

### Icon with Text
```html
<div class="icon-text">
  <svg class="icon icon-sm icon-success">
    <!-- check icon -->
  </svg>
  <span>Success message</span>
</div>
```

### Loading Icon
```html
<svg class="icon icon-md icon-primary icon-loading">
  <!-- spinner icon -->
</svg>
```

### Icon with Notification Badge
```html
<div class="icon-with-badge badge-error">
  <svg class="icon icon-lg icon-primary">
    <!-- bell icon -->
  </svg>
</div>
```

### Responsive Icon
```html
<svg class="icon icon-sm md:icon-md lg:icon-lg icon-primary">
  <!-- icon content -->
</svg>
```

### BEM-Style Usage (Alternative)
```html
<svg class="icon icon--lg icon--primary icon--interactive">
  <!-- icon content -->
</svg>
```

## 🎨 CSS Custom Properties

All utilities use CSS custom properties for easy theming:

```scss
:root {
  // Sizes (aligned with typography)
  --icon-size-xxs: var(--text-xxs-size);
  --icon-size-xs: var(--text-xs-size);
  --icon-size-sm: var(--text-sm-size);
  // ... etc

  // Colors (semantic)
  --icon-color-primary: var(--icon-primary);
  --icon-color-secondary: var(--icon-secondary);
  --icon-color-accent: var(--icon-accent);
  // ... etc
}
```

## 🔄 Integration with Your Icon Component

Your existing `Icon.tsx` component already supports these utilities through the `className` prop:

```tsx
<Icon 
  name="search" 
  size="lg" 
  color="primary" 
  className="icon-interactive hover:icon-accent" 
/>
```

## 🎯 Best Practices

1. **Use semantic colors** - Prefer `icon-primary` over specific color values
2. **Match typography sizes** - Use `icon-lg` with `text-lg` for alignment
3. **Combine utilities** - Mix size, color, and state utilities as needed
4. **Use context utilities** - Let `.btn .icon` handle spacing automatically
5. **Prefer utility classes** - Use utilities over custom CSS for consistency
6. **Follow naming conventions** - Use kebab-case for color variables as per your preferences

## 🚀 Performance Notes

- All utilities use CSS custom properties for efficient theming
- Animations use `transform` and `opacity` for optimal performance
- Icon skeleton uses efficient gradient animations
- Responsive utilities minimize CSS output with targeted media queries

This comprehensive utility system gives you maximum flexibility while maintaining consistency with your design tokens and following SCSS best practices!
