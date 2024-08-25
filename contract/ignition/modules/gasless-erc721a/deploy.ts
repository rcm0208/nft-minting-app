import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import * as dotenv from "dotenv";

dotenv.config();

// リレーヤーアドレスの存在を確認
if (!process.env.RELAYER_ADDRESS) {
  throw new Error("RELAYER_ADDRESS must be set in the environment variables");
}

export const GASLESS_ERC721A_PARAMS = {
  CONTRACT_NAME: "Gasless ERC721A", // コントラクトの名前
  CONTRACT_SYMBOL: "GLERC721A", // コントラクトのシンボル
  INITIAL_BASE_URI: "", // 初期基本URI
  MAX_SUPPLY: 30, // 発行上限
  MAX_MINT_PER_ADDRESS: 3, // アドレスごとの発行上限
  RELAYER_ADDRESS: process.env.RELAYER_ADDRESS as string, //リレーヤーアドレス
};

const GaslessERC721AModule = buildModule("GaslessERC721AModule", (m) => {
  const {
    CONTRACT_NAME,
    CONTRACT_SYMBOL,
    INITIAL_BASE_URI,
    MAX_SUPPLY,
    MAX_MINT_PER_ADDRESS,
    RELAYER_ADDRESS,
  } = GASLESS_ERC721A_PARAMS;

  const GaslessERC721A = m.contract("GaslessERC721A", [
    CONTRACT_NAME,
    CONTRACT_SYMBOL,
    INITIAL_BASE_URI,
    MAX_SUPPLY,
    MAX_MINT_PER_ADDRESS,
    RELAYER_ADDRESS,
  ]);

  return { GaslessERC721A };
});

export default GaslessERC721AModule;
