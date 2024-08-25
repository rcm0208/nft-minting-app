'use client';

import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { networkConfig } from '@/config/network-config';
import { MintResultToast } from '@/components/mint-result-toast';
import Slideshow from '@/components/slide-show';
import { useMintState } from '../hooks/use-mint-state';
import { useContractData } from '../hooks/use-contract-data';
import MintForm from './mint-form';
import NetworkInfo from './network-info';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';

interface Params {
  params: {
    networkUrl: string;
  };
}

export default function MintNetworkContent({ params }: Params) {
  const { networkUrl } = params;
  const network = networkConfig.find((net) => net.networkUrl === networkUrl);
  const { walletProvider } = useWeb3ModalProvider();

  const {
    quantity,
    setQuantity,
    isMinting,
    setIsMinting,
    currentNetworkId,
    setCurrentNetworkId,
    mintSuccess,
    setMintSuccess,
  } = useMintState();

  const { maxSupply, totalSupply, maxMintAmount, error, updateTotalSupply } =
    useContractData(network);

  useEffect(() => {
    if (!network) {
      notFound();
      return;
    }
  }, [network]);

  if (!network) {
    return null;
  }

  return (
    <>
      <MintResultToast />

      <div className="pb-6 lg:py-40 flex items-center justify-between">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 w-full lg:pl-8 mt-8 lg:mt-0 flex justify-center order-1">
            <Slideshow />
          </div>

          <div className="lg:w-1/2 w-full lg:pr-8 order-2 mt-8 lg:mt-0 text-center lg:text-left flex flex-col">
            <NetworkInfo networkName={network.networkName} />
            <MintForm
              network={network}
              quantity={quantity}
              setQuantity={setQuantity}
              isMinting={isMinting}
              setIsMinting={setIsMinting}
              maxSupply={maxSupply}
              totalSupply={totalSupply}
              maxMintAmount={maxMintAmount}
              error={error}
              currentNetworkId={currentNetworkId}
              setCurrentNetworkId={setCurrentNetworkId}
              updateTotalSupply={updateTotalSupply}
              onMintSuccess={() => setMintSuccess(true)}
              mintSuccess={mintSuccess}
            />
          </div>
        </div>
      </div>
    </>
  );
}
