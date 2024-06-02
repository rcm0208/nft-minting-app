'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3ModalProvider, useSwitchNetwork, useWeb3Modal } from '@web3modal/ethers/react';
import { networkConfig } from '@/config/network-config';
import abiMap from '@/config/abiConfig';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { showMintErrorToast, showMintSuccessToast } from '@/components/mint-result-toast';

interface MintButtonProps {
  networkName: string;
  networkId: string;
  quantity: number;
  isMinting: boolean;
  setIsMinting: (isMinting: boolean) => void;
  isSoldOut: boolean;
  currentNetworkId: string | null;
  setCurrentNetworkId: (networkId: string) => void;
  updateTotalSupply: () => Promise<void>;
}

export default function MintButton({
  networkName,
  networkId,
  quantity,
  isMinting,
  setIsMinting,
  isSoldOut,
  setCurrentNetworkId,
  updateTotalSupply,
}: MintButtonProps) {
  const { walletProvider } = useWeb3ModalProvider();
  const { switchNetwork } = useSwitchNetwork();
  const web3Modal = useWeb3Modal();
  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false);

  async function handleMint() {
    if (!walletProvider) {
      console.error('No wallet provider found');
      await web3Modal.open();
      return;
    }

    setIsMinting(true);

    try {
      let provider = new ethers.BrowserProvider(walletProvider);
      let network = await provider.getNetwork();

      if (network.chainId !== BigInt(networkId)) {
        console.log(`Switching network to ${networkId}`);
        setIsNetworkSwitching(true);
        await switchNetwork(parseInt(networkId, 10));
        setCurrentNetworkId(networkId);

        while (network.chainId !== BigInt(networkId)) {
          provider = new ethers.BrowserProvider(walletProvider);
          network = await provider.getNetwork();
        }

        setIsNetworkSwitching(false);
      }

      const signer = await provider.getSigner();
      const contractModule = abiMap[networkId];
      const contractAddress = networkConfig[networkName]?.mintCollectionAddress;

      if (!contractModule || !contractAddress) {
        console.error('No ABI or contract address found for the specified network');
        setIsMinting(false);
        return;
      }

      const contract = new ethers.Contract(contractAddress, contractModule.abi, signer);
      const tx = await contract.mint(quantity);
      console.log('Minted NFT:', tx);
      await tx.wait();
      await updateTotalSupply();
      showMintSuccessToast();
    } catch (error) {
      console.error('Minting failed:', error);
      showMintErrorToast();
    } finally {
      setIsMinting(false);
    }
  }

  const isLoading = isMinting || isNetworkSwitching;
  const buttonLabel = isSoldOut ? 'Sold Out' : isMinting ? 'Minting...' : 'Mint';

  return (
    <Button
      onClick={handleMint}
      disabled={isLoading || isSoldOut}
      className="w-[400px] lg:w-[500px]"
      size={'lg'}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {buttonLabel}
    </Button>
  );
}
