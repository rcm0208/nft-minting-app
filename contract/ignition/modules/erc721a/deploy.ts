import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export const ERC721A_PARAMS = {
  CONTRACT_NAME: "Standard ERC721A", // コントラクトの名前
  CONTRACT_SYMBOL: "SERC721A", // コントラクトのシンボル
  INITIAL_BASE_URI: "", // 初期基本URI
  MAX_SUPPLY: 30, // 発行上限
  MAX_MINT_AMOUNT: 5, // 1回の発行上限
};

const StandardERC721AModule = buildModule("StandardERC721AModule", (m) => {
  const {
    CONTRACT_NAME,
    CONTRACT_SYMBOL,
    INITIAL_BASE_URI,
    MAX_SUPPLY,
    MAX_MINT_AMOUNT,
  } = ERC721A_PARAMS;

  const StandardERC721A = m.contract("StandardERC721A", [
    CONTRACT_NAME,
    CONTRACT_SYMBOL,
    INITIAL_BASE_URI,
    MAX_SUPPLY,
    MAX_MINT_AMOUNT,
  ]);

  return { StandardERC721A };
});

export default StandardERC721AModule;
