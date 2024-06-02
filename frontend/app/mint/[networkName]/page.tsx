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
  const [maxMintAmount, setMaxMintAmount] = useState<number>(1);
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
    <div>
      <MintResultToast />

      {maxSupply !== null && totalSupply !== null ? (
        <p>{`Total Supply: ${totalSupply} / ${maxSupply}`}</p>
      ) : (
        <p>Loading supply data...</p>
      )}

      <MintQuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        isMinting={isMinting}
        maxMintAmount={maxMintAmount}
      />

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
  );
}
