import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      chainId: 11155111,
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: [`0x${process.env.DEPLOYER_KEY}` || ""],
    },
    amoy: {
      chainId: 80002,
      url: process.env.AMOY_RPC_URL || "",
      accounts: [`0x${process.env.DEPLOYER_KEY}` || ""],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      amoy: process.env.POLYGONSCAN_API_KEY || "",
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
    ],
  },
};

export default config;
