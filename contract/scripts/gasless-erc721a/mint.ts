import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { GaslessERC721A } from "../../typechain-types";

dotenv.config();

async function main() {
  const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY;
  const userPrivateKey = process.env.USER_PRIVATE_KEY;
  const contractAddress = "0x7b421A463e8491D2f38F3e04d5C4c1CC813a1774";

  if (!userPrivateKey || !relayerPrivateKey || !contractAddress) {
    throw new Error("🔴 Missing environment variables");
  }


  const quantity = 2; // ミントするNFTの数

  // コントラクトのインスタンスを取得
  const GaslessERC721AFactory = await ethers.getContractFactory(
    "GaslessERC721A"
  );
  const contract = GaslessERC721AFactory.attach(
    contractAddress
  ) as GaslessERC721A;

  // ユーザーのウォレットを取得
  const userWallet = new ethers.Wallet(userPrivateKey, ethers.provider);
  const relayerWallet = new ethers.Wallet(relayerPrivateKey, ethers.provider);
  const userAddress = await userWallet.getAddress();

  // ノンスを取得
  const nonce = await contract.nonces(userAddress);

  // 有効期限を設定（例：1時間後）
  const expiry = Math.floor(Date.now() / 1000) + 3600;

  // 署名を生成
  const messageHash = ethers.solidityPackedKeccak256(
    ["address", "uint256", "uint256", "uint256", "address"],
    [userAddress, quantity, nonce, expiry, contractAddress]
  );
  const messageHashBinary = ethers.getBytes(messageHash);
  const signature = await userWallet.signMessage(messageHashBinary);

  console.log(
    "------------------------------------------------------------\n"
  );
  console.log("📝 Generated Signature:", signature);
  console.log("⏳ Expiry:", new Date(expiry * 1000).toLocaleString(), "\n");
  console.log(
    "------------------------------------------------------------\n"
  );

  try {
    // ガスレスミントを実行
    const tx = await contract
      .connect(relayerWallet)
      .gaslessMint(userAddress, quantity, nonce, expiry, signature);

    console.log("⏱  Minting transaction sent. Waiting for confirmation...\n");
    const receipt = await tx.wait();

    if (receipt && receipt.status === 1) {
      console.log("🟢 Minting successful\n");

      const gasPrice = receipt.gasPrice;
      const gasUsed = receipt.gasUsed;
      const gasCostWei = gasPrice * gasUsed;
      const gasCostEth = ethers.formatEther(gasCostWei);

      console.log(
        "------------------------------------------------------------\n"
      );
      console.log("🔍 Transaction hash:", tx.hash);
      console.log(`🔍 Gas cost: ${gasCostEth} ETH`);
      console.log(`🔍 Gas used: ${gasUsed.toString()}`);
      console.log(
        `🔍 Gas price: ${ethers.formatUnits(gasPrice, "gwei")} gwei\n`
      );
      console.log(
        "------------------------------------------------------------\n"
      );
    } else {
      console.log("🔴 Transaction failed or was not mined");
    }
  } catch (error) {
    console.error("🔴 Error during minting:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("🔴 Unhandled error:", error);
    process.exit(1);
  });
