'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';

type Side = 'left' | 'right' | 'top' | 'bottom';
type Size = 's' | 'm' | 'l' | 'xl' | 'fullscreen';

export default function DrawerClient() {
  const [open, setOpen] = React.useState(false);
  const [side, setSide] = React.useState<Side>('left');
  const [size, setSize] = React.useState<Size>('m');
  const [swipe, setSwipe] = React.useState(true);
  const [backdrop, setBackdrop] = React.useState(true);
  const [dismissible, setDismissible] = React.useState(true);

  function openFrom(nextSide: Side) {
    setSide(nextSide);
    setOpen(true);
  }

  function setAndOpen(nextSize: Size) {
    setSize(nextSize);
    setOpen(true);
  }

  return (
    <div className="drawer-demo">
      <div className="drawer-demo__controls" role="group" aria-label="Drawer controls">
        <div className="drawer-demo__section">
          <h3 className="drawer-demo__label">Open from different sides:</h3>
          <div className="drawer-demo__row">
            <Button variant="primary" onClick={() => openFrom('left')}>
              <Icon name="arrow-right" />
              Left
            </Button>
            <Button variant="primary" onClick={() => openFrom('right')}>
              Right
              <Icon name="arrow-left" />
            </Button>
            <Button variant="primary" onClick={() => openFrom('top')}>
              <Icon name="arrow-down" />
              Top
            </Button>
            <Button variant="primary" onClick={() => openFrom('bottom')}>
              Bottom
              <Icon name="arrow-up" />
            </Button>
          </div>
        </div>

        <div className="drawer-demo__section">
          <h3 className="drawer-demo__label">Size variants:</h3>
          <div className="drawer-demo__row">
            <Button variant="secondary" onClick={() => setAndOpen('s')}>
              <Icon name="minimize-2" />
              Small
            </Button>
            <Button variant="secondary" onClick={() => setAndOpen('m')}>
              <Icon name="square" />
              Medium
            </Button>
            <Button variant="secondary" onClick={() => setAndOpen('l')}>
              <Icon name="maximize-2" />
              Large
            </Button>
            <Button variant="secondary" onClick={() => setAndOpen('xl')}>
              <Icon name="move" />
              XL
            </Button>
            <Button variant="secondary" onClick={() => setAndOpen('fullscreen')}>
              <Icon name="maximize" />
              Full
            </Button>
          </div>
        </div>

        <div className="drawer-demo__section">
          <h3 className="drawer-demo__label">Behavior options:</h3>
          <div className="drawer-demo__row">
            <Button variant={swipe ? 'success' : 'outline-secondary'} onClick={() => setSwipe(v => !v)}>
              <Icon name={swipe ? 'check' : 'x'} />
              Swipe: {swipe ? 'On' : 'Off'}
            </Button>
            <Button variant={backdrop ? 'success' : 'outline-secondary'} onClick={() => setBackdrop(v => !v)}>
              <Icon name={backdrop ? 'check' : 'x'} />
              Backdrop: {backdrop ? 'On' : 'Off'}
            </Button>
            <Button variant={dismissible ? 'success' : 'outline-secondary'} onClick={() => setDismissible(v => !v)}>
              <Icon name={dismissible ? 'check' : 'x'} />
              Dismissible: {dismissible ? 'On' : 'Off'}
            </Button>
          </div>
        </div>
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side={side}
        size={size}
        swipeToClose={swipe}
        backdrop={backdrop}
        dismissible={dismissible}
      >
        <DrawerHeader>
          <DrawerTitle id="drawer-title">Sample Drawer</DrawerTitle>
          <Button iconOnly aria-label="Close drawer" variant="ghost" onClick={() => setOpen(false)}>
            <Icon name="x" />
          </Button>
        </DrawerHeader>
        <DrawerDescription id="drawer-desc">
          Try opening from different sides, sizes, and swipe to close.
        </DrawerDescription>
        <DrawerBody>
          <div className="drawer-content">
            <p>
              This modern drawer features glassmorphism design with smooth bounce animations.
              It supports all four sides, multiple sizes, and gesture-based interactions.
            </p>
            <div className="drawer-features">
              <div className="drawer-feature">
                <Icon name="hand" color="accent" />
                <span>Swipe to close from any direction</span>
              </div>
              <div className="drawer-feature">
                <Icon name="sparkles" color="accent" />
                <span>Glassmorphism with backdrop blur</span>
              </div>
              <div className="drawer-feature">
                <Icon name="zap" color="accent" />
                <span>Smooth bounce animations</span>
              </div>
              <div className="drawer-feature">
                <Icon name="accessibility" color="accent" />
                <span>Full accessibility support</span>
              </div>
            </div>
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </DrawerFooter>
      </Drawer>
    </div>
  );
}


