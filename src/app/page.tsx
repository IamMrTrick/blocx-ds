'use client';
import React, { useState } from 'react';
import { Icon, IconSkeleton } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Form, 
  Input, 
  TextArea, 
  Select, 
  Checkbox, 
  RadioButton, 
  RadioGroup, 
  OTP,
  useForm
} from '@/components/ui/forms';
import './page.scss';

// Sample data for forms
const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' }
];

// Login Form Component
const LoginFormExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: Record<string, unknown>) => {
    setIsLoading(true);
    console.log('Login data:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <Form
      variant="card"
      title="Sign In"
      description="Enter your credentials to access your account"
      onSubmit={handleLogin}
      loading={isLoading}
      validationRules={{
        email: {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
          }
        },
        password: {
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters'
          }
        }
      }}
    >
      <FormContent />
    </Form>
  );
};

// Form content component to use useForm hook
const FormContent: React.FC = () => {
  const { register } = useForm();
  
  return (
    <>
      <Input
        {...register('email')}
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        startIcon={<Icon name="mail" fallback={<IconSkeleton className="icon-skeleton icon-size-md" />} />}
        autoComplete="email"
        required
      />
      
      <Input
        {...register('password')}
        label="Password"
        type="password"
        placeholder="Enter your password"
        startIcon={<Icon name="lock" fallback={<IconSkeleton className="icon-skeleton icon-size-md" />} />}
        autoComplete="current-password"
        required
      />
      
      <Checkbox
        {...register('rememberMe')}
        label="Remember me for 30 days"
        helperText="You can always sign out from your account settings"
      />
      
      <div className="form-actions form-actions--center">
        <Button type="submit" variant="primary" size="l">
          <Icon name="log-in" fallback={<IconSkeleton className="icon-skeleton icon-size-lg" />} />
          Sign In
        </Button>
      </div>
    </>
  );
};

// Profile Form Component
const ProfileFormExample: React.FC = () => {
  const handleProfileUpdate = async (data: Record<string, unknown>) => {
    console.log('Profile data:', data);
  };

  return (
    <Form
      variant="default"
      title="Edit Profile"
      description="Update your personal information and preferences"
      onSubmit={handleProfileUpdate}
      validationRules={{
        firstName: { required: 'First name is required' },
        lastName: { required: 'Last name is required' },
        email: {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
          }
        },
        bio: {
          maxLength: {
            value: 500,
            message: 'Bio must not exceed 500 characters'
          }
        },
        country: { required: 'Please select your country' },
        notifications: { required: 'Please select a notification preference' },
        terms: {
          validate: (value) => value || 'You must accept the terms and conditions'
        }
      }}
    >
      <ProfileFormContent />
    </Form>
  );
};

const ProfileFormContent: React.FC = () => {
  const { register } = useForm();
  
  return (
    <>
      {/* Personal Information Group */}
      <div className="form-field-group">
        <h3 className="form-field-group__title">Personal Information</h3>
        <div className="form-field-group__fields form-field-group__fields--grid">
          <Input
            {...register('firstName')}
            label="First Name"
            placeholder="Enter your first name"
            startIcon={<Icon name="user" fallback={<IconSkeleton className="icon-skeleton icon-size-md" />} />}
            required
          />
          
          <Input
            {...register('lastName')}
            label="Last Name"
            placeholder="Enter your last name"
            required
          />
        </div>
        
        <Input
          {...register('email')}
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          startIcon={<Icon name="mail" fallback={<IconSkeleton className="icon-skeleton icon-size-md" />} />}
          required
        />
        
        <TextArea
          {...register('bio')}
          label="Bio"
          placeholder="Tell us about yourself..."
          maxLength={500}
          showCharCount
          helperText="This will be displayed on your public profile"
          autoResize
          minRows={3}
          maxRows={6}
        />
      </div>

      {/* Location & Preferences Group */}
      <div className="form-field-group">
        <h3 className="form-field-group__title">Location & Preferences</h3>
        
        <Select
          {...register('country')}
          label="Country"
          placeholder="Select your country"
          options={countryOptions}
          searchable
          startIcon={<Icon name="globe" fallback={<IconSkeleton className="icon-skeleton icon-size-md" />} />}
          required
        />
        
        <div>
          <label className="form-field-group__title">Email Notifications</label>
          <p className="form-field-group__description">Choose how often you&apos;d like to receive email updates</p>
          <RadioGroup name="notifications" required>
            <RadioButton value="all" label="All notifications" />
            <RadioButton value="important" label="Important only" />
            <RadioButton value="none" label="No notifications" />
          </RadioGroup>
        </div>
      </div>

      {/* Terms & Conditions */}
      <Checkbox
        {...register('terms')}
        label="I agree to the Terms of Service and Privacy Policy"
        required
      />
      
      <div className="form-actions form-actions--right">
        <Button type="button" variant="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          <Icon name="save" fallback={<IconSkeleton className="icon-skeleton icon-size-md" />} />
          Save Changes
        </Button>
      </div>
    </>
  );
};

// OTP Verification Component
const OTPVerificationExample: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string>('');

  const handleOTPComplete = async (code: string) => {
    setIsVerifying(true);
    setError('');
    
    try {
      // Simulate API verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate random success/failure for demo
      if (Math.random() > 0.3) {
        console.log('OTP verified successfully:', code);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = () => {
    console.log('Resending verification code...');
    setError('');
  };

  return (
    <div className="form-wrapper form-wrapper--card">
      <div className="form-header">
        <h2 className="form-header__title">Verify Your Phone</h2>
        <p className="form-header__description">
          We&apos;ve sent a 6-digit verification code to your phone number ending in ****1234
        </p>
      </div>
      
      <div className="form-content">
        <OTP
          length={6}
          numericOnly
          autoSubmit
          loading={isVerifying}
          error={error}
          success={!error && !isVerifying ? 'Code verified successfully!' : undefined}
          onComplete={handleOTPComplete}
          helperText="Enter the 6-digit code sent to your phone"
          autoFocus
        />
        
        <div className="form-actions form-actions--center">
          <Button 
            type="button" 
            variant="ghost" 
            size="s"
            onClick={handleResendCode}
            disabled={isVerifying}
          >
            <Icon name="refresh-cw" fallback={<IconSkeleton className="icon-skeleton icon-size-sm" />} />
            Didn&apos;t receive a code? Resend
          </Button>
        </div>
      </div>
    </div>
  );
};

// Inline Search Form
const InlineFormExample: React.FC = () => {
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = (data: Record<string, unknown>) => {
    console.log('Search:', data);
    setSearchResults([
      `Result 1 for "${data.query}" in ${data.category}`,
      `Result 2 for "${data.query}" in ${data.category}`,
      `Result 3 for "${data.query}" in ${data.category}`
    ]);
  };

  return (
    <div>
      <Form
        variant="inline"
        onSubmit={handleSearch}
        validationRules={{
          query: { required: 'Please enter a search term' }
        }}
      >
        <InlineFormContent />
      </Form>
      
      {searchResults.length > 0 && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--gray-01)', borderRadius: 'var(--gl-radius-cards)' }}>
          <h3>Search Results:</h3>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            {searchResults.map((result, index) => (
              <li key={index} style={{ marginBottom: '0.25rem' }}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const InlineFormContent: React.FC = () => {
  const { register } = useForm();
  
  return (
    <>
      <Input
        {...register('query')}
        label="Search"
        placeholder="What are you looking for?"
        size="l"
        startIcon={<Icon name="search" fallback={<IconSkeleton className="icon-skeleton icon-size-lg" />} />}
        required
      />
      
      <Select
        {...register('category')}
        label="Category"
        options={[
          { value: 'all', label: 'All Categories' },
          { value: 'products', label: 'Products' },
          { value: 'services', label: 'Services' },
          { value: 'support', label: 'Support' }
        ]}
        size="l"
        defaultValue="all"
      />
      
      <Button type="submit" variant="primary" size="l">
        <Icon name="search" fallback={<IconSkeleton className="icon-skeleton icon-size-lg" />} />
        Search
      </Button>
    </>
  );
};

// Validation Examples Component
const ValidationExamples: React.FC = () => {
  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <h2>Form Validation Examples</h2>
      
      {/* Required Field Example */}
      <div>
        <h3>Required Field Validation</h3>
        <Input
          label="Required Field"
          placeholder="This field is required"
          error="This field is required"
          required
        />
      </div>

      {/* Success State Example */}
      <div>
        <h3>Success State</h3>
        <Input
          label="Valid Email"
          type="email"
          value="user@example.com"
          success="Email format is valid"
          startIcon={<Icon name="check-circle" fallback={<IconSkeleton className="icon-skeleton icon-size-md" />} />}
          readOnly
        />
      </div>

      {/* Warning State Example */}
      <div>
        <h3>Warning State</h3>
        <Input
          label="Password"
          type="password"
          value="weak"
          warning="Password is weak. Consider using a stronger password."
          startIcon={<Icon name="alert-triangle" fallback={<IconSkeleton className="icon-skeleton icon-size-md" />} />}
        />
      </div>

      {/* Loading State Example */}
      <div>
        <h3>Loading State</h3>
        <Input
          label="Checking availability..."
          placeholder="Enter username"
          loading
        />
      </div>

      {/* Disabled State Example */}
      <div>
        <h3>Disabled State</h3>
        <Input
          label="Disabled Field"
          value="Cannot be edited"
          disabled
        />
      </div>
    </div>
  );
};

// Size Variants Example
const SizeVariantsExample: React.FC = () => {
  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <h2>Size Variants</h2>
      
      <Input label="Extra Small (xs)" placeholder="xs size" size="xs" />
      <Input label="Small (s)" placeholder="s size" size="s" />
      <Input label="Medium (m)" placeholder="m size" size="m" />
      <Input label="Large (l)" placeholder="l size" size="l" />
      <Input label="Extra Large (xl)" placeholder="xl size" size="xl" />
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <Checkbox label="xs" size="xs" />
        <Checkbox label="s" size="s" />
        <Checkbox label="m" size="m" />
        <Checkbox label="l" size="l" />
        <Checkbox label="xl" size="xl" />
      </div>
    </div>
  );
};

// Badge Examples Component
const BadgeExamples: React.FC = () => {
  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <h2>Badge Component Examples</h2>
      
      {/* Size Examples */}
      <div>
        <h3>Badge Sizes</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge size="xs">Extra Small</Badge>
          <Badge size="s">Small</Badge>
          <Badge size="m">Medium</Badge>
          <Badge size="l">Large</Badge>
          <Badge size="xl">Extra Large</Badge>
        </div>
      </div>

      {/* Variant Examples */}
      <div>
        <h3>Badge Variants</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </div>
      </div>

      {/* Outline Variants */}
      <div>
        <h3>Outline Variants</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="outline-primary">Primary</Badge>
          <Badge variant="outline-secondary">Secondary</Badge>
          <Badge variant="outline-success">Success</Badge>
          <Badge variant="outline-warning">Warning</Badge>
          <Badge variant="outline-error">Error</Badge>
          <Badge variant="outline-info">Info</Badge>
          <Badge variant="outline-neutral">Neutral</Badge>
        </div>
      </div>

      {/* Shape Examples */}
      <div>
        <h3>Badge Shapes</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge shape="pill">Pill Shape (Default)</Badge>
          <Badge shape="rounded">Rounded</Badge>
          <Badge shape="square">Square</Badge>
        </div>
      </div>

      {/* Removable Examples */}
      <div>
        <h3>Removable Badges</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge removable onRemove={() => alert('Badge removed!')}>
            Removable Tag
          </Badge>
          <Badge variant="success" removable onRemove={() => alert('Success badge removed!')}>
            Success Tag
          </Badge>
          <Badge variant="outline-error" removable onRemove={() => alert('Error badge removed!')}>
            Error Tag
          </Badge>
        </div>
      </div>

      {/* With Icons Examples */}
      <div>
        <h3>Badges with Icons</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="success">
            <Icon name="check" fallback={<IconSkeleton className="icon-skeleton icon-size-md" />} />
            Verified
          </Badge>
          <Badge variant="warning">
            <Icon name="alert-triangle" fallback={<IconSkeleton className="icon-skeleton icon-size-md" />} />
            Alert
          </Badge>
          <Badge variant="info">
            <Icon name="info" fallback={<IconSkeleton className="icon-skeleton icon-size-md" />} />
            Information
          </Badge>
          <Badge iconOnly aria-label="New notification" variant="error">
            <Icon name="bell" fallback={<IconSkeleton className="icon-skeleton icon-size-md" />} />
          </Badge>
        </div>
      </div>

      {/* Badge Group Example */}
      <div>
        <h3>Badge Groups</h3>
        <div className="badge-group">
          <Badge size="s" variant="primary">React</Badge>
          <Badge size="s" variant="secondary">TypeScript</Badge>
          <Badge size="s" variant="success">SCSS</Badge>
          <Badge size="s" variant="info">BEM</Badge>
          <Badge size="s" variant="outline-neutral">Accessibility</Badge>
        </div>
      </div>

      {/* Different Sizes with Same Variant */}
      <div>
        <h3>Size Progression</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge size="xs" variant="primary">XS</Badge>
          <Badge size="s" variant="primary">S</Badge>
          <Badge size="m" variant="primary">M</Badge>
          <Badge size="l" variant="primary">L</Badge>
          <Badge size="xl" variant="primary">XL</Badge>
        </div>
      </div>

      {/* Mixed Examples */}
      <div>
        <h3>Mixed Usage Examples</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="success" shape="rounded" size="s">
            <Icon name="check" fallback={<IconSkeleton className="icon-skeleton icon-size-sm" />} />
            Completed
          </Badge>
          <Badge variant="warning" shape="square" size="m" removable onRemove={() => alert('Warning removed!')}>
            <Icon name="alert-triangle" fallback={<IconSkeleton className="icon-skeleton icon-size-md" />} />
            Pending
          </Badge>
          <Badge variant="outline-info" shape="pill" size="l">
            <Icon name="star" fallback={<IconSkeleton className="icon-skeleton icon-size-lg" />} />
            Featured
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="container">
      <div className="content">
        <h1>Blocx - Forms System Demo</h1>
        
        {/* Login Form */}
        <section className="test-section">
          <h2>Login Form Example</h2>
          <LoginFormExample />
        </section>

        {/* Profile Form */}
        <section className="test-section">
          <h2>Profile Form Example</h2>
          <ProfileFormExample />
        </section>

        {/* OTP Verification */}
        <section className="test-section">
          <h2>OTP Verification Example</h2>
          <OTPVerificationExample />
        </section>

        {/* Inline Search Form */}
        <section className="test-section">
          <h2>Inline Search Form</h2>
          <InlineFormExample />
        </section>

        {/* Validation Examples */}
        <section className="test-section">
          <ValidationExamples />
        </section>

        {/* Size Variants */}
        <section className="test-section">
          <SizeVariantsExample />
        </section>

        {/* Badge Examples */}
        <section className="test-section">
          <BadgeExamples />
        </section>
      </div>
    </div>
  );
}