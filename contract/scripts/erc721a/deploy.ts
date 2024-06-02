import hre from "hardhat";
import StandardERC721AModule, {
  ERC721A_PARAMS,
} from "../../ignition/modules/erc721a/deploy";

async function main() {
  console.log("🟢 Deploying contracts...\n");

  const {
    CONTRACT_NAME,
    CONTRACT_SYMBOL,
    INITIAL_BASE_URI,
    MAX_SUPPLY,
    MAX_MINT_AMOUNT,
  } = ERC721A_PARAMS;
  const deployStartTime = Date.now();

  let StandardERC721A;
  try {
    const deployResult = await hre.ignition.deploy(StandardERC721AModule);
    StandardERC721A = deployResult.StandardERC721A;
  } catch (error) {
    console.error("🔴 Failed to deploy contract:", error, "\n");
    return;
  }

  const deployEndTime = Date.now();
  const deployTime = (deployEndTime - deployStartTime) / 1000;
  const networkName = hre.network.name;

  console.log("------------------------------------------------------------\n");
  try {
    console.log(
      `🔍 StandardERC721A deployed to: ${await StandardERC721A.getAddress()}`
    );
  } catch (error) {
    console.error("🔴 Failed to get contract address:", error, "\n");
    return;
  }
  console.log(`🔍 Deployed on network: ${networkName}`);
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
            address: await StandardERC721A.getAddress(),
            constructorArguments: [
              CONTRACT_NAME,
              CONTRACT_SYMBOL,
              INITIAL_BASE_URI,
              MAX_SUPPLY,
              MAX_MINT_AMOUNT,
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
        `🟢 View contract on explorer: ${explorerURL}/${await StandardERC721A.getAddress()}\n`
      );
    } else {
      console.log(
        `❌ Explorer URL for network '${networkName}' not found in .env\n`
      );
    }
  }
}

main().catch(console.error);
