export interface NetworkConfig {
  networkId: string;
  networkName: string;
  currency: string;
  explorerUrl?: string;
  rpcUrl: string;
  faucetUrl?: string;
  mintCollectionAddress: string;
}

export const networkConfig: NetworkConfig[] = [
  {
    networkId: '11155111',
    networkName: 'Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://11155111.rpc.thirdweb.com',
    faucetUrl: 'https://www.alchemy.com/faucets/ethereum-sepolia',
    mintCollectionAddress: '0xaefCF8555c9f54AE2F683514513F77Db5Bbc67de',
  },
  {
    networkId: '80002',
    networkName: 'Amoy',
    currency: 'MATIC',
    explorerUrl: 'https://amoy.polygonscan.com',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    faucetUrl: 'https://www.alchemy.com/faucets/polygon-amoy',
    mintCollectionAddress: '0x741924D23a4Ff0c7Ce613E78f6460708002A34b3',
  },
  {
    networkId: '97',
    networkName: 'BSC Testnet',
    currency: 'BNB',
    explorerUrl: 'https://testnet.bscscan.com',
    rpcUrl: 'https://bsc-testnet-dataseed.bnbchain.org',
    faucetUrl: 'https://www.bnbchain.org/en/testnet-faucet',
    mintCollectionAddress: '', // FIXME: BSC Testnetのコントラクトをデプロイ後に変更
  },
  {
    networkId: '421614',
    networkName: 'Arbitrum Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.arbiscan.io',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    faucetUrl: 'https://www.alchemy.com/faucets/arbitrum-sepolia',
    mintCollectionAddress: '', // FIXME: Arbitrum Sepoliaのコントラクトをデプロイ後に変更
  },
  {
    networkId: '84532',
    networkName: 'Base Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.basescan.org',
    rpcUrl: 'https://sepolia.base.org',
    faucetUrl: 'https://www.alchemy.com/faucets/base-sepolia',
    mintCollectionAddress: '', // FIXME: Base Sepoliaのコントラクトをデプロイ後に変更
  },
];
