import standardERC721A_11155111 from '../../contract/ignition/deployments/chain-11155111/artifacts/StandardERC721AModule#StandardERC721A.json';
import standardERC721A_80002 from '../../contract/ignition/deployments/chain-80002/artifacts/StandardERC721AModule#StandardERC721A.json';
import standardERC721A_11155420 from '../../contract/ignition/deployments/chain-11155420/artifacts/StandardERC721AModule#StandardERC721A.json';
import standardERC721A_421614 from '../../contract/ignition/deployments/chain-421614/artifacts/StandardERC721AModule#StandardERC721A.json';
import standardERC721A_84532 from '../../contract/ignition/deployments/chain-84532/artifacts/StandardERC721AModule#StandardERC721A.json';

export const standardERC721AbiMap: { [key: string]: any } = {
  '11155111': standardERC721A_11155111,
  '80002': standardERC721A_80002,
  '97': '', //FIXME: BNB Smart Chain Testnetのコントラクトをデプロイ後に変更
  '11155420': standardERC721A_11155420,
  '421614': standardERC721A_421614,
  '84532': standardERC721A_84532,
};
