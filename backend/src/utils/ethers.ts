import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

export const getRelayerWallet = () => {
	const privateKey = process.env.RELAYER_PRIVATE_KEY;
	if (!privateKey) {
		throw new Error("RELAYER_PRIVATE_KEY is not set in environment variables");
	}
	return new ethers.Wallet(privateKey);
};
