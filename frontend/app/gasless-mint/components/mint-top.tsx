import Section from '@/app/home/components/section';
import NetworkCardlist from './network-cardlist';
import { networkConfig } from '@/config/network-config';
import { gaslessERC721AbiMap } from '@/config/abi-map';

export default function MintTop() {
  return (
    <Section title="GaslessMint" subTitle="NFT Minting of ERC721 without gas">
      <div className="grid lg:grid-cols-3 gap-4">
        {networkConfig
          .filter(
            (network) =>
              network.gaslessMintCollectionAddress && gaslessERC721AbiMap[network.networkId]
          )
          .map((network) => (
            <NetworkCardlist key={network.networkId} network={network} />
          ))}
      </div>
    </Section>
  );
}
