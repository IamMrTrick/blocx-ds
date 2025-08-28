'use client';
import React, { useState } from 'react';
import { Input, TextArea, Select, Checkbox, RadioButton } from '@/components/ui/forms';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Row, Col } from '@/components/layout';
import { User, Mail, Lock, Phone, Search, Eye, EyeOff, MapPin, MessageSquare, Calendar, Clock, CreditCard, Shield } from 'lucide-react';

export default function FormsClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bio: '',
    country: '',
    newsletter: false,
    gender: '',
    terms: false,
    notifications: 'email',
    theme: 'light'
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleCheckboxChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.checked
    }));
  };

  const countryOptions = [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr' },
    { label: 'Iran', value: 'ir' },
    { label: 'Japan', value: 'jp' },
    { label: 'Australia', value: 'au' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Heading level={1} className="mb-4">Forms Component Showcase</Heading>
        <Text size="lg" className="text-gray-600">
          Comprehensive testing of all form components with different states, sizes, and interactions
        </Text>
      </div>

      {/* Input Components */}
      <Card>
        <div className="space-y-6">
          <Heading level={2}>Input Components</Heading>
          
          {/* Basic Inputs */}
          <div className="space-y-4">
            <Heading level={3} size="md">Basic Input States</Heading>
            <Row gutter="md">
              <Col md={6}>
                <Input 
                  label="Default State" 
                  placeholder="Enter your name"
                  startIcon={<User size={16} />}
                />
              </Col>
              <Col md={6}>
                <Input 
                  label="With Value" 
                  value="John Doe"
                  startIcon={<User size={16} />}
                  readOnly
                />
              </Col>
            </Row>
            
            <Row gutter="md">
              <Col md={6}>
                <Input 
                  label="Disabled State" 
                  placeholder="This is disabled"
                  startIcon={<User size={16} />}
                  disabled
                />
              </Col>
              <Col md={6}>
                <Input 
                  label="Loading State" 
                  placeholder="Loading..."
                  startIcon={<User size={16} />}
                  loading
                />
              </Col>
            </Row>
          </div>

          {/* Validation States */}
          <div className="space-y-4">
            <Heading level={3} size="md">Validation States</Heading>
            <Row gutter="md">
              <Col md={4}>
                <Input 
                  label="Success State" 
                  value="valid@email.com"
                  startIcon={<Mail size={16} />}
                  success="Email is available!"
                />
              </Col>
              <Col md={4}>
                <Input 
                  label="Warning State" 
                  value="test@gmail.com"
                  startIcon={<Mail size={16} />}
                  warning="Consider using a more secure email provider"
                />
              </Col>
              <Col md={4}>
                <Input 
                  label="Error State" 
                  value="invalid-email"
                  startIcon={<Mail size={16} />}
                  error="Please enter a valid email address"
                />
              </Col>
            </Row>
          </div>

          {/* Input Sizes */}
          <div className="space-y-4">
            <Heading level={3} size="md">Input Sizes</Heading>
            <div className="space-y-3">
              <Input label="Extra Small (xs)" size="xs" placeholder="Extra small input" startIcon={<User size={12} />} />
              <Input label="Small (s)" size="s" placeholder="Small input" startIcon={<User size={14} />} />
              <Input label="Medium (m) - Default" size="m" placeholder="Medium input" startIcon={<User size={16} />} />
              <Input label="Large (l)" size="l" placeholder="Large input" startIcon={<User size={18} />} />
              <Input label="Extra Large (xl)" size="xl" placeholder="Extra large input" startIcon={<User size={20} />} />
            </div>
          </div>

          {/* Input Types */}
          <div className="space-y-4">
            <Heading level={3} size="md">Input Types & Icons</Heading>
            <Row gutter="md">
              <Col md={6}>
                <Input 
                  label="Email" 
                  type="email" 
                  placeholder="Enter your email"
                  startIcon={<Mail size={16} />}
                  value={formData.email}
                  onChange={handleInputChange('email')}
                />
              </Col>
              <Col md={6}>
                <Input 
                  label="Password" 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  startIcon={<Lock size={16} />}
                  endIcon={
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  value={formData.password}
                  onChange={handleInputChange('password')}
                />
              </Col>
            </Row>
            
            <Row gutter="md">
              <Col md={6}>
                <Input 
                  label="Phone Number" 
                  type="tel" 
                  placeholder="+1 (555) 123-4567"
                  startIcon={<Phone size={16} />}
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                />
              </Col>
              <Col md={6}>
                <Input 
                  label="Search" 
                  type="search" 
                  placeholder="Search..."
                  startIcon={<Search size={16} />}
                />
              </Col>
            </Row>
          </div>

          {/* Character Count */}
          <div className="space-y-4">
            <Heading level={3} size="md">Advanced Features</Heading>
            <Row gutter="md">
              <Col md={6}>
                <Input 
                  label="Username" 
                  placeholder="Choose a username"
                  maxLength={20}
                  showCharCount
                  helperText="Choose a unique username"
                  startIcon={<User size={16} />}
                />
              </Col>
              <Col md={6}>
                <TextArea 
                  label="Bio" 
                  placeholder="Tell us about yourself..."
                  maxLength={160}
                  showCharCount
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange('bio')}
                />
              </Col>
            </Row>
          </div>
        </div>
      </Card>

      {/* Select Components */}
      <Card>
        <div className="space-y-6">
          <Heading level={2}>Select Components</Heading>
          
          <div className="space-y-4">
            <Heading level={3} size="md">Select States & Sizes</Heading>
            <Row gutter="md">
              <Col md={4}>
                <Select 
                  label="Country" 
                  placeholder="Select your country"
                  options={countryOptions}
                  value={formData.country}
                  onChange={handleInputChange('country')}
                />
              </Col>
              <Col md={4}>
                <Select 
                  label="Disabled Select" 
                  placeholder="This is disabled"
                  options={countryOptions}
                  disabled
                />
              </Col>
              <Col md={4}>
                <Select 
                  label="Loading Select" 
                  placeholder="Loading options..."
                  options={countryOptions}
                  loading
                />
              </Col>
            </Row>

            <Row gutter="md">
              <Col md={3}>
                <Select label="Small" size="s" placeholder="Small select" options={countryOptions} />
              </Col>
              <Col md={3}>
                <Select label="Medium" size="m" placeholder="Medium select" options={countryOptions} />
              </Col>
              <Col md={3}>
                <Select label="Large" size="l" placeholder="Large select" options={countryOptions} />
              </Col>
              <Col md={3}>
                <Select label="Extra Large" size="xl" placeholder="XL select" options={countryOptions} />
              </Col>
            </Row>
          </div>
        </div>
      </Card>

      {/* Checkbox & Radio Components */}
      <Card>
        <div className="space-y-6">
          <Heading level={2}>Checkbox & Radio Components</Heading>
          
          {/* Checkbox States */}
          <div className="space-y-4">
            <Heading level={3} size="md">Checkbox States (Click anywhere - box or label)</Heading>
            <Row gutter="md">
              <Col md={6}>
                <div className="space-y-3">
                  <Checkbox 
                    name="newsletter" 
                    label="Subscribe to newsletter (Click box or label)"
                    checked={formData.newsletter}
                    onChange={handleCheckboxChange('newsletter')}
                  />
                  <Checkbox 
                    name="terms" 
                    label="I agree to the terms and conditions"
                    checked={formData.terms}
                    onChange={handleCheckboxChange('terms')}
                    required
                  />
                  <Checkbox 
                    name="disabled" 
                    label="Disabled checkbox"
                    disabled
                  />
                  <Checkbox 
                    name="checked-disabled" 
                    label="Checked & disabled"
                    checked
                    disabled
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="space-y-3">
                  <Checkbox 
                    name="success" 
                    label="Success state"
                    checked
                    success="Great choice!"
                  />
                  <Checkbox 
                    name="warning" 
                    label="Warning state"
                    warning="Please review this option"
                  />
                  <Checkbox 
                    name="error" 
                    label="Error state"
                    error="This field is required"
                  />
                  <Checkbox 
                    name="loading" 
                    label="Loading state"
                    loading
                  />
                </div>
              </Col>
            </Row>
          </div>

          {/* Radio Button States */}
          <div className="space-y-4">
            <Heading level={3} size="md">Radio Buttons (Click anywhere - circle or label)</Heading>
            <div className="space-y-3">
              <Text size="sm" className="font-medium">Gender Selection:</Text>
              <div className="flex gap-6">
                <RadioButton 
                  name="gender" 
                  value="male" 
                  label="Male - Click anywhere"
                  checked={formData.gender === 'male'}
                  onChange={handleInputChange('gender')}
                />
                <RadioButton 
                  name="gender" 
                  value="female" 
                  label="Female - Click anywhere"
                  checked={formData.gender === 'female'}
                  onChange={handleInputChange('gender')}
                />
                <RadioButton 
                  name="gender" 
                  value="other" 
                  label="Other - Click anywhere"
                  checked={formData.gender === 'other'}
                  onChange={handleInputChange('gender')}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Text size="sm" className="font-medium">Notification Preferences:</Text>
              <div className="flex gap-6">
                <RadioButton 
                  name="notifications" 
                  value="email" 
                  label="Email notifications"
                  checked={formData.notifications === 'email'}
                  onChange={handleInputChange('notifications')}
                />
                <RadioButton 
                  name="notifications" 
                  value="sms" 
                  label="SMS notifications"
                  checked={formData.notifications === 'sms'}
                  onChange={handleInputChange('notifications')}
                />
                <RadioButton 
                  name="notifications" 
                  value="none" 
                  label="No notifications"
                  checked={formData.notifications === 'none'}
                  onChange={handleInputChange('notifications')}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Text size="sm" className="font-medium">Disabled States:</Text>
              <div className="flex gap-6">
                <RadioButton 
                  name="disabled-group" 
                  value="option1" 
                  label="Disabled option"
                  disabled
                />
                <RadioButton 
                  name="disabled-group" 
                  value="option2" 
                  label="Checked & disabled"
                  checked
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Checkbox & Radio Sizes */}
          <div className="space-y-4">
            <Heading level={3} size="md">Component Sizes</Heading>
            <Row gutter="md">
              <Col md={6}>
                <div className="space-y-3">
                  <Text size="sm" className="font-medium">Checkbox Sizes:</Text>
                  <Checkbox size="xs" label="Extra Small" />
                  <Checkbox size="s" label="Small" />
                  <Checkbox size="m" label="Medium (Default)" />
                  <Checkbox size="l" label="Large" />
                  <Checkbox size="xl" label="Extra Large" />
                </div>
              </Col>
              <Col md={6}>
                <div className="space-y-3">
                  <Text size="sm" className="font-medium">Radio Button Sizes:</Text>
                  <RadioButton name="size-demo" value="xs" label="Extra Small" size="xs" />
                  <RadioButton name="size-demo" value="s" label="Small" size="s" />
                  <RadioButton name="size-demo" value="m" label="Medium (Default)" size="m" />
                  <RadioButton name="size-demo" value="l" label="Large" size="l" />
                  <RadioButton name="size-demo" value="xl" label="Extra Large" size="xl" />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Card>

      {/* Interactive Demo */}
      <Card>
        <div className="space-y-6">
          <Heading level={2}>Interactive Form Demo</Heading>
          <Text className="text-gray-600">
            Test all components together in a real form scenario
          </Text>
          
          <form className="space-y-6">
            <Row gutter="md">
              <Col md={6}>
                <Input 
                  label="Full Name" 
                  placeholder="Enter your full name"
                  startIcon={<User size={16} />}
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  required
                />
              </Col>
              <Col md={6}>
                <Input 
                  label="Email Address" 
                  type="email"
                  placeholder="Enter your email"
                  startIcon={<Mail size={16} />}
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                />
              </Col>
            </Row>

            <Row gutter="md">
              <Col md={6}>
                <Select 
                  label="Country" 
                  placeholder="Select your country"
                  options={countryOptions}
                  value={formData.country}
                  onChange={handleInputChange('country')}
                  required
                />
              </Col>
              <Col md={6}>
                <Input 
                  label="Phone Number" 
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  startIcon={<Phone size={16} />}
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                />
              </Col>
            </Row>

            <TextArea 
              label="About You" 
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={500}
              showCharCount
              value={formData.bio}
              onChange={handleInputChange('bio')}
            />

            <div className="space-y-4">
              <Text size="sm" className="font-medium">Preferences:</Text>
              <div className="space-y-3">
                <Checkbox 
                  name="newsletter-demo" 
                  label="Subscribe to our newsletter"
                  checked={formData.newsletter}
                  onChange={handleCheckboxChange('newsletter')}
                />
                <Checkbox 
                  name="terms-demo" 
                  label="I agree to the Terms of Service and Privacy Policy"
                  checked={formData.terms}
                  onChange={handleCheckboxChange('terms')}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="primary" size="l">
                Submit Form
              </Button>
              <Button variant="secondary" size="l">
                Reset
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}