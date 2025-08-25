'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

export default function FeedbackClient() {
  const { addToast } = useToast();
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Button
        variant="primary"
        onClick={() =>
          addToast({ title: 'Saved', description: 'Your changes have been saved.', type: 'success' })
        }
      >
        Show Toast
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalHeader>Example Modal</ModalHeader>
        <ModalBody>
          This is a basic modal content.
        </ModalBody>
      </Modal>
    </div>
  );
}


