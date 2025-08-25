'use client';
import React, { useState } from 'react';
import { Row, Col } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { TimePicker, type TimeValue } from '@/components/ui/forms';

export default function TimePickerClient() {
  const [selectedTime, setSelectedTime] = useState<TimeValue | null>(null);
  const [meetingTime, setMeetingTime] = useState<TimeValue | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<TimeValue | null>(null);

  const businessHoursMin: TimeValue = { hours: 9, minutes: 0 };
  const businessHoursMax: TimeValue = { hours: 17, minutes: 0 };

  return (
    <div className="time-picker-demo">
      <Text size="md" className="mb-6">
        Professional time picker component with 12h/24h formats, seconds support, and accessibility features.
      </Text>

      <Row gap="lg">
        <Col md={6}>
          <div className="demo-section">
            <Text size="lg" weight="semibold" className="mb-4">Basic Examples</Text>
            
            <div className="demo-group">
              <TimePicker
                label="Basic Time Picker (24h)"
                placeholder="Select time"
                value={selectedTime}
                onChange={setSelectedTime}
                helperText="24-hour format"
              />
            </div>

            <div className="demo-group">
              <TimePicker
                label="12-Hour Format"
                format="12h"
                placeholder="Select time"
                helperText="12-hour format with AM/PM"
              />
            </div>

            <div className="demo-group">
              <TimePicker
                label="With Seconds"
                format="24h"
                showSeconds
                placeholder="HH:MM:SS"
                helperText="Includes seconds"
              />
            </div>

            <div className="demo-group">
              <TimePicker
                label="Required Field"
                placeholder="Select time"
                required
                error={!selectedTime ? "Time is required" : undefined}
              />
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="demo-section">
            <Text size="lg" weight="semibold" className="mb-4">Advanced Examples</Text>
            
            <div className="demo-group">
              <TimePicker
                label="Meeting Time"
                placeholder="Select meeting time"
                value={meetingTime}
                onChange={setMeetingTime}
                format="12h"
                minuteStep={15}
                showNow
                helperText="15-minute intervals"
              />
            </div>

            <div className="demo-group">
              <TimePicker
                label="Business Hours Only"
                placeholder="Select time"
                value={appointmentTime}
                onChange={setAppointmentTime}
                minTime={businessHoursMin}
                maxTime={businessHoursMax}
                minuteStep={30}
                helperText="9 AM to 5 PM, 30-min intervals"
              />
            </div>

            <div className="demo-group">
              <TimePicker
                label="Disabled State"
                placeholder="Cannot select"
                disabled
                helperText="This field is disabled"
              />
            </div>

            <div className="demo-group">
              <TimePicker
                label="Success State"
                placeholder="Select time"
                success="Time selected successfully!"
                defaultValue={{ hours: 14, minutes: 30 }}
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
                <TimePicker
                  label="Extra Small"
                  size="xs"
                  placeholder="XS size"
                />
              </Col>
              <Col md={6} lg={3}>
                <TimePicker
                  label="Small"
                  size="s"
                  placeholder="Small size"
                />
              </Col>
              <Col md={6} lg={3}>
                <TimePicker
                  label="Medium (Default)"
                  size="m"
                  placeholder="Medium size"
                />
              </Col>
              <Col md={6} lg={3}>
                <TimePicker
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
                <TimePicker
                  label="Default"
                  placeholder="Default state"
                />
              </Col>
              <Col md={6} lg={3}>
                <TimePicker
                  label="Error State"
                  placeholder="Error state"
                  error="This field has an error"
                />
              </Col>
              <Col md={6} lg={3}>
                <TimePicker
                  label="Warning State"
                  placeholder="Warning state"
                  warning="This field has a warning"
                />
              </Col>
              <Col md={6} lg={3}>
                <TimePicker
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
            <Text size="lg" weight="semibold" className="mb-4">Special Configurations</Text>
            
            <Row gap="md">
              <Col md={6}>
                <TimePicker
                  label="12h with Seconds"
                  format="12h"
                  showSeconds
                  secondStep={5}
                  placeholder="HH:MM:SS AM/PM"
                  helperText="12-hour format with 5-second steps"
                />
              </Col>
              <Col md={6}>
                <TimePicker
                  label="5-Minute Intervals"
                  format="24h"
                  minuteStep={5}
                  placeholder="Select time"
                  helperText="Only 5-minute intervals available"
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
              <TimePicker
                label="Full Width Time Picker"
                placeholder="This takes full width"
                fullWidth
                showNow
                showClear
                helperText="Full width with now and clear buttons"
              />
            </div>

            <div className="demo-group">
              <TimePicker
                label="With Start Icon"
                placeholder="Select time"
                startIcon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14ZM8.5 4H7V9L11.2 11.5L12 10.2L8.5 8.2V4Z" fill="currentColor"/>
                  </svg>
                }
                helperText="With custom start icon"
              />
            </div>
          </div>
        </Col>
      </Row>

      {selectedTime && (
        <Row gap="lg" className="mt-8">
          <Col md={12}>
            <div className="demo-output">
              <Text size="sm" weight="medium" className="mb-2">Selected Time Output:</Text>
              <Text size="sm" className="font-mono">
                {JSON.stringify(selectedTime, null, 2)}
              </Text>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
}
