'use client';
import React from 'react';
import { Col } from '@/components/layout';
import { RadioGroup, RadioButton, OTP, Switcher } from '@/components/ui/forms';

export default function FormsClient() {
  const [plan, setPlan] = React.useState('pro');
  const [notifications, setNotifications] = React.useState(false);

  return (
    <Col md={6}>
      <RadioGroup name="plan" value={plan} onChange={(val: string) => setPlan(val)}>
        <RadioButton value="free" label="Free" />
        <RadioButton value="pro" label="Pro" />
        <RadioButton value="enterprise" label="Enterprise" />
      </RadioGroup>
      <OTP length={6} />
      <Switcher
        label="Enable notifications"
        name="notifications"
        checked={notifications}
        onChange={(e) => setNotifications(e.currentTarget.checked)}
      />
    </Col>
  );
}


