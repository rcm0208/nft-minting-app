import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export const Soulbound_ERC721A_PARAMS = {
	CONTRACT_NAME: "Soulbound ERC721A", // コントラクトの名前
	CONTRACT_SYMBOL: "SBERC721A", // コントラクトのシンボル
	INITIAL_BASE_URI: "", // 初期基本URI
	MAX_SUPPLY: 30, // 発行上限
	MAX_MINT_PER_ADDRESS: 3, // アドレスごとの発行上限
};

const SoulboundERC721AModule = buildModule("SoulboundERC721AModule", (m) => {
	const {
		CONTRACT_NAME,
		CONTRACT_SYMBOL,
		INITIAL_BASE_URI,
		MAX_SUPPLY,
		MAX_MINT_PER_ADDRESS,
	} = Soulbound_ERC721A_PARAMS;

	const SoulboundERC721A = m.contract("SoulboundERC721A", [
		CONTRACT_NAME,
		CONTRACT_SYMBOL,
		INITIAL_BASE_URI,
		MAX_SUPPLY,
		MAX_MINT_PER_ADDRESS,
	]);

	return { SoulboundERC721A };
});

export default SoulboundERC721AModule;
