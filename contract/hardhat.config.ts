import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const accounts = process.env.DEPLOYER_KEY
  ? [`0x${process.env.DEPLOYER_KEY}`]
  : [];

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {},
    sepolia: {
      chainId: 11155111,
      url: process.env.SEPOLIA_RPC_URL || process.env.SEPOLIA_ALCHEMY_KEY || "",
      accounts,
    },
    amoy: {
      chainId: 80002,
      url: process.env.AMOY_RPC_URL || process.env.AMOY_ALCHEMY_KEY || "",
      accounts,
    },
    bsc_testnet: {
      chainId: 97,
      url:
        process.env.BSC_TESTNET_RPC_URL ||
        process.env.BSC_TESTNET_ALCHEMY_KEY ||
        "",
      accounts,
    },
    optimism_sepolia: {
      chainId: 11155420,
      url:
        process.env.OPTIMISM_SEPOLIA_RPC_URL ||
        process.env.OPTIMISM_SEPOLIA_ALCHEMY_KEY ||
        "",
      accounts,
    },
    arbitrum_sepolia: {
      chainId: 421614,
      url:
        process.env.ARBITRUM_SEPOLIA_RPC_URL ||
        process.env.ARBITRUM_SEPOLIA_ALCHEMY_KEY ||
        "",
      accounts,
    },
    base_sepolia: {
      chainId: 84532,
      url:
        process.env.BASE_SEPOLIA_RPC_URL ||
        process.env.BASE_SEPOLIA_ALCHEMY_KEY ||
        "",
      accounts,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      amoy: process.env.POLYGONSCAN_API_KEY || "",
      bsc_testnet: process.env.BSCSCAN_API_KEY || "",
      optimism_sepolia: process.env.OPTIMISMSCAN_API_KEY || "",
      arbitrum_sepolia: process.env.ARBITRUMSCAN_API_KEY || "",
      base_sepolia: process.env.BASESCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "amoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://api-amoy.polygonscan.com",
        },
      },
      {
        network: "bsc_testnet",
        chainId: 97,
        urls: {
          apiURL: "https://api-testnet.bscscan.com/api",
          browserURL: "https://api-testnet.bscscan.com",
        },
      },
      {
        network: "optimism_sepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://api-sepolia-optimistic.etherscan.io",
        },
      },
      {
        network: "arbitrum_sepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://api-sepolia.arbiscan.io",
        },
      },
      {
        network: "base_sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://api-sepolia.basescan.org",
        },
      },
    ],
  },
};

export default config;
