import { admin } from "../firebase/firebase";
import { Voucher } from "./voucher";

export class VouchersService {
  public async getVouchersOfUser(uid: string): Promise<Voucher[]> {
    const docRef = admin.firestore().collection('vouchers').where('uid', '==', uid);
    const vouchers = (await docRef.get());
    return vouchers.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        holder: data.holder,
        contract: data.contract,
        contractType: data.contractType,
        type: data.type,
        name: data.name,
        amount: data.amount,
        image: data.image,
        tokenId: data.tokenId,
      } as Voucher;
    });
  }
}