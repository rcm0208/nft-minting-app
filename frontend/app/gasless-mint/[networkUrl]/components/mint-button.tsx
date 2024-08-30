'use client';

import { showMintErrorToast, showMintSuccessToast } from '@/components/mint-result-toast';
import { Button } from '@/components/ui/button';
import { networkConfig } from '@/config/network-config';
import {
  useSwitchNetwork,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers/react';
import { ethers } from 'ethers';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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
  onMintSuccess: () => void;
}

export default function MintButton({
  networkName,
  networkId,
  quantity,
  isMinting,
  setIsMinting,
  isSoldOut,
  currentNetworkId,
  setCurrentNetworkId,
  updateTotalSupply,
  onMintSuccess,
}: MintButtonProps) {
  const { walletProvider } = useWeb3ModalProvider();
  const { switchNetwork } = useSwitchNetwork();
  const web3Modal = useWeb3Modal();
  const { address } = useWeb3ModalAccount();
  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false);
  const [initialMintAttempted, setInitialMintAttempted] = useState(false);
  const network = networkConfig.find(
    (net) => net.networkName.toLowerCase().replace(/ /g, '-') === networkName
  );
  const contractAddress = network?.gaslessMintCollectionAddress;

  const handleMint = useCallback(async () => {
    if (!walletProvider || !address) {
      console.error('No wallet provider or address found');
      await web3Modal.open();
      setInitialMintAttempted(true);
      return;
    }

    if (initialMintAttempted) {
      setInitialMintAttempted(false);
    }

    setIsMinting(true);

    try {
      let provider = new ethers.BrowserProvider(walletProvider);
      let currentNetwork = await provider.getNetwork();

      if (currentNetwork.chainId !== BigInt(networkId)) {
        console.log(`Switching network to ${networkId}`);
        setIsNetworkSwitching(true);

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Network switch timed out')), 30000)
        );

        await Promise.race([
          (async () => {
            await switchNetwork(Number.parseInt(networkId, 10));
            while (currentNetwork.chainId !== BigInt(networkId)) {
              provider = new ethers.BrowserProvider(walletProvider);
              currentNetwork = await provider.getNetwork();
            }
          })(),
          timeoutPromise,
        ]);

        setCurrentNetworkId(networkId);
        setIsNetworkSwitching(false);
      }

      const signer = await provider.getSigner();

      if (!network || !contractAddress) {
        throw new Error('Network configuration or contract address not found');
      }

      // Get minting parameters from backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/get-mint-params`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          quantity,
          networkId: network.networkId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get minting parameters');
      }

      const { nonce, expiry, messageToSign } = await response.json();

      // User signs the message
      const signature = await signer.signMessage(ethers.getBytes(messageToSign));

      // Send the signature back to the backend for minting
      const mintResponse = await fetch(`${apiUrl}/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          quantity,
          nonce,
          expiry,
          signature,
          networkId: network.networkId,
          contractAddress,
        }),
      });

      if (!mintResponse.ok) {
        const errorData = await mintResponse.json();
        throw new Error(errorData.message || 'Minting failed');
      }

      const result = await mintResponse.json();
      console.log('Gasless Minted NFT:', result);
      await updateTotalSupply();
      showMintSuccessToast();
      onMintSuccess();
    } catch (error) {
      console.error('Minting failed:', error);
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      showMintErrorToast();
    } finally {
      setIsMinting(false);
      setIsNetworkSwitching(false);
    }
  }, [
    walletProvider,
    address,
    web3Modal,
    networkId,
    quantity,
    switchNetwork,
    updateTotalSupply,
    setCurrentNetworkId,
    setIsMinting,
    initialMintAttempted,
    contractAddress,
    onMintSuccess,
    network,
  ]);

  useEffect(() => {
    if (walletProvider && initialMintAttempted) {
      handleMint();
    }
  }, [walletProvider, handleMint, initialMintAttempted]);

  const isLoading = isMinting || isNetworkSwitching;
  const buttonLabel = !contractAddress
    ? 'Not Available'
    : isSoldOut
    ? 'Sold Out'
    : isMinting
    ? 'Minting...'
    : 'Mint';

  return (
    <Button
      onClick={handleMint}
      disabled={isLoading || isSoldOut || !contractAddress}
      className="w-[400px] lg:w-[500px]"
      size={'lg'}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {buttonLabel}
    </Button>
  );
}
