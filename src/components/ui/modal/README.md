# Modal Component

Accessible, token-driven modal with BEM classes.

Usage example:

```tsx
import { useState, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, ModalDescription, ModalCloseButton } from '@/components/ui/modal';

export function Example() {
  const [open, setOpen] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal open={open} onClose={() => setOpen(false)} size="m" initialFocusRef={confirmRef}>
        <ModalHeader>
          <ModalTitle id="modal-title">Title</ModalTitle>
          <ModalCloseButton onClick={() => setOpen(false)} />
        </ModalHeader>
        <ModalBody>
          <ModalDescription id="modal-desc">Description text ...</ModalDescription>
        </ModalBody>
        <ModalFooter>
          <button onClick={() => setOpen(false)}>Cancel</button>
          <button ref={confirmRef}>Confirm</button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```


