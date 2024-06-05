import Link from 'next/link';
import Section from './section';

export default function Features() {
  return (
    <Section title="Features" subTitle="Various NFT Minting">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="border relative rounded-md p-6 shadow space-y-3">
          <div className="aspect-video bg-muted"></div>
          <h2 className="font-bold">
            NFT Minting of ERC721 <Link href="/mint" className="absolute inset-0"></Link>
          </h2>
          <p>NFTをミントできます</p>
        </div>
      </div>
    </Section>
  );
}
