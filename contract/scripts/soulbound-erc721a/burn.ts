import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import type { SoulboundERC721A } from "../../typechain-types";

dotenv.config();

async function main() {
	const ownerPrivateKey = process.env.DEPLOYER_KEY;
	const contractAddress = "0xd02dF36842107bA2bcfD981191f25225d4BfDf3F"

	if (!ownerPrivateKey || !contractAddress) {
		throw new Error("🔴 Missing environment variables");
	}

	const startTokenId = 5; // バーンを開始するトークンID
	const endTokenId = 6; // バーンを終了するトークンID

	// コントラクトのインスタンスを取得
	const SoulboundERC721AFactory =
		await ethers.getContractFactory("SoulboundERC721A");
	const contract = SoulboundERC721AFactory.attach(
		contractAddress,
	) as SoulboundERC721A;

	// オーナーのウォレットを取得
	const ownerWallet = new ethers.Wallet(ownerPrivateKey, ethers.provider);
	const ownerAddress = await ownerWallet.getAddress();

	console.log("------------------------------------------------------------\n");
	console.log(
		"🔥 Attempting to burn tokens from ID",
		startTokenId,
		"to",
		endTokenId,
	);
	console.log("👤 Owner address:", ownerAddress, "\n");
	console.log("------------------------------------------------------------\n");

	for (let tokenId = startTokenId; tokenId <= endTokenId; tokenId++) {
		try {
			// バーンを実行
			const tx = await contract.connect(ownerWallet).burnByOwner(tokenId);

			console.log(
				`⏱  Burn transaction for token ${tokenId} sent. Waiting for confirmation...\n`,
			);
			const receipt = await tx.wait();

			if (receipt && receipt.status === 1) {
				console.log(`🟢 Burn successful for token ${tokenId}\n`);

				const gasPrice = receipt.gasPrice;
				const gasUsed = receipt.gasUsed;
				const gasCostWei = gasPrice * gasUsed;
				const gasCostEth = ethers.formatEther(gasCostWei);

				console.log(
					"------------------------------------------------------------\n",
				);
				console.log("🔍 Transaction hash:", tx.hash);
				console.log(`🔍 Gas cost: ${gasCostEth} ETH`);
				console.log(`🔍 Gas used: ${gasUsed.toString()}`);
				console.log(
					`🔍 Gas price: ${ethers.formatUnits(gasPrice, "gwei")} gwei\n`,
				);
				console.log(
					"------------------------------------------------------------\n",
				);
			} else {
				console.log(
					`🔴 Transaction failed or was not mined for token ${tokenId}`,
				);
			}
		} catch (error) {
			console.error(`🔴 Error during burning token ${tokenId}:`, error);
			if (error instanceof Error) {
				console.error("Error message:", error.message);
			}
		}
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error("🔴 Unhandled error:", error);
		process.exit(1);
	});
