'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { notFound } from 'next/navigation';
import { networkConfig } from '@/config/network-config';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { MintResultToast } from '@/components/mint-result-toast';
import { standardERC721AbiMap } from '@/config/standard-erc721-abi-map';
import MintQuantitySelector from '@/components/mint-quantity-selector';
import MintButton from './mint-button';
import SupplyDisplay from '@/components/supply-display';
import MaxMintAmountDisplay from '@/components/max-mint-amount-display';
import Link from 'next/link';
import Slideshow from '@/components/slide-show';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump } from '@fortawesome/free-solid-svg-icons';

interface Params {
  params: {
    networkUrl: string;
  };
}

export default function MintNetworkContent({ params }: Params) {
  const { networkUrl } = params;

  const [quantity, setQuantity] = useState<number>(1); // ミント数
  const [isMinting, setIsMinting] = useState(false); // ミント中かどうか
  const [maxSupply, setMaxSupply] = useState<number | null>(null); // 最大供給量
  const [totalSupply, setTotalSupply] = useState<number | null>(null); // 現在の供給量
  const [maxMintAmount, setMaxMintAmount] = useState<number | null>(null); // 1回の最大ミント数
  const [currentNetworkId, setCurrentNetworkId] = useState<string | null>(null); // 現在のネットワークID
  const [error, setError] = useState<string | null>(null); // エラーメッセージ
  const [mintSuccess, setMintSuccess] = useState(false); // ミント成功フラグ
  const { walletProvider } = useWeb3ModalProvider(); // Web3Modalによるウォレット接続情報を取得

  // 選択したネットワーク名からネットワーク情報を取得
  const network = networkConfig.find((net) => net.networkUrl === networkUrl);

  useEffect(() => {
    if (!network) {
      notFound();
      return;
    }

    // コントラクトの最大供給量、現在の供給量、1回の最大ミント数を取得
    async function fetchSupplyData() {
      try {
        if (!network) {
          throw new Error('Network is undefined');
        }

        const provider = new ethers.JsonRpcProvider(network.rpcUrl);
        const contractModule = standardERC721AbiMap[network.networkId];

        if (!contractModule || !network.mintCollectionAddress) {
          throw new Error('Contract information is missing');
        }

        const contract = new ethers.Contract(
          network.mintCollectionAddress,
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
  }, [network, walletProvider]);

  // 現在の供給量を更新
  const updateTotalSupply = async () => {
    if (!network) return;

    try {
      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      const contractModule = standardERC721AbiMap[network.networkId];

      if (!contractModule || !network.mintCollectionAddress) {
        throw new Error('Contract information is missing');
      }

      const contract = new ethers.Contract(
        network.mintCollectionAddress,
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

  if (!network) {
    return null;
  }

  // 在庫の確認
  const isSoldOut = maxSupply !== null && totalSupply !== null && totalSupply >= maxSupply;

  return (
    <>
      <MintResultToast />

      <div className="pb-6 lg:py-40 flex items-center justify-between">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 w-full lg:pl-8 mt-8 lg:mt-0 flex justify-center order-1">
            <Slideshow />
          </div>

          <div className="lg:w-1/2 w-full lg:pr-8 order-2 mt-8 lg:mt-0 text-center lg:text-left flex flex-col">
            <h1 className="font-bold text-4xl mb-5 lg:text-6xl">Pet NFT Collection</h1>
            <p className="text-muted-foreground mb-6">
              Free NFT Collection on {network.networkName}
            </p>

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
              {!mintSuccess ? (
                <MintButton
                  networkName={networkUrl}
                  networkId={network.networkId}
                  quantity={quantity}
                  isMinting={isMinting}
                  setIsMinting={setIsMinting}
                  isSoldOut={isSoldOut}
                  currentNetworkId={currentNetworkId}
                  setCurrentNetworkId={setCurrentNetworkId}
                  updateTotalSupply={updateTotalSupply}
                  onMintSuccess={() => setMintSuccess(true)} // ミント成功時に状態を更新
                />
              ) : (
                <Link
                  href="https://testnets.opensea.io/account"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex justify-center lg:justify-start"
                >
                  <Button className="w-[400px] lg:w-[500px]" size={'lg'}>
                    <Image
                      src="/image/opensea-logo.png"
                      alt="opensea"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Check your NFT on OpenSea
                  </Button>
                </Link>
              )}
            </div>

            {network.faucetUrl && (
              <div className="flex justify-center lg:justify-start mt-6">
                <Link href={network.faucetUrl as string} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faGasPump} className='mr-2' />
                  Get Gas Fee
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
