'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { notFound } from 'next/navigation';
import { networkConfig } from '@/config/network-config';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { MintResultToast } from '@/components/mint-result-toast';
import { standardERC721AbiMap } from '@/config/standard-erc721-abi-map';
import MintQuantitySelector from '@/components/mint-quantity-selector';
import MintButton from '../components/mint-button';
import Image from 'next/image';
import SupplyDisplay from '@/components/supply-display';
import MaxMintAmountDisplay from '@/components/max-mint-amount-display';
import Link from 'next/link';
import { networkData } from '@/config/network-data';

interface Params {
  params: {
    networkUrl: string;
  };
}

export default function MintNetworkPage({ params }: Params) {
  const { networkUrl } = params;

  const [quantity, setQuantity] = useState<number>(1); // ミント数
  const [isMinting, setIsMinting] = useState(false); // ミント中かどうか
  const [maxSupply, setMaxSupply] = useState<number | null>(null); // 最大供給量
  const [totalSupply, setTotalSupply] = useState<number | null>(null); // 現在の供給量
  const [maxMintAmount, setMaxMintAmount] = useState<number | null>(null); // 1回の最大ミント数
  const [currentNetworkId, setCurrentNetworkId] = useState<string | null>(null); // 現在のネットワークID
  const [error, setError] = useState<string | null>(null); // エラーメッセージ
  const { walletProvider } = useWeb3ModalProvider(); // Web3Modalによるウォレット接続情報を取得

  // 選択したネットワーク名からネットワーク情報を取得
  const network = networkData.find((net) => net.networkUrl === networkUrl);
  const config = networkConfig[networkUrl];

  useEffect(() => {
    if (!network || !config) {
      notFound();
      return;
    }

    // コントラクトの最大供給量、現在の供給量、1回の最大ミント数を取得
    async function fetchSupplyData() {
      try {
        const provider = new ethers.JsonRpcProvider(config.rpcUrl);
        const contractModule = standardERC721AbiMap[config.networkId];

        if (!contractModule || !config.mintCollectionAddress) {
          throw new Error('Contract information is missing');
        }

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
      } catch (error) {
        console.error('Failed to fetch contract data:', error);
        setError('Failed to load contract data');
      }
    }

    // 現在のネットワークIDを取得
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

  // 現在の供給量を更新
  const updateTotalSupply = async () => {
    if (!config) return;

    try {
      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      const contractModule = standardERC721AbiMap[config.networkId];

      if (!contractModule || !config.mintCollectionAddress) {
        throw new Error('Contract information is missing');
      }

      const contract = new ethers.Contract(
        config.mintCollectionAddress,
        contractModule.abi,
        provider
      );

      const totalSupply = await contract.totalSupply();
      setTotalSupply(Number(totalSupply));
    } catch (error) {
      console.error('Failed to update total supply:', error);
      setError('Failed to update total supply');
    }
  };

  if (!network || !config) {
    return null;
  }

  // 在庫の確認
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
              {!error && (
                <div className="bg-primary-foreground py-2 px-4 rounded-lg mr-4 shadow-inner">
                  <MaxMintAmountDisplay maxMintAmount={maxMintAmount} />
                </div>
              )}
              <SupplyDisplay maxSupply={maxSupply} totalSupply={totalSupply} error={error} />
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
                networkName={networkUrl}
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

            {config.faucetUrl && (
              <div className="flex justify-center lg:justify-start mt-4">
                <Link href={config.faucetUrl as string} target="_blank" rel="noopener noreferrer">
                  Faucet Click Here
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
