// context/Web3Modal.tsx

'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { ReactNode } from 'react';

export const projectId = process.env['NEXT_PUBLIC_PROJECT_ID'];

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// 2. Set chains
const chains = [
  {
    chainId: 11155111,
    name: 'Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://11155111.rpc.thirdweb.com',
  },
  {
    chainId: 80002,
    name: 'Amoy',
    currency: 'MATIC',
    explorerUrl: 'https://amoy.polygonscan.com',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
  },
  {
    chainId: 421614,
    name: 'Arbitrum Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.arbiscan.io',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
  },
];

// 3. Create a metadata object
const metadata = {
  name: 'Personal Project',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: '...', // used for the Coinbase SDK
  defaultChainId: 11155111, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

export function Web3Modal({ children }: { children: ReactNode }) {
  return children;
}
