import { ethers } from "ethers";
import { admin } from "../../firebase/firebase";
import { Contract } from "./contract";
import { CreateContractParams } from "./create-contract-params";
import { getAnyProvider, getProvider } from "./networks";

export class ContractsService {
  contractsCollection = admin.firestore().collection('contracts');

  public async getContract(uid: string): Promise<Contract> {
    const snapshot = await this.contractsCollection.doc(uid).get();
    if (!snapshot.exists) {
      throw new Error('Contract not found');
    }
    return {
      ...snapshot.data() as Contract,
    }
  }

  public async getContracts(): Promise<Contract[]> {
    const snapshot = await this.contractsCollection.get();
    const contracts = snapshot.docs.map(doc => doc.data() as Contract);
    const contractsWithOwner = await Promise.all(contracts.map(async contract => {
      const owner = await this.getContractOwner(contract.uid);
      return {
        ...contract,
        owner
      };
    }));
    return contractsWithOwner;
  }

  public async getContractOwner(uid: string): Promise<string> {
    try {
      const contract = await this.getContract(uid);
      const contractABI = [
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ];
      const contractAddress = contract.address;
      const provider = getAnyProvider(contract.chainId);
      const contractInstance = new ethers.Contract(contractAddress, contractABI, provider);
      const owner = await contractInstance.owner();
      return owner;
    } catch (error) {
      return 'Unknown';
    }
  }

  public async createContract(contract: CreateContractParams): Promise<Contract> {
    const docRef = this.contractsCollection.doc();
    const uid = docRef.id;
    await docRef.set({
      uid,
      ...contract
    });
    const owner = await this.getContractOwner(uid);
    return {
      ...contract,
      owner,
      uid
    };
  }

  public async updateContract(uid: string, contract: CreateContractParams): Promise<Contract> {
    await this.contractsCollection.doc(uid).update(contract);
    const owner = await this.getContractOwner(uid);
    return {
      ...contract,
      owner,
      uid
    };
  }

  public async deleteContract(uid: string): Promise<void> {
    await this.contractsCollection.doc(uid).delete();
  }
}