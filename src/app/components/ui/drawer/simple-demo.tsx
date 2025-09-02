'use client';
import React from 'react';
import { Button } from '@/components/ui/button/Button';
import { Icon } from '@/components/ui/icon/Icon';
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer/Drawer';

type Side = 'left' | 'right' | 'top' | 'bottom';
type Size = 's' | 'm' | 'l' | 'xl' | 'fullscreen';

export default function DrawerClient() {
  const [open, setOpen] = React.useState(false);
  const [side, setSide] = React.useState<Side>('left');
  const [size, setSize] = React.useState<Size>('m');
  const [swipe, setSwipe] = React.useState(true);
  const [backdrop, setBackdrop] = React.useState(true);
  const [dismissible, setDismissible] = React.useState(true);
  const [expandMode, setExpandMode] = React.useState(true);
  const [minimizeMode, setMinimizeMode] = React.useState(true);
  const [bottomOffset, setBottomOffset] = React.useState(0);

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
      {/* Fake bottom navigation to demonstrate offset functionality */}
      {bottomOffset > 0 && (
        <div 
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${bottomOffset}px`,
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e9ecef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            fontSize: '14px',
            color: '#6c757d'
          }}
        >
          🧭 Bottom Navigation ({bottomOffset}px) - Drawer will appear above this
        </div>
      )}
      
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
            <Button variant={expandMode ? 'success' : 'outline-secondary'} onClick={() => setExpandMode(v => !v)}>
              <Icon name={expandMode ? 'check' : 'x'} />
              Expand Mode (top/bottom): {expandMode ? 'On' : 'Off'}
            </Button>
            <Button variant={minimizeMode ? 'success' : 'outline-secondary'} onClick={() => setMinimizeMode(v => !v)}>
              <Icon name={minimizeMode ? 'check' : 'x'} />
              Minimize Mode (top/bottom): {minimizeMode ? 'On' : 'Off'}
            </Button>
          </div>
        </div>

        <div className="drawer-demo__section">
          <h3 className="drawer-demo__label">Bottom Offset (for bottom navigation):</h3>
          <div className="drawer-demo__row">
            <Button variant={bottomOffset === 0 ? 'primary' : 'outline-secondary'} onClick={() => setBottomOffset(0)}>
              No Offset
            </Button>
            <Button variant={bottomOffset === 60 ? 'primary' : 'outline-secondary'} onClick={() => setBottomOffset(60)}>
              60px (Tab Bar)
            </Button>
            <Button variant={bottomOffset === 80 ? 'primary' : 'outline-secondary'} onClick={() => setBottomOffset(80)}>
              80px (Bottom Nav)
            </Button>
            <Button variant={bottomOffset === 100 ? 'primary' : 'outline-secondary'} onClick={() => setBottomOffset(100)}>
              100px (Large Menu)
            </Button>
          </div>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            Current offset: {bottomOffset}px - Drawer will appear above bottom navigation/menus
          </p>
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
        expandMode={expandMode}
        minimizeMode={minimizeMode}
        bottomOffset={bottomOffset}
        onMinimize={() => console.log('Drawer minimized')}
        onRestore={() => console.log('Drawer restored')}
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
              <div className="drawer-feature">
                <Icon name="layers" color="accent" />
                <span>3-mode system: Normal, Expanded, Minimized</span>
              </div>
              <div className="drawer-feature">
                <Icon name="maximize-2" color="accent" />
                <span>Expand mode for top/bottom drawers</span>
              </div>
            </div>

            <div className="drawer-scroll-content">
              <h4>Scroll Test Content</h4>
              <p>This content is designed to test the scroll boundaries and drag interactions. Scroll to the top or bottom to enable drawer dragging.</p>
              
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className="drawer-content-item" style={{ padding: '12px', margin: '8px 0', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                  <h5 style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Content Item #{i + 1}</h5>
                  <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                    This is scrollable content to test the intelligent scroll boundary detection. 
                    When you scroll to the top or bottom of this content, drawer dragging becomes enabled.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                  </p>
                  {i % 5 === 0 && (
                    <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#e3f2fd', borderRadius: '4px', fontSize: '12px' }}>
                      <strong>Milestone #{Math.floor(i/5) + 1}:</strong> Test scrolling behavior at different positions
                    </div>
                  )}
                </div>
              ))}
              
              <div style={{ padding: '16px', backgroundColor: '#fff3e0', borderRadius: '8px', margin: '16px 0' }}>
                <h5 style={{ margin: '0 0 8px 0' }}>Testing Instructions:</h5>
                <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px' }}>
                  <li>Scroll to the very top, then try dragging up/down</li>
                  <li>Scroll to the very bottom, then try dragging up/down</li>
                  <li>Try dragging from the middle (should prioritize content scroll)</li>
                  <li>Test different drawer modes (expand/minimize)</li>
                </ul>
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