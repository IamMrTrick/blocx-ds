'use client';
import React, { useState } from 'react';
import { Row, Col } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { DatePicker } from '@/components/ui/forms';

export default function DatePickerClient() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [birthDate, setBirthDate] = useState<Date | null>(null);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const minBirthDate = new Date();
  minBirthDate.setFullYear(today.getFullYear() - 100);
  const maxBirthDate = new Date();
  maxBirthDate.setFullYear(today.getFullYear() - 13);

  return (
    <div className="date-picker-demo">
      <Text size="md" className="mb-6">
        Professional date picker component with calendar interface, multiple formats, and accessibility support.
      </Text>

      <Row gap="lg">
        <Col md={6}>
          <div className="demo-section">
            <Text size="lg" weight="semibold" className="mb-4">Basic Examples</Text>
            
            <div className="demo-group">
              <DatePicker
                label="Basic Date Picker"
                placeholder="Select a date"
                value={selectedDate}
                onChange={setSelectedDate}
                helperText="Choose any date"
              />
            </div>

            <div className="demo-group">
              <DatePicker
                label="Different Format"
                format="mm/dd/yyyy"
                placeholder="MM/DD/YYYY"
                helperText="US date format"
              />
            </div>

            <div className="demo-group">
              <DatePicker
                label="ISO Format"
                format="yyyy-mm-dd"
                placeholder="YYYY-MM-DD"
                helperText="ISO 8601 format"
              />
            </div>

            <div className="demo-group">
              <DatePicker
                label="Required Field"
                placeholder="Select date"
                required
                error={!selectedDate ? "Date is required" : undefined}
              />
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="demo-section">
            <Text size="lg" weight="semibold" className="mb-4">Advanced Examples</Text>
            
            <div className="demo-group">
              <DatePicker
                label="Appointment Date"
                placeholder="Select appointment date"
                value={appointmentDate}
                onChange={setAppointmentDate}
                minDate={today}
                maxDate={maxDate}
                showToday
                helperText="Next 30 days only"
              />
            </div>

            <div className="demo-group">
              <DatePicker
                label="Birth Date"
                placeholder="Select birth date"
                value={birthDate}
                onChange={setBirthDate}
                minDate={minBirthDate}
                maxDate={maxBirthDate}
                showClear
                helperText="Must be 13+ years old"
              />
            </div>

            <div className="demo-group">
              <DatePicker
                label="Disabled State"
                placeholder="Cannot select"
                disabled
                helperText="This field is disabled"
              />
            </div>

            <div className="demo-group">
              <DatePicker
                label="Success State"
                placeholder="Select date"
                success="Date selected successfully!"
                defaultValue={new Date()}
              />
            </div>
          </div>
        </Col>
      </Row>

      <Row gap="lg" className="mt-8">
        <Col md={12}>
          <div className="demo-section">
            <Text size="lg" weight="semibold" className="mb-4">Size Variants</Text>
            
            <Row gap="md">
              <Col md={6} lg={3}>
                <DatePicker
                  label="Extra Small"
                  size="xs"
                  placeholder="XS size"
                />
              </Col>
              <Col md={6} lg={3}>
                <DatePicker
                  label="Small"
                  size="s"
                  placeholder="Small size"
                />
              </Col>
              <Col md={6} lg={3}>
                <DatePicker
                  label="Medium (Default)"
                  size="m"
                  placeholder="Medium size"
                />
              </Col>
              <Col md={6} lg={3}>
                <DatePicker
                  label="Large"
                  size="l"
                  placeholder="Large size"
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Row gap="lg" className="mt-8">
        <Col md={12}>
          <div className="demo-section">
            <Text size="lg" weight="semibold" className="mb-4">State Variants</Text>
            
            <Row gap="md">
              <Col md={6} lg={3}>
                <DatePicker
                  label="Default"
                  placeholder="Default state"
                />
              </Col>
              <Col md={6} lg={3}>
                <DatePicker
                  label="Error State"
                  placeholder="Error state"
                  error="This field has an error"
                />
              </Col>
              <Col md={6} lg={3}>
                <DatePicker
                  label="Warning State"
                  placeholder="Warning state"
                  warning="This field has a warning"
                />
              </Col>
              <Col md={6} lg={3}>
                <DatePicker
                  label="Success State"
                  placeholder="Success state"
                  success="This field is valid"
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Row gap="lg" className="mt-8">
        <Col md={12}>
          <div className="demo-section">
            <Text size="lg" weight="semibold" className="mb-4">Full Width & Custom Features</Text>
            
            <div className="demo-group">
              <DatePicker
                label="Full Width Date Picker"
                placeholder="This takes full width"
                fullWidth
                showToday
                showClear
                helperText="Full width with today and clear buttons"
              />
            </div>

            <div className="demo-group">
              <DatePicker
                label="With Start Icon"
                placeholder="Select date"
                startIcon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V1C12 0.4 11.6 0 11 0S10 0.4 10 1V2H6V1C6 0.4 5.6 0 5 0S4 0.4 4 1V2H2C0.9 2 0 2.9 0 4V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V4C16 2.9 15.1 2 14 2H12ZM14 14H2V6H14V14Z" fill="currentColor"/>
                  </svg>
                }
                helperText="With custom start icon"
              />
            </div>
          </div>
        </Col>
      </Row>

      {selectedDate && (
        <Row gap="lg" className="mt-8">
          <Col md={12}>
            <div className="demo-output">
              <Text size="sm" weight="medium" className="mb-2">Selected Date Output:</Text>
              <Text size="sm" className="font-mono">
                {selectedDate.toISOString()} ({selectedDate.toLocaleDateString()})
              </Text>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
}
