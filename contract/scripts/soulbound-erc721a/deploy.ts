import hre from "hardhat";
import SoulboundERC721AModule, {
  Soulbound_ERC721A_PARAMS,
} from "../../ignition/modules/soulbound-erc721a/deploy";

async function main() {
  console.log("🟢 Deploying contracts...\n");

  const {
    CONTRACT_NAME,
    CONTRACT_SYMBOL,
    INITIAL_BASE_URI,
    MAX_SUPPLY,
    MAX_MINT_PER_ADDRESS,
  } = Soulbound_ERC721A_PARAMS;

  const deployStartTime = Date.now();

  // デプロイ
  let SoulboundERC721A;
  try {
    const deployResult = await hre.ignition.deploy(SoulboundERC721AModule);
    SoulboundERC721A = deployResult.SoulboundERC721A;
    console.log("🟢 Contract deployed successfully.\n");
  } catch (error) {
    console.error("🔴 Failed to deploy contract:", error, "\n");
    return;
  }

  // コントラクトアドレス取得
  let contractAddress;
  try {
    contractAddress = await SoulboundERC721A.getAddress();
  } catch (error) {
    console.error("🔴 Failed to get contract address:", error, "\n");
    return;
  }

  // ガス代計算
  let gasCostInEth;
  try {
    const blockNumber = await hre.ethers.provider.getBlockNumber();

    const filter = {
      address: contractAddress,
      fromBlock: blockNumber - 10, // 少し前のブロックから取得
      toBlock: "latest", // 最新のブロック
    };

    // デプロイトランザクションのログを取得
    const logs = await hre.ethers.provider.getLogs(filter);
    if (logs.length === 0) throw new Error("Deployment event not found.");

    const txHash = logs[0].transactionHash;
    const txReceipt = await hre.ethers.provider.getTransactionReceipt(txHash);
    if (!txReceipt) throw new Error("Transaction receipt not found.");

    // トランザクションを取得
    const transaction = await hre.ethers.provider.getTransaction(txHash);
    if (!transaction) throw new Error("Transaction details not found.");

    const gasUsed = txReceipt.gasUsed;
    const gasPrice = transaction.gasPrice;

    // ガス代を手動で計算してETHに変換
    const gasCost = gasUsed * gasPrice;
    const weiToEth = 10n ** 18n;
    gasCostInEth = Number(gasCost) / Number(weiToEth);
    if (!gasCostInEth) {
      throw new Error("Failed to calculate gas cost.");
    }
  } catch (error) {
    console.error("🔴 Error calculating gas cost:", error, "\n");
  }

  // デプロイ時間
  const deployEndTime = Date.now();
  const deployTime = (deployEndTime - deployStartTime) / 1000;
  const networkName = hre.network.name;

  console.log("------------------------------------------------------------\n");
  console.log(`🔍 SoulboundERC721A deployed to: ${contractAddress}`);
  console.log(`🔍 Deployed on network: ${networkName}`);
  console.log(`🔍 Gas cost: ${gasCostInEth?.toFixed(18)} ETH`);
  console.log(`🔍 Deployment time: ${deployTime.toFixed(2)} seconds \n`);
  console.log("------------------------------------------------------------\n");

  // デプロイ後に1分待機
  if (networkName !== "localhost" && networkName !== "hardhat") {
    const waitTime = 60;
    console.log(
      `⏱ Waiting for ${waitTime} seconds before starting verification...\n`
    );
    await new Promise((resolve) => setTimeout(resolve, waitTime * 1000));

    let verificationPassed = false;
    try {
      for (let i = 0; i < 3; i++) {
        try {
          if (i > 0) {
            console.log(
              "⏱ Waiting for 1 minutes before re-attempting verification...\n"
            );
            await new Promise((resolve) => setTimeout(resolve, 60000));
          }

          console.log("🟢 Starting contract verification...\n");
          await hre.run("verify:verify", {
            address: await SoulboundERC721A.getAddress(),
            constructorArguments: [
              CONTRACT_NAME,
              CONTRACT_SYMBOL,
              INITIAL_BASE_URI,
              MAX_SUPPLY,
              MAX_MINT_PER_ADDRESS,
            ],
          });
          console.log("🟢 Contract verified successfully\n");
          verificationPassed = true;
          break;
        } catch (error) {
          console.error("🔴 Failed to verify contract:", error, "\n");
        }
      }
      if (!verificationPassed) {
        console.error("🔴 Contract verification failed after 3 attempts\n");
      }
    } catch (error) {
      console.error("🔴 Unexpected error during contract verification:", error);
      return;
    }

    const explorerURLKey = `${networkName.toUpperCase()}_EXPLORER_URL`;
    const explorerURL = process.env[explorerURLKey];
    if (explorerURL) {
      console.log(
        `🟢 View contract on explorer: ${explorerURL}/${await SoulboundERC721A.getAddress()}\n`
      );
    } else {
      console.log(
        `❌ Explorer URL for network '${networkName}' not found in .env\n`
      );
    }
  }
}

main().catch(console.error);
