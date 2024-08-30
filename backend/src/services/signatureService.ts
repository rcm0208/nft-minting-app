import { ethers } from "ethers";
import gaslessERC721A_11155111 from "../../../contract/ignition/deployments/chain-11155111/artifacts/GaslessERC721AModule#GaslessERC721A.json";
import sepoliaContractAddresses from "../../../contract/ignition/deployments/chain-11155111/deployed_addresses.json";
import { getRelayerWallet } from "../utils/ethers";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const gaslessERC721AbiMap: { [key: string]: any } = {
	"11155111": {
		abi: gaslessERC721A_11155111.abi,
		address: sepoliaContractAddresses["GaslessERC721AModule#GaslessERC721A"],
		rpcUrl: "https://11155111.rpc.thirdweb.com",
	},
	// 他のネットワークも同様に設定
};

function isSupportedNetwork(networkId: string): boolean {
	return networkId in gaslessERC721AbiMap;
}

export const getMintParams = async (
	signer: string,
	quantity: number,
	networkId: string,
) => {
	if (!isSupportedNetwork(networkId)) {
		throw new Error(`Unsupported network: ${networkId}`);
	}

	const networkConfig = gaslessERC721AbiMap[networkId];
	if (!networkConfig || !networkConfig.address) {
		throw new Error(`Contract address not found for network: ${networkId}`);
	}

	const relayerWallet = getRelayerWallet();
	const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
	const contract = new ethers.Contract(
		networkConfig.address,
		networkConfig.abi,
		provider,
	);

	const nonce = await contract.getNonce(signer);
	const expiry = Math.floor(Date.now() / 1000) + 3600; // 1時間後に期限切れ

	const messageToSign = ethers.solidityPackedKeccak256(
		["address", "address", "uint256", "uint256", "uint256", "address"],
		[
			relayerWallet.address,
			signer,
			quantity,
			nonce,
			expiry,
			networkConfig.address,
		],
	);

	// デバック時に使用
	// console.log("Debug - getMintParams:", {
	// 	relayerAddress: relayerWallet.address,
	// 	signer,
	// 	quantity,
	// 	nonce: nonce.toString(),
	// 	expiry,
	// 	contractAddress: networkConfig.address,
	// 	messageToSign: ethers.hexlify(messageToSign),
	// });

	return {
		nonce: nonce.toString(),
		expiry,
		messageToSign: ethers.hexlify(messageToSign),
	};
};

export const verifyAndMint = async (
	signer: string,
	quantity: number,
	nonce: string,
	expiry: number,
	signature: string,
	networkId: string,
) => {
	if (!isSupportedNetwork(networkId)) {
		throw new Error(`Unsupported network: ${networkId}`);
	}

	const relayerWallet = getRelayerWallet();
	const provider = new ethers.JsonRpcProvider(
		gaslessERC721AbiMap[networkId].rpcUrl,
	);
	const connectedRelayerWallet = relayerWallet.connect(provider);
	const abi = gaslessERC721AbiMap[networkId].abi;
	const contractAddress = gaslessERC721AbiMap[networkId].address;
	const contract = new ethers.Contract(
		contractAddress,
		abi,
		connectedRelayerWallet,
	);

	// Verify the signature
	const messageHash = ethers.solidityPackedKeccak256(
		["address", "address", "uint256", "uint256", "uint256", "address"],
		[
			relayerWallet.address,
			signer,
			quantity,
			BigInt(nonce),
			expiry,
			contractAddress,
		],
	);

	// デバック時に使用
	// console.log("Debug - verifyAndMint:", {
	// 	relayerAddress: relayerWallet.address,
	// 	signer,
	// 	quantity,
	// 	nonce,
	// 	expiry,
	// 	contractAddress,
	// 	messageHash: ethers.hexlify(messageHash),
	// 	signature,
	// });

	const recoveredAddress = ethers.verifyMessage(
		ethers.getBytes(messageHash),
		signature,
	);

	// デバック時に使用
	// console.log("Debug - Recovered address:", recoveredAddress);

	if (recoveredAddress.toLowerCase() !== signer.toLowerCase()) {
		throw new Error(
			`Invalid signature. Expected: ${signer}, Got: ${recoveredAddress}`,
		);
	}

	// Perform the mint
	const tx = await contract.gaslessMint(
		signer,
		quantity,
		BigInt(nonce),
		expiry,
		signature,
	);
	const receipt = await tx.wait();

	return {
		transactionHash: receipt.hash,
		blockNumber: receipt.blockNumber.toString(),
	};
};
