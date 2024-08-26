import amoyContractAddresses from "../../contract/ignition/deployments/chain-80002/deployed_addresses.json";
import baseSepoliaContractAddresses from "../../contract/ignition/deployments/chain-84532/deployed_addresses.json";
import arbitrumSepoliaContractAddresses from "../../contract/ignition/deployments/chain-421614/deployed_addresses.json";
import sepoliaContractAddresses from "../../contract/ignition/deployments/chain-11155111/deployed_addresses.json";
import optimismSepoliaContractAddresses from "../../contract/ignition/deployments/chain-11155420/deployed_addresses.json";

export interface NetworkConfig {
	networkId: string;
	networkName: string;
	networkUrl: string;
	currency: string;
	explorerUrl?: string;
	rpcUrl: string;
	faucetUrl?: string;
	mintCollectionAddress: string;
	gaslessMintCollectionAddress: string;
}

export const networkConfig: NetworkConfig[] = [
	{
		networkId: "11155111",
		networkName: "Sepolia",
		networkUrl: "sepolia",
		currency: "ETH",
		explorerUrl: "https://sepolia.etherscan.io",
		rpcUrl: "https://11155111.rpc.thirdweb.com",
		faucetUrl: "https://www.alchemy.com/faucets/ethereum-sepolia",
		mintCollectionAddress: "", // FIXME: コントラクトをデプロイ後に変更
		gaslessMintCollectionAddress:
			sepoliaContractAddresses["GaslessERC721AModule#GaslessERC721A"],
	},
	{
		networkId: "80002",
		networkName: "Amoy",
		networkUrl: "amoy",
		currency: "MATIC",
		explorerUrl: "https://amoy.polygonscan.com",
		rpcUrl: "https://rpc-amoy.polygon.technology",
		faucetUrl: "https://www.alchemy.com/faucets/polygon-amoy",
		mintCollectionAddress:
			amoyContractAddresses["StandardERC721AModule#StandardERC721A"],
		gaslessMintCollectionAddress: "", // FIXME: コントラクトをデプロイ後に変更
	},
	{
		networkId: "97",
		networkName: "BSC Testnet",
		networkUrl: "bsc-testnet",
		currency: "BNB",
		explorerUrl: "https://testnet.bscscan.com",
		rpcUrl: "https://bsc-testnet-dataseed.bnbchain.org",
		faucetUrl: "https://www.bnbchain.org/en/testnet-faucet",
		mintCollectionAddress: "", // FIXME: コントラクトをデプロイ後に変更
		gaslessMintCollectionAddress: "", // FIXME: コントラクトをデプロイ後に変更
	},
	{
		networkId: "11155420",
		networkName: "Optimism Sepolia",
		networkUrl: "optimism-sepolia",
		currency: "ETH",
		explorerUrl: "https://sepolia-optimistic.etherscan.io",
		rpcUrl: "https://sepolia.optimism.io",
		faucetUrl: "https://www.alchemy.com/faucets/optimism-sepolia",
		mintCollectionAddress:
			optimismSepoliaContractAddresses["StandardERC721AModule#StandardERC721A"],
		gaslessMintCollectionAddress: "", // FIXME: コントラクトをデプロイ後に変更
	},
	{
		networkId: "421614",
		networkName: "Arbitrum Sepolia",
		networkUrl: "arbitrum-sepolia",
		currency: "ETH",
		explorerUrl: "https://sepolia.arbiscan.io",
		rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
		faucetUrl: "https://www.alchemy.com/faucets/arbitrum-sepolia",
		mintCollectionAddress:
			arbitrumSepoliaContractAddresses["StandardERC721AModule#StandardERC721A"],
		gaslessMintCollectionAddress: "", // FIXME: コントラクトをデプロイ後に変更
	},
	{
		networkId: "84532",
		networkName: "Base Sepolia",
		networkUrl: "base-sepolia",
		currency: "ETH",
		explorerUrl: "https://sepolia.basescan.org",
		rpcUrl: "https://sepolia.base.org",
		faucetUrl: "https://www.alchemy.com/faucets/base-sepolia",
		mintCollectionAddress:
			baseSepoliaContractAddresses["StandardERC721AModule#StandardERC721A"],
		gaslessMintCollectionAddress: "", // FIXME: コントラクトをデプロイ後に変更
	},
];
