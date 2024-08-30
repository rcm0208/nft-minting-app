import type { Context } from "hono";
import { getMintParams, verifyAndMint } from "../services/signatureService";

export const getMintParamsController = async (c: Context) => {
	const { address, quantity, networkId } = await c.req.json();
	try {
		const mintParams = await getMintParams(address, quantity, networkId);
		return c.json({
			...mintParams,
			nonce: mintParams.nonce.toString(),
		});
	} catch (error) {
		console.error("Failed to get mint parameters:", error);
		return c.json(
			{
				error: "Failed to get mint parameters",
				message: error instanceof Error ? error.message : String(error),
			},
			500,
		);
	}
};

export const mintController = async (c: Context) => {
	const { address, quantity, nonce, expiry, signature, networkId } =
		await c.req.json();
	try {
		const mintResult = await verifyAndMint(
			address,
			quantity,
			nonce,
			expiry,
			signature,
			networkId,
		);
		return c.json(mintResult);
	} catch (error) {
		console.error("Minting failed:", error);
		return c.json({ error: "Failed to mint NFT", message: error }, 500);
	}
};
