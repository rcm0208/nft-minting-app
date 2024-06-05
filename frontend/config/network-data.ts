export interface NetworkData {
  networkUrl: string;
  networkName: string;
  description: string;
}

export const networkData: NetworkData[] = [
  { networkUrl: 'sepolia', networkName: 'Sepolia', description: 'SepoliaのNFTをミントできます' },
  { networkUrl: 'amoy', networkName: 'Amoy', description: 'AmoyのNFTをミントできます' },
  {
    networkUrl: 'arbitrum-sepolia',
    networkName: 'Arbitrum Sepolia',
    description: 'Arbitrum SepoliaのNFTをミントできます',
  },
];
