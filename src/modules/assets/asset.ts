export interface Asset {
  uid: string;
  name: string;
  category: string;
  description: string;
  contract?: string;
  holder?: string;
  contractType?: "ERC721" | "ERC1155" | "ERC20";
  tokenId?: string;
  type?: "blockchain" | "game";
  image: string;
}