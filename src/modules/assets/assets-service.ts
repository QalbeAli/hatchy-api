import { admin } from "../../firebase/firebase";
import { Asset } from "./asset";
import { CreateAssetParams } from "./create-asset-params";

export class AssetsService {

  public async getAsset(uid: string): Promise<Asset> {
    const snapshot = await admin.firestore().collection('assets').doc(uid).get();
    if (!snapshot.exists) {
      throw new Error('Asset not found');
    }
    return snapshot.data() as Asset;
  }

  public async getAssetByContract(address: string): Promise<Asset> {
    const snapshot = await admin.firestore().collection('assets').where('contract', '==', address).get();
    if (snapshot.empty || snapshot.docs.length === 0) {
      throw new Error('Asset not found');
    }
    return snapshot.docs[0].data() as Asset;
  }

  public async getAssets(): Promise<Asset[]> {
    const snapshot = await admin.firestore().collection('assets').get();
    return snapshot.docs.map(doc => doc.data() as Asset);
  }

  public async getAssetsByIds(ids: string[]): Promise<Asset[]> {
    const snapshot = await admin.firestore().collection('assets').where('uid', 'in', ids).get();
    return snapshot.docs.map(doc => doc.data() as Asset);
  }

  public async createAsset(asset: CreateAssetParams): Promise<Asset> {
    const docRef = admin.firestore().collection('assets').doc();
    const uid = docRef.id;
    await docRef.set({
      uid,
      ...asset
    });
    return {
      ...asset,
      uid
    };
  }

  public async deleteAsset(uid: string): Promise<void> {
    await admin.firestore().collection('assets').doc(uid).delete();
  }
}