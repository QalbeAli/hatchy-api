import { admin } from "../../firebase/firebase";
import { User } from "./user";

export type UserCreationParams = Pick<
  User,
  "uid" | "email" | "displayName" | "picture" | "disabled"
>;

export class UsersService {
  public async get(uid: string): Promise<User> {
    const user = (await admin.firestore().collection('users').doc(uid).get()).data();
    return user as User;
  }

}