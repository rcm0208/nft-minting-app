'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { notFound } from 'next/navigation';
import { networkData } from '../components/network-data';
import { networkConfig } from '@/config/network-config';
import abiMap from '@/config/abiConfig';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { MintResultToast } from '@/components/mint-result-toast';
import MintQuantitySelector from '@/components/mint-quantity-selector';
import MintButton from '../components/mint-button';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface Params {
  params: {
    networkName: string;
  };
}

export default function MintNetworkPage({ params }: Params) {
  const { networkName } = params;

  const [quantity, setQuantity] = useState<number>(1);
  const [isMinting, setIsMinting] = useState(false);
  const [maxSupply, setMaxSupply] = useState<number | null>(null);
  const [totalSupply, setTotalSupply] = useState<number | null>(null);
  const [maxMintAmount, setMaxMintAmount] = useState<number | null>(null); // Changed from number to number | null
  const [currentNetworkId, setCurrentNetworkId] = useState<string | null>(null);
  const { walletProvider } = useWeb3ModalProvider();

  const network = networkData.find((net) => net.networkName === networkName);
  const config = networkConfig[networkName];

  useEffect(() => {
    if (!network || !config) {
      notFound();
      return;
    }

    async function fetchSupplyData() {
      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      const contractModule = abiMap[config.networkId];
      const contract = new ethers.Contract(
        config.mintCollectionAddress,
        contractModule.abi,
        provider
      );

      const maxSupply = await contract.maxSupply();
      const totalSupply = await contract.totalSupply();
      const maxMintAmount = await contract.maxMintAmount();

      setMaxSupply(Number(maxSupply));
      setTotalSupply(Number(totalSupply));
      setMaxMintAmount(Number(maxMintAmount));
    }

    async function getCurrentNetwork() {
      if (walletProvider) {
        const provider = new ethers.BrowserProvider(walletProvider);
        const network = await provider.getNetwork();
        setCurrentNetworkId(network.chainId.toString());
      }
    }

    fetchSupplyData();
    getCurrentNetwork();
  }, [network, config, walletProvider]);

  const updateTotalSupply = async () => {
    if (!config) return;

    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const contractModule = abiMap[config.networkId];
    const contract = new ethers.Contract(
      config.mintCollectionAddress,
      contractModule.abi,
      provider
    );

    const totalSupply = await contract.totalSupply();
    setTotalSupply(Number(totalSupply));
  };

  if (!network || !config) {
    return null;
  }

  const isSoldOut = maxSupply !== null && totalSupply !== null && totalSupply >= maxSupply;

  return (
    <>
      <MintResultToast />

      <div className="py-5 lg:py-40 flex items-center justify-between">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 w-full lg:pl-8 mt-8 lg:mt-0 flex justify-center order-1">
            <Image
              src="/pet-nft-1.jpeg"
              alt="NFT Image"
              width={400}
              height={400}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="lg:w-1/2 w-full lg:pr-8 order-2 mt-8 lg:mt-0 text-center lg:text-left flex flex-col">
            <h1 className="font-bold text-4xl mb-5 lg:text-6xl">Pet NFT Collection</h1>
            <p className="text-muted-foreground mb-6">Free NFT Collection</p>

            <div className="flex justify-center lg:justify-start mb-6 text-primary">
              {maxMintAmount !== null ? (
                <div className="bg-primary-foreground py-2 px-4 rounded-lg mr-4 shadow-inner">
                  <p>{`Max Mint Amount: ${maxMintAmount}`}</p>
                </div>
              ) : (
                <div className="bg-primary-foreground py-2 px-4 rounded-lg mr-4 shadow-inner flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <p>Loading max mint amount...</p>
                </div>
              )}

              {maxSupply !== null && totalSupply !== null ? (
                <div className="bg-primary-foreground py-2 px-4 rounded-lg shadow-inner">
                  <p>{`Total Supply: ${totalSupply} / ${maxSupply}`}</p>
                </div>
              ) : (
                <div className="bg-primary-foreground py-2 px-4 rounded-lg shadow-inner flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <p>Loading supply data...</p>
                </div>
              )}
            </div>

            <div className="flex justify-center lg:justify-start mb-2">
              <MintQuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
                isMinting={isMinting}
                maxMintAmount={maxMintAmount || 1}
              />
            </div>

            <div className="flex justify-center lg:justify-start">
              <MintButton
                networkName={networkName}
                networkId={config.networkId}
                quantity={quantity}
                isMinting={isMinting}
                setIsMinting={setIsMinting}
                isSoldOut={isSoldOut}
                currentNetworkId={currentNetworkId}
                setCurrentNetworkId={setCurrentNetworkId}
                updateTotalSupply={updateTotalSupply}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
