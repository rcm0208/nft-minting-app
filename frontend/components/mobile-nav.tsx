'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { gaslessERC721AbiMap, standardERC721AbiMap } from '@/config/abi-map';
import { networkConfig } from '@/config/network-config';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubSheetOpen, setIsSubSheetOpen] = useState(false);
  const [activeSubSheet, setActiveSubSheet] = useState<'mint' | 'gaslessMint' | null>(null);

  const handleLinkClick = () => {
    setIsOpen(false);
    setIsSubSheetOpen(false);
    setActiveSubSheet(null);
  };

  const handleMintClick = (type: 'mint' | 'gaslessMint') => {
    setIsSubSheetOpen(true);
    setActiveSubSheet(type);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" onClick={() => setIsOpen(true)}>
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <div className="pb-4 text-left">
              <Link href="/" className="inline-block" onClick={handleLinkClick}>
                <Image src="/image/logo.svg" alt="logo" width={40} height={40} />
              </Link>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col">
          <Button variant="ghost" className="justify-start" onClick={() => handleMintClick('mint')}>
            Mint
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => handleMintClick('gaslessMint')}
          >
            Gasless Mint
          </Button>
        </div>
        <Sheet open={isSubSheetOpen} onOpenChange={setIsSubSheetOpen}>
          <SheetContent side="left">
            <SheetHeader className="pb-4 text-left">
              <SheetTitle>
                <Link
                  href={activeSubSheet === 'mint' ? '/mint' : '/gasless-mint'}
                  className="inline-block"
                  onClick={handleLinkClick}
                >
                  {activeSubSheet === 'mint' ? 'Mint Networks' : 'Gasless Mint Networks'}
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col">
              {networkConfig
                .filter((network) =>
                  activeSubSheet === 'mint'
                    ? network.mintCollectionAddress && standardERC721AbiMap[network.networkId]
                    : network.gaslessMintCollectionAddress && gaslessERC721AbiMap[network.networkId]
                )
                .map((network) => (
                  <Button variant="ghost" className="justify-start" key={network.networkId} asChild>
                    <Link
                      href={`/${activeSubSheet === 'mint' ? 'mint' : 'gasless-mint'}/${
                        network.networkUrl
                      }`}
                      onClick={handleLinkClick}
                    >
                      {network.networkName}
                    </Link>
                  </Button>
                ))}
            </div>
          </SheetContent>
        </Sheet>
      </SheetContent>
    </Sheet>
  );
}
