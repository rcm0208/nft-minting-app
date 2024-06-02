import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="py-5 lg:py-40 flex items-center justify-between">
      <div className="container mx-auto flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 w-full lg:pr-8 order-2 lg:order-1 mt-8 lg:mt-0 text-center lg:text-left flex flex-col items-center lg:items-start">
          <h1 className="font-bold text-4xl mb-5 lg:text-6xl">Pet NFT Collection</h1>
          <p className="text-muted-foreground mb-4">
            Free Pet NFT Collection
            <br />
            Only Testnet
          </p>
          <Button>
            <Link href="/mint">Go to Mint Page</Link>
          </Button>
        </div>
        <div className="lg:w-1/2 w-full lg:pl-8 mt-8 lg:mt-0 flex justify-center order-1 lg:order-2">
          <Image
            src="/pet-nft-1.jpeg"
            alt="Hero Image"
            width={500}
            height={500}
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
