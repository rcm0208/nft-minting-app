import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import * as dotenv from "dotenv";

dotenv.config();

// 0アドレスの定義
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// リレーヤーアドレスの設定（環境変数がない場合は0アドレスを使用）
const RELAYER_ADDRESS = process.env.RELAYER_ADDRESS || ZERO_ADDRESS;

export const GASLESS_ERC721A_PARAMS = {
	CONTRACT_NAME: "Gasless ERC721A", // コントラクトの名前
	CONTRACT_SYMBOL: "GLERC721A", // コントラクトのシンボル
	INITIAL_BASE_URI: "", // 初期基本URI
	MAX_SUPPLY: 30, // 発行上限
	MAX_MINT_PER_ADDRESS: 3, // アドレスごとの発行上限
	RELAYER_ADDRESS: RELAYER_ADDRESS, // リレーヤーアドレス
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
