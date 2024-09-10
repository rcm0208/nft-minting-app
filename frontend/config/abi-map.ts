import standardERC721A_59141 from "../../contract/ignition/deployments/chain-59141/artifacts/StandardERC721AModule#StandardERC721A.json";
import standardERC721A_80002 from "../../contract/ignition/deployments/chain-80002/artifacts/StandardERC721AModule#StandardERC721A.json";
import standardERC721A_84532 from "../../contract/ignition/deployments/chain-84532/artifacts/StandardERC721AModule#StandardERC721A.json";
import standardERC721A_421614 from "../../contract/ignition/deployments/chain-421614/artifacts/StandardERC721AModule#StandardERC721A.json";
import standardERC721A_11155111 from "../../contract/ignition/deployments/chain-11155111/artifacts/StandardERC721AModule#StandardERC721A.json";
import standardERC721A_11155420 from "../../contract/ignition/deployments/chain-11155420/artifacts/StandardERC721AModule#StandardERC721A.json";
import standardERC721A_168587773 from "../../contract/ignition/deployments/chain-168587773/artifacts/StandardERC721AModule#StandardERC721A.json";

import gaslessERC721A_80002 from "../../contract/ignition/deployments/chain-80002/artifacts/GaslessERC721AModule#GaslessERC721A.json";
import gaslessERC721A_84532 from "../../contract/ignition/deployments/chain-84532/artifacts/GaslessERC721AModule#GaslessERC721A.json";
import gaslessERC721A_421614 from "../../contract/ignition/deployments/chain-421614/artifacts/GaslessERC721AModule#GaslessERC721A.json";
import gaslessERC721A_11155111 from "../../contract/ignition/deployments/chain-11155111/artifacts/GaslessERC721AModule#GaslessERC721A.json";
import gaslessERC721A_11155420 from "../../contract/ignition/deployments/chain-11155420/artifacts/GaslessERC721AModule#GaslessERC721A.json";
// import gaslessERC721A_168587773 from "../../contract/ignition/deployments/chain-168587773/artifacts/GaslessERC721AModule#GaslessERC721A.json";
// import gaslessERC721A_59141 from "../../contract/ignition/deployments/chain-59141/artifacts/GaslessERC721AModule#GaslessERC721A.json";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const standardERC721AbiMap: { [key: string]: any } = {
	"11155111": standardERC721A_11155111,
	"80002": standardERC721A_80002,
	"97": "", //FIXME: コントラクトをデプロイ後に変更
	"11155420": standardERC721A_11155420,
	"421614": standardERC721A_421614,
	"84532": standardERC721A_84532,
	"168587773": standardERC721A_168587773,
	"59141": standardERC721A_59141,
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const gaslessERC721AbiMap: { [key: string]: any } = {
	"11155111": gaslessERC721A_11155111,
	"80002": gaslessERC721A_80002,
	"97": "",
	"11155420": gaslessERC721A_11155420,
	"421614": gaslessERC721A_421614,
	"84532": gaslessERC721A_84532,
	"168587773": "", // FIXME: コントラクトをデプロイ後に変更
	"59141": "", // FIXME: コントラクトをデプロイ後に変更
};
