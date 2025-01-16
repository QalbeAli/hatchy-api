import { admin } from "../../firebase/firebase";
import { User } from "../users/user";
import { MessageResponse } from "../../responses/message-response";
import { BadRequestError } from "../../errors/bad-request-error";
import { removeUserPrivateData } from "../../utils";

export type UserCreationParams = Pick<
  User,
  "uid" | "email" | "displayName" | "picture" | "disabled"
>;
export interface ReferralCode {
  code: string;
  userId: string;
  createdAt: string;
  isActive: boolean;
}

export interface ReferralRelationship {
  referrerId: string;
  referredId: string;
  referralCode: string;
  createdAt: string;
  status: 'pending' | 'completed';
}

export class ReferralsService {
  private referralRelationsCollection = admin.firestore().collection('referral-relationships');
  private usersCollection = admin.firestore().collection('users');

  /*
  public async setAccountReferrer(uid: string, referralCode: string): Promise<MessageResponse> {
    const referrerId = await this.validateReferralCode(referralCode);

    const userRef = this.usersCollection.doc(uid);
    // Use transaction to ensure atomicity
    await admin.firestore().runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);

      // If there's a valid referrer, update their stats
      if (userDoc.exists && referrerId) {
        const referrerRef = this.usersCollection.doc(referrerId);
        transaction.update(referrerRef, {
          referralCount: admin.firestore.FieldValue.increment(1),
          xpPoints: admin.firestore.FieldValue.increment(100)
        });

        // Create referral relationship document
        const referralRelationshipRef = this.referralRelationsCollection
          .doc();

        transaction.set(referralRelationshipRef, {
          referrerId: referrerId,
          referredId: uid,
          referralCode: referralCode,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          status: 'completed'
        });
      } else {
        throw new BadRequestError("Invalid referral code");
      }
    });

    return {
      message: "Referrer set successfully"
    };
  }
  */

  /**
   * Gets all users referred by a specific user
   */
  public async getReferredUsers(userId: string): Promise<User[]> {
    const referralsSnapshot = await this.usersCollection
      .where('referrerId', '==', userId)
      .get();

    return referralsSnapshot.docs.map(doc => removeUserPrivateData(doc.data() as User));
  }

  /**
   * Gets the user who referred the specified user
   */
  public async getReferrer(userId: string): Promise<User | null> {
    const userDoc = await this.usersCollection.doc(userId).get();
    const userData = userDoc.data() as User;

    if (!userData?.referrerId) return null;

    const referrerDoc = await this.usersCollection.doc(userData.referrerId).get();
    if (referrerDoc.exists) {
      return removeUserPrivateData(referrerDoc.data() as User);
    }
    return null;
  }

  /**
   * Validates a referral code and returns the referrer's ID if valid
   */
  public async validateReferralCode(code: string): Promise<string | null> {
    const referrerSnapshot = await this.usersCollection
      .where('referralCode', '==', code)
      .limit(1)
      .get();

    if (referrerSnapshot.empty) return null;
    return referrerSnapshot.docs[0].id;
  }

  /**
   * Gets referral statistics for a user
   */
  public async getReferralStats(userId: string): Promise<{
    referralCount: number;
    xpPoints: number;
    referrer: User | null;
    recentReferrals: User[];
  }> {
    const [userDoc, recentReferrals, referrer] = await Promise.all([
      this.usersCollection.doc(userId).get(),
      this.getReferredUsers(userId),
      this.getReferrer(userId)
    ]);

    const userData = userDoc.data() as User;

    return {
      referralCount: userData.referralCount || 0,
      xpPoints: userData.xpPoints || 0,
      referrer,
      recentReferrals
    };
  }
}