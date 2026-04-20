// Navbar — fixed top navigation with mobile drawer
// Links: Projects (scroll), About (scroll)

'use client';

import { useState } from 'react';

const links = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-6 lg:px-16 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <a href="/" className="flex items-center gap-3">
          <img src="/ch5-logo.svg" alt="CH5" className="h-12 w-12" />
        </a>

        <div className="hidden md:flex items-center liquid-glass rounded-full px-1.5 py-1 gap-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-white/90 font-body"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          className="md:hidden text-white p-2"
          onClick={() => setOpen((v) => !v)}
        >
          <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-2 liquid-glass rounded-2xl px-4 py-3 flex flex-col gap-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-white/90 font-body"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
