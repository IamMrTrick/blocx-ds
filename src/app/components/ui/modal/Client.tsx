'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal';

export default function ModalClient() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalHeader>Example Modal</ModalHeader>
        <ModalBody>
          This is a modal.
        </ModalBody>
      </Modal>
    </div>
  );
}


