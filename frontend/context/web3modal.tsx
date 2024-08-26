// context/Web3Modal.tsx

"use client";

import { networkConfig } from "@/config/network-config";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import type { ReactNode } from "react";

export const projectId = process.env["NEXT_PUBLIC_PROJECT_ID"];

if (!projectId) {
	throw new Error("Project ID is not defined");
}

// 2. Set chains
const chains = networkConfig.map((value) => ({
	chainId: Number.parseInt(value.networkId, 10),
	name: value.networkName,
	currency: value.currency,
	explorerUrl: value.explorerUrl || "",
	rpcUrl: value.rpcUrl,
}));

// 3. Create a metadata object
const metadata = {
	name: "Personal Project",
	description: "Web3Modal Example",
	url: "https://web3modal.com", // origin must match your domain & subdomain
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
	/*Required*/
	metadata,

	/*Optional*/
	enableEIP6963: true, // true by default
	enableInjected: true, // true by default
	enableCoinbase: true, // true by default
	rpcUrl: "...", // used for the Coinbase SDK
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
