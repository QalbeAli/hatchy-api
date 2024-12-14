import { NotFoundError } from "../../errors/not-found-error";
import { admin } from "../../firebase/firebase";
import { User } from "./user";

export type UserCreationParams = Pick<
  User,
  "uid" | "email" | "displayName" | "picture" | "disabled"
>;

export class UsersService {
  collection = admin.firestore().collection('users');
  public async get(uid: string): Promise<User> {
    const user = (await this.collection.doc(uid).get()).data();
    return user as User;
  }

  public async setRewardReceiverAddress(
    uid: string,
    rewardReceiverAddress: string,
  ): Promise<User> {
    const user = await this.get(uid);
    const hasAddress = user.wallets.some(
      (wallet) => wallet.address === rewardReceiverAddress,
    );
    if (!hasAddress) {
      throw new NotFoundError("Address not found in user wallets");
    }
    await this.collection.doc(uid).update({
      rewardReceiverAddress,
    });
    return await this.get(uid);
  }

}