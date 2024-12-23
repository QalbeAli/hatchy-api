import { admin } from "../../firebase/firebase";
import { User } from "../users/user";
import * as crypto from 'crypto';
import { ethers } from "ethers";
import { Timestamp } from "firebase-admin/firestore";
import { MessageResponse } from "../../responses/message-response";

export type UserCreationParams = Pick<
  User,
  "uid" | "email" | "displayName" | "picture" | "disabled"
>;
export interface ReferralCode {
  code: string;
  userId: string;
  createdAt: Date;
  isActive: boolean;
}

export interface ReferralRelationship {
  referrerId: string;
  referredId: string;
  referralCode: string;
  createdAt: Date;
  status: 'pending' | 'completed';
}

export class ReferralsService {
  private referralCodesCollection = admin.firestore().collection('referral-codes');
  private referralRelationsCollection = admin.firestore().collection('referral-relationships');
  private usersCollection = admin.firestore().collection('users');

  public async setAccountReferrer(uid: string, referralCode: string): Promise<MessageResponse> {
    const userDocRef = this.usersCollection.doc(uid);
    const userDoc = (await userDocRef.get());
    if (userDoc.exists) {
      const user = userDoc.data() as User;
      if (user.referralCode !== uid) {
        throw new Error("ReferralCodeAlreadySet");
      }
      const referrerDocRef = admin.firestore().collection('users').doc(referralCode);
      const referrerDoc = (await referrerDocRef.get());
      if (referrerDoc.exists) {
        const referrer = referrerDoc.data() as User;
        await userDocRef.update({
          referralCode: referralCode,
          referralTimestamp: Timestamp.now()
        });
        await referrerDocRef.update({
          referralCount: referrer.referralCount + 1
        });
        return {
          message: "Referrer set successfully"
        };
      } else {
        throw new Error("ReferrerNotFound");
      }
    } else {
      throw new Error("UserNotFound");
    }
  }

  public async createReferralRelationship(referrerId: string, newUser: User): Promise<void> {
    const batch = admin.firestore().batch();

    // Update the referred user (new user)
    const referredUserRef = this.usersCollection.doc(newUser.uid);
    batch.update(referredUserRef, {
      referrerId: referrerId
    });

    // Update referrer's count
    const referrerRef = this.usersCollection.doc(referrerId);
    batch.update(referrerRef, {
      referralCount: admin.firestore.FieldValue.increment(1),
      // Optional: Add XP points for successful referral
      xpPoints: admin.firestore.FieldValue.increment(100)
    });

    await batch.commit();
  }

  /**
   * Gets all users referred by a specific user
   */
  public async getReferredUsers(userId: string): Promise<User[]> {
    const referralsSnapshot = await this.usersCollection
      .where('referrerId', '==', userId)
      .get();

    return referralsSnapshot.docs.map(doc => doc.data() as User);
  }

  /**
   * Gets the user who referred the specified user
   */
  public async getReferrer(userId: string): Promise<User | null> {
    const userDoc = await this.usersCollection.doc(userId).get();
    const userData = userDoc.data() as User;

    if (!userData?.referrerId) return null;

    const referrerDoc = await this.usersCollection.doc(userData.referrerId).get();
    return referrerDoc.data() as User;
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