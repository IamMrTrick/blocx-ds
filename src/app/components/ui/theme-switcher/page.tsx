import React from 'react';
import type { Metadata } from 'next';
import ThemeSwitcherClient from './Client';
import './page.scss';

export const metadata: Metadata = {
  title: 'Theme Switcher — Blocx',
  description: 'Demo of the Theme Switcher component with interactive examples.',
};

export default function ThemeSwitcherPage() {
  return <ThemeSwitcherClient />;
}
