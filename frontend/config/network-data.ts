export interface NetworkData {
  networkUrl: string;
  networkName: string;
  description: string;
}

export const networkData: NetworkData[] = [
  { networkUrl: 'sepolia', networkName: 'Sepolia', description: 'SepoliaのNFTをミントできます' },
  { networkUrl: 'amoy', networkName: 'Amoy', description: 'AmoyのNFTをミントできます' },
  {
    networkUrl: 'bsc',
    networkName: 'BNB Smart Chain Testnet',
    description: 'BNB Smart Chain TestnetのNFTをミントできます',
  },
  {
    networkUrl: 'arbitrum-sepolia',
    networkName: 'Arbitrum Sepolia',
    description: 'Arbitrum SepoliaのNFTをミントできます',
  },
  {
    networkUrl: 'base-sepolia',
    networkName: 'Base Sepolia',
    description: 'Base SepoliaのNFTをミントできます',
  },
];
