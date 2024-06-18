'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const tags = [
  {
    label: 'Mint',
    id: 'mint',
  },
  {
    label: 'Gasless Mint',
    id: 'gasless-mint',
  },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
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
          {tags.map((tag) => (
            <Button variant="ghost" className="justify-start" key={tag.id} asChild>
              <Link href={`/${tag.id}`} onClick={handleLinkClick}>
                {tag.label}
              </Link>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
