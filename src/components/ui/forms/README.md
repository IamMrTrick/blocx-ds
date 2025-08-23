# Forms System

A comprehensive, accessible, and type-safe forms system built with React, TypeScript, and BEM methodology. This system provides a complete set of form components with built-in validation, state management, and design token integration.

## 🚀 Features

- **Complete Form Components**: Input, TextArea, Select, Checkbox, RadioButton, OTP, and Form wrapper
- **BEM Methodology**: Clean, maintainable CSS architecture
- **Design Token Integration**: Consistent styling through CSS custom properties
- **Full Accessibility**: ARIA attributes, keyboard navigation, screen reader support
- **TypeScript Support**: Full type safety and IntelliSense
- **Validation System**: Built-in validation with custom rules
- **State Management**: Context-based form state with hooks
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces
- **Loading States**: Built-in loading and disabled states
- **Multiple Variants**: Different visual styles and sizes
- **Auto-resize**: Smart text areas that grow with content
- **OTP Support**: One-time password inputs with auto-navigation

## 📦 Components

### Form
The main form wrapper component with validation and state management.

```tsx
import { Form, useForm } from '@/components/ui/forms';

<Form
  variant="card"
  title="User Registration"
  onSubmit={handleSubmit}
  validationRules={{
    email: { required: true, pattern: /\S+@\S+\.\S+/ },
    password: { required: true, minLength: 8 }
  }}
>
  {/* Form fields */}
</Form>
```

### Input
Versatile input component with multiple types and states.

```tsx
import { Input } from '@/components/ui/forms';

<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  startIcon={<Icon name="mail" />}
  error="Please enter a valid email"
  required
/>
```

### TextArea
Multi-line text input with auto-resize capability.

```tsx
import { TextArea } from '@/components/ui/forms';

<TextArea
  label="Description"
  placeholder="Enter description..."
  autoResize
  minRows={3}
  maxRows={8}
  maxLength={500}
  showCharCount
/>
```

### Select
Dropdown selection with native and custom modes.

```tsx
import { Select } from '@/components/ui/forms';

<Select
  label="Country"
  placeholder="Select country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' }
  ]}
  searchable
/>
```

### Checkbox
Custom styled checkbox with indeterminate state.

```tsx
import { Checkbox } from '@/components/ui/forms';

<Checkbox
  label="Accept terms and conditions"
  helperText="You must accept to continue"
  required
/>
```

### RadioButton & RadioGroup
Radio button selection with group management.

```tsx
import { RadioGroup, RadioButton } from '@/components/ui/forms';

<RadioGroup
  label="Notification Preference"
  value={selected}
  onChange={setSelected}
>
  <RadioButton value="all" label="All notifications" />
  <RadioButton value="important" label="Important only" />
  <RadioButton value="none" label="No notifications" />
</RadioGroup>
```

### OTP
One-time password input with auto-navigation.

```tsx
import { OTP } from '@/components/ui/forms';

<OTP
  length={6}
  numericOnly
  autoSubmit
  onComplete={(code) => verifyCode(code)}
  label="Enter verification code"
/>
```

## 🎨 Variants and Sizes

### Form Variants
- `default`: Standard form layout
- `card`: Card-style with borders and shadows
- `inline`: Horizontal layout for compact forms

### Component Sizes
- `xs`: Extra small (mobile-optimized)
- `s`: Small
- `m`: Medium (default)
- `l`: Large
- `xl`: Extra large

### State Variants
- `default`: Normal state
- `error`: Error state with red styling
- `success`: Success state with green styling
- `warning`: Warning state with yellow styling

## 🔧 Validation System

The forms system includes a comprehensive validation system with built-in rules:

```tsx
const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email'
    }
  },
  password: {
    required: true,
    minLength: { value: 8, message: 'At least 8 characters' },
    validate: (value) => {
      if (!/(?=.*[a-z])/.test(value)) return 'Must contain lowercase';
      if (!/(?=.*[A-Z])/.test(value)) return 'Must contain uppercase';
      if (!/(?=.*\d)/.test(value)) return 'Must contain number';
      return true;
    }
  },
  confirmPassword: {
    custom: (value, formData) => {
      return value === formData.password || 'Passwords must match';
    }
  }
};
```

### Available Validation Rules
- `required`: Field is required
- `minLength`: Minimum character length
- `maxLength`: Maximum character length
- `min`: Minimum numeric value
- `max`: Maximum numeric value
- `pattern`: Regular expression pattern
- `validate`: Custom validation function
- `custom`: Custom validation with access to all form data

## 🎯 Form State Management

Use the `useForm` hook to access form state and methods:

```tsx
const FormComponent = () => {
  const { register, setValue, getValues, validate, reset } = useForm();
  
  return (
    <Form onSubmit={handleSubmit}>
      <Input {...register('email')} label="Email" />
      <Input {...register('password')} label="Password" />
      
      <button type="button" onClick={() => reset()}>
        Reset Form
      </button>
    </Form>
  );
};
```

### Form State Properties
- `values`: Current form values
- `errors`: Validation errors
- `touched`: Fields that have been interacted with
- `isSubmitting`: Form submission state
- `isValid`: Overall form validity
- `isDirty`: Whether form has been modified

## ♿ Accessibility Features

All components are built with accessibility in mind:

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Logical focus flow
- **Error Announcements**: Screen reader error notifications
- **High Contrast Support**: Enhanced visibility options
- **Touch Targets**: Mobile-friendly interaction areas
- **Reduced Motion**: Respects user motion preferences

## 📱 Responsive Design

The forms system is mobile-first and responsive:

- **Touch-friendly**: Larger touch targets on mobile
- **Adaptive Layouts**: Forms adapt to screen size
- **Readable Text**: Appropriate font sizes across devices
- **Accessible Spacing**: Comfortable spacing on all screens

## 🎨 Styling Architecture

### BEM Methodology
All components use BEM (Block Element Modifier) naming:

```scss
.input-wrapper { /* Block */ }
.input-wrapper__field { /* Element */ }
.input-wrapper--error { /* Modifier */ }
```

### Design Tokens
Styling is controlled through CSS custom properties:

```scss
:root {
  --input-bg: var(--base-white);
  --input-border: var(--border-primary);
  --input-text: var(--text-primary);
  --input-border-focus: var(--border-focus);
}
```

### Component Structure
Each component follows a consistent structure:
- `ComponentName.tsx`: React component
- `ComponentName.scss`: BEM styles
- `index.ts`: Exports

## 🚀 Getting Started

1. **Import components**:
```tsx
import { Form, Input, Button } from '@/components/ui/forms';
```

2. **Create a basic form**:
```tsx
const MyForm = () => (
  <Form onSubmit={(data) => console.log(data)}>
    <Input label="Name" placeholder="Enter your name" />
    <Button type="submit">Submit</Button>
  </Form>
);
```

3. **Add validation**:
```tsx
<Form
  validationRules={{
    name: { required: 'Name is required' }
  }}
  onSubmit={handleSubmit}
>
  <Input {...useForm().register('name')} label="Name" />
</Form>
```

## 📚 Examples

Check out `FormExamples.tsx` for comprehensive examples including:
- Login forms with validation
- Profile forms with multiple field types
- OTP verification flows
- Inline search forms
- Validation demonstrations
- Size variant showcases

## 🔧 Customization

### Custom Validation
```tsx
const customValidation = {
  username: {
    validate: async (value) => {
      const isAvailable = await checkUsernameAvailability(value);
      return isAvailable || 'Username is already taken';
    }
  }
};
```

### Custom Styling
Override CSS custom properties for theming:

```scss
.my-form {
  --input-border-focus: #your-brand-color;
  --btn-primary-bg: #your-brand-color;
}
```

### Custom Components
Extend existing components or create new ones following the same patterns:

```tsx
const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
  // Custom implementation
});
```

## 🧪 Testing

Components are designed to be easily testable:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/forms';

test('shows error message', () => {
  render(<Input label="Email" error="Invalid email" />);
  expect(screen.getByText('Invalid email')).toBeInTheDocument();
});
```

## 📈 Performance

- **Code Splitting**: Components can be imported individually
- **Optimized Renders**: Minimal re-renders with proper memoization
- **Lazy Loading**: Heavy components load only when needed
- **Bundle Size**: Tree-shakeable exports

## 🔄 Migration Guide

When upgrading or migrating:

1. **Check Breaking Changes**: Review component API changes
2. **Update Imports**: Ensure correct import paths
3. **Validate Styles**: Check for CSS custom property changes
4. **Test Functionality**: Verify form behavior
5. **Accessibility**: Re-test accessibility features

## 🤝 Contributing

When contributing to the forms system:

1. Follow BEM methodology for CSS
2. Maintain TypeScript strict mode compliance
3. Include accessibility features
4. Add comprehensive examples
5. Update documentation
6. Test across devices and browsers

## 📄 License

This forms system is part of the Blocx design system and follows the same licensing terms.
