'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { networkConfig } from '@/config/network-config';
import { standardERC721AbiMap } from '@/config/standard-erc721-abi-map';

const components: { title: string; href: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
  },
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
  },
];

export default function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Mint</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 lg:w-[400px]">
              {networkConfig
                .filter(
                  (network) =>
                    network.mintCollectionAddress && standardERC721AbiMap[network.networkId]
                )
                .map((network) => (
                  <ListItem
                    key={network.networkId}
                    title={network.networkName}
                    href={`/mint/${network.networkUrl}`}
                  />
                ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* <NavigationMenuItem>
          <NavigationMenuTrigger>Gasless Mint</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 lg:w-[400px]">
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
