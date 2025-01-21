import { admin } from "../../firebase/firebase";
import { ApiKey } from "./api-key";
import { CreateApiKeyParams } from "./create-api-key-params";
import crypto from "crypto";

const generateKey = () => {
  return crypto.randomUUID();
};

export class ApiKeysService {
  apiKeysCollection = admin.firestore().collection('api-keys');
  public async getApiKeys(): Promise<ApiKey[]> {
    const snapshot = await this.apiKeysCollection.get();
    return snapshot.docs.map(doc => doc.data() as ApiKey);
  }

  public async getApiKey(apiKey: string): Promise<ApiKey> {
    const apiKeyDoc = await this.apiKeysCollection.where('apiKey', '==', apiKey).get();
    return apiKeyDoc.docs[0].data() as ApiKey;
  }

  public async createApiKey(apiKeyCreationData: CreateApiKeyParams): Promise<ApiKey> {
    const docRef = this.apiKeysCollection.doc();
    const uid = docRef.id;
    const apiKeyData = {
      uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      apiKey: generateKey(),
      ...apiKeyCreationData
    }
    await docRef.set(apiKeyData);
    const createdApiKey = await docRef.get();
    return {
      ...createdApiKey.data()
    } as ApiKey;
  }

  public async deleteAsset(uid: string): Promise<void> {
    await this.apiKeysCollection.doc(uid).delete();
  }
}