'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';

export default function Header() {
  const navItems = [{ label: 'Mint', href: '/mint' }];

  return (
    <header className="border-b">
      <div className="h-16 container flex items-center justify-between">
        <h1 className="font-bold">
          <Link href="/">LOGO</Link>
        </h1>
        <div className="flex items-center gap-4">
          <ul className="flex gap-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <Button variant="ghost" asChild>
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              </li>
            ))}
            <w3m-button />
            <ModeToggle />
          </ul>
        </div>
      </div>
    </header>
  );
}
