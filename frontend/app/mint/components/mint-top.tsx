import Section from '@/app/home/components/section';
import NetworkCardlist from '@/components/network-cardlist';
import { networkData } from '@/config/network-data';

export default function MintTop() {
  return (
    <Section title="Mint" subTitle="NFT Minting of ERC721">
      <div className="grid lg:grid-cols-3 gap-4">
        {networkData.map((network) => (
          <NetworkCardlist key={network.networkUrl} network={network} />
        ))}
      </div>
    </Section>
  );
}
