import { admin } from "../../firebase/firebase";
import { Asset } from "./asset";
import { AssetAgreement } from "./asset-agreement";
import { CreateAssetParams } from "./create-asset-params";

export class AssetsService {

  assetsAgreementsCollection = admin.firestore().collection('assets-agreements');

  public async postAssetAgreement(
    uid: string,
    body: {
      accepted: boolean,
      role: string
    }
  ): Promise<AssetAgreement> {
    const docRef = this.assetsAgreementsCollection.doc(uid);
    const agreement = {
      uid: docRef.id,
      date: admin.firestore.FieldValue.serverTimestamp(),
      role: body.role,
      accepted: body.accepted
    };
    await docRef.set(agreement);
    const newAgreement = await this.getAssetAgreement(uid);
    return newAgreement;
  }

  public async getAssetAgreement(uid: string): Promise<AssetAgreement | null> {
    const snapshot = await this.assetsAgreementsCollection.doc(uid).get();
    if (!snapshot.exists) {
      return null;
    }
    return snapshot.data() as AssetAgreement;
  }

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