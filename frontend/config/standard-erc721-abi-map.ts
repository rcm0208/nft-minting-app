import standardERC721A_11155111 from '../../contract/ignition/deployments/chain-11155111/artifacts/StandardERC721AModule#StandardERC721A.json';
import standardERC721A_80002 from '../../contract/ignition/deployments/chain-80002/artifacts/StandardERC721AModule#StandardERC721A.json';

export const standardERC721AbiMap: { [key: string]: any } = {
  '11155111': standardERC721A_11155111,
  '80002': standardERC721A_80002,
  '97': '', //FIXME: BNB Smart Chain Testnetのコントラクトをデプロイ後に変更
  '421614': '', //FIXME: Arbitrum Sepoliaのコントラクトをデプロイ後に変更
  '84532': '', //FIXME: Base Sepoliaのコントラクトをデプロイ後に変更
};
