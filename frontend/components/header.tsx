'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ModeToggle } from './mode-toggle';
import { useTheme } from 'next-themes';
import { useWeb3ModalTheme } from '@web3modal/ethers/react';
import Image from 'next/image';
import { MobileNav } from './mobile-nav';
import NavMenu from './nav-menu';

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
        <h1>
          <div className="lg:hidden">
            <MobileNav />
          </div>
          <div className="hidden lg:block">
            <Link href="/">
              <Image src="/image/logo.svg" alt="logo" width={40} height={40} />
            </Link>
          </div>
        </h1>
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <NavMenu />
          </div>
          <w3m-button />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
