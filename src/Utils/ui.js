// Small shared UI helpers for the Journey components.

// Two-digit, zero-padded number for terminal-style counts ("02 Continents").
export const pad2 = (n) => String(n).padStart(2, '0');

// True when the user has asked the OS to minimize motion.
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
