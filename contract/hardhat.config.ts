import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();
import type { HardhatUserConfig } from "hardhat/config";
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
		blast_sepolia: {
			chainId: 168587773,
			url:
				process.env.BLAST_SEPOLIA_RPC_URL ||
				process.env.BLAST_SEPOLIA_ALCHEMY_KEY ||
				"",
			accounts,
		},
		linea_sepolia: {
			chainId: 59141,
			url:
				process.env.LINEA_SEPOLIA_RPC_URL ||
				process.env.LINEA_SEPOLIA_ALCHEMY_KEY ||
				"",
			accounts,
		},
		bera_bartio: {
			chainId: 80084,
			url:
				process.env.BERA_BARTIO_RPC_URL ||
				process.env.BERA_BARTIO_ALCHEMY_KEY ||
				"",
			accounts,
		},
		//TODO: ZKsyncの場合はデプロイ方式が異なるのでいつか修正
		zksync_sepolia: {
			chainId: 300,
			url:
				process.env.ZKSYNC_SEPOLIA_RPC_URL ||
				process.env.ZKSYNC_SEPOLIA_ALCHEMY_KEY ||
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
			blast_sepolia: process.env.BLASTSCAN_API_KEY || "",
			linea_sepolia: process.env.LINEASCAN_API_KEY || "",
			bera_bartio: process.env.BARTIOSCAN_API_KEY || "",
			zksync_sepolia: process.env.ZKSYNCSCAN_API_KEY || "", //TODO: ZKsyncの場合はデプロイ方式が異なるのでいつか修正
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
			{
				network: "blast_sepolia",
				chainId: 168587773,
				urls: {
					apiURL:
						"https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan",
					browserURL: "https://sepolia.blastexplorer.io",
				},
			},
			{
				network: "linea_sepolia",
				chainId: 59141,
				urls: {
					apiURL: "https://api-sepolia.lineascan.build/api",
					browserURL: "https://api-sepolia.lineascan.build",
				},
			},
			{
				network: "bera_bartio",
				chainId: 80084,
				urls: {
					apiURL: "https://api-bartio.beratrail.io/api",
					browserURL: "https://api-bartio.beratrail.io",
				},
			},
			//TODO: ZKsyncの場合はデプロイ方式が異なるのでいつか修正
			{
				network: "zksync_sepolia",
				chainId: 300,
				urls: {
					apiURL: "https://api-sepolia.explorer.zksync.io/api",
					browserURL: "https://api-sepolia.explorer.zksync.io",
				},
			},
		],
	},
};

export default config;
