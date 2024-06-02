interface NetworkConfig {
  [key: string]: {
    networkId: string;
    mintCollectionAddress: string;
    rpcUrl: string;
    explorerUrl?: string;
    faucetUrl?: string;
  };
}

export const networkConfig: NetworkConfig = {
  sepolia: {
    networkId: '11155111',
    mintCollectionAddress: '0xaefCF8555c9f54AE2F683514513F77Db5Bbc67de',
    rpcUrl: 'https://11155111.rpc.thirdweb.com',
    explorerUrl: 'https://sepolia.etherscan.io',
    faucetUrl: 'https://www.alchemy.com/faucets/ethereum-sepolia',
  },
  amoy: {
    networkId: '80002',
    mintCollectionAddress: '0x741924D23a4Ff0c7Ce613E78f6460708002A34b3',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    explorerUrl: 'https://amoy.polygonscan.com',
    faucetUrl: 'https://www.alchemy.com/faucets/polygon-amoy',
  },
};
