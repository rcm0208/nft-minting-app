'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';
import { useTheme } from 'next-themes';
import { useWeb3ModalTheme } from '@web3modal/ethers/react';
import Image from 'next/image';

export default function Header() {
  const navItems = [{ label: 'Mint', href: '/mint' }];
  const { theme } = useTheme();
  const { setThemeMode } = useWeb3ModalTheme();

  useEffect(() => {
    if (theme) {
      const mode = theme === 'system' ? 'light' : (theme as 'light' | 'dark');
      setThemeMode(mode);
    }
  }, [theme, setThemeMode]);

  return (
    <header className="border-b">
      <div className="h-16 container flex items-center justify-between">
        <h1 className="font-bold">
          <Link href="/">
            <Image src="/image/logo.svg" alt="logo" width={40} height={40}></Image>
          </Link>
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
