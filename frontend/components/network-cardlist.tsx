'use client';

import { NetworkData } from '@/config/network-data';
import Image from 'next/image';
import Link from 'next/link';

export default function NetworkCardlist({ network }: { network: NetworkData }) {
  return (
    <div className="border relative rounded-md p-6 shadow space-y-3">
      <div className="aspect-video flex items-center justify-center">
        <Image
          src={`/network-banners/${network.networkUrl}-banner.png`}
          alt={network.networkName}
          width={640}
          height={360}
          className="dark:hidden"
        />
        <Image
          src={`/network-dark-banners/${network.networkUrl}-banner.png`}
          alt={network.networkName}
          width={640}
          height={360}
          className="hidden dark:block"
        />
      </div>
      <h2 className="font-bold">
        {network.networkName}{' '}
        <Link href={`/mint/${network.networkUrl}`} className="absolute inset-0"></Link>
      </h2>
      <p>{network.description}</p>
    </div>
  );
}
