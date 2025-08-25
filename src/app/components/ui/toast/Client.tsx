'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

export default function ToastClient() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Toast Types */}
      <div>
        <h3 style={{ marginBottom: 12 }}>Toast Types:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Button onClick={() => toast.success('Success!', 'Your changes have been saved successfully.')}>
            Success Toast
          </Button>
          
          <Button onClick={() => toast.error('Error!', 'Something went wrong. Please try again.')}>
            Error Toast
          </Button>
          
          <Button onClick={() => toast.warning('Warning!', 'Please check your input before continuing.')}>
            Warning Toast
          </Button>
          
          <Button onClick={() => toast.info('Info', 'This is some useful information for you.')}>
            Info Toast
          </Button>
          
          <Button onClick={() => toast.loading('Loading...', 'Please wait while we process your request.')}>
            Loading Toast
          </Button>
        </div>
      </div>

      {/* Special Features */}
      <div>
        <h3 style={{ marginBottom: 12 }}>Special Features:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Button onClick={() => toast.success('Custom Toast', 'This is a custom toast with action.', { 
            action: { label: 'Undo', onClick: () => toast.success('Undone!') },
            duration: 10000
          })}>
            With Action
          </Button>
          
          <Button onClick={() => toast.info('Persistent', 'This toast will stay until you close it.', { 
            duration: 0
          })}>
            Persistent
          </Button>
          
          <Button onClick={() => {
            const promise = new Promise((resolve, reject) => {
              setTimeout(() => Math.random() > 0.5 ? resolve('Success!') : reject('Failed!'), 2000);
            });
            
            toast.promise(promise, {
              loading: 'Processing...',
              success: 'Operation completed!',
              error: 'Operation failed!'
            });
          }}>
            Promise Toast
          </Button>
          
          <Button onClick={() => toast.dismiss()} variant="secondary">
            Clear All
          </Button>
        </div>
      </div>

      {/* Position Test */}
      <div>
        <h3 style={{ marginBottom: 12 }}>Test Different Positions:</h3>
        <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: 12 }}>
          Current position: <strong>top-right</strong> (از راست میاد، به راست میره)
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Button onClick={() => toast.success('From Right!', 'This toast comes from the right side.')}>
            Test Animation
          </Button>
        </div>
      </div>
    </div>
  );
}


