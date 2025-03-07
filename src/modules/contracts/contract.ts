export interface Contract {
  uid: string;
  name: string;
  description?: string;
  address: string;
  chainId: number;
  link: string;
  contractType?: "ERC721" | "ERC1155" | "ERC20" | "Other";
  deployDate: string;
  owner: string;
  verified: boolean;
}