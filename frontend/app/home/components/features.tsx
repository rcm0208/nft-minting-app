import Link from 'next/link';
import Section from './section';
import Image from 'next/image';

export default function Features() {
  return (
    <Section title="Features" subTitle="Various NFT Minting">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="border relative rounded-md p-6 shadow-sm space-y-3">
          <div className="aspect-video">
            <Image
              src="/image/mint-banner.png"
              alt="NFT Minting of ERC721"
              width={640}
              height={360}
            ></Image>
          </div>
          <h2 className="font-bold">
            NFT Minting of ERC721 <Link href="/mint" className="absolute inset-0"></Link>
          </h2>
          <p>NFTをミントできます</p>
        </div>
        <div className="border relative rounded-md p-6 shadow-sm space-y-3">
          <div className="aspect-video bg-muted flex items-center justify-center">
            {/* <Image
              src="/image/mint-banner.png"
              alt="Whitelisted NFT Minting of ERC721"
              width={640}
              height={360}
            ></Image> */}
            <p>Coming Soon...</p>
          </div>
          <h2 className="font-bold">
            Gasless NFT Minting of ERC721
            {/* <Link href="" className="absolute inset-0"></Link> */}
          </h2>
          <p>ガス代なしでNFTをミントできます</p>
        </div>
        <div className="border relative rounded-md p-6 shadow-sm space-y-3">
          <div className="aspect-video bg-muted flex items-center justify-center">
            {/* <Image
              src="/image/mint-banner.png"
              alt="Whitelisted NFT Minting of ERC721"
              width={640}
              height={360}
            ></Image> */}
            <p>Coming Soon...</p>
          </div>

          <h2 className="font-bold">
            Whitelisted NFT Minting of ERC721
            {/* <Link href="" className="absolute inset-0"></Link> */}
          </h2>
          <p>ホワイトリスト登録者のみNFTをミントできます</p>
        </div>
      </div>
    </Section>
  );
}
