import React from 'react';
import type { Metadata } from 'next';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Form, Input, TextArea, Select, Checkbox } from '@/components/ui/forms';
import FormsClient from './page.client';

export const metadata: Metadata = {
  title: 'Forms — Blocx',
  description: 'Demo of form elements: Input, TextArea, Select, Checkbox, Radio, OTP, Switcher.',
};

export default function FormsDemoPage() {
  return (
    <main className="components components--forms" role="main">
      <Section variant="content">
        <Heading level={1} size="h2">Forms</Heading>
        <Text size="md">Common form controls and states.</Text>

        <Row gap="lg">
          <Col md={6}>
            <Form>
              <Input label="Name" name="name" placeholder="Jane Doe" />
              <Input label="Email" name="email" type="email" placeholder="jane@example.com" />
              <TextArea label="Message" name="message" placeholder="Your message" />
              <Select label="Role" name="role" options={[{ label: 'Admin', value: 'admin' }, { label: 'User', value: 'user' }]} />
              <Checkbox name="agree" label="I agree to terms" />
            </Form>
          </Col>

          <FormsClient />
        </Row>
      </Section>
    </main>
  );
}


