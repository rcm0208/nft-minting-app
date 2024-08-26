'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { networkConfig } from '@/config/network-config';
import { standardERC721AbiMap } from '@/config/abi-map';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubSheetOpen, setIsSubSheetOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
    setIsSubSheetOpen(false);
  };

  const handleMintClick = () => {
    setIsSubSheetOpen(true);
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
          <Button variant="ghost" className="justify-start" onClick={handleMintClick}>
            Mint
          </Button>
        </div>
        <Sheet open={isSubSheetOpen} onOpenChange={setIsSubSheetOpen}>
          <SheetContent side="left">
            <SheetHeader className="pb-4 text-left">
              <SheetTitle>
                <Link href="/mint" className="inline-block" onClick={handleLinkClick}>
                  Mint Networks
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col">
              {networkConfig
                .filter(
                  (network) =>
                    network.mintCollectionAddress && standardERC721AbiMap[network.networkId]
                )
                .map((network) => (
                  <Button variant="ghost" className="justify-start" key={network.networkId} asChild>
                    <Link href={`/mint/${network.networkUrl}`} onClick={handleLinkClick}>
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
