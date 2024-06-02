'use client';

import { ModeToggle } from './mode-toggle';

export default function Footer() {
  return (
    <footer className="border-t sticky top-full">
      <div className="container h-16 flex justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Keito Aoyama</p>
        <ModeToggle />
      </div>
    </footer>
  );
}
