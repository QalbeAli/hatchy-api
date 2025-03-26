import { NotFoundError } from "@mikro-orm/core";
import { admin } from "../../firebase/firebase";
import { Trade } from "./trade";
import { Transaction } from "firebase-admin/firestore";
import { VouchersService } from "../vouchers/vouchers-service";
import { UsersService } from "../users/usersService";
import { Voucher } from "../vouchers/voucher";
import { BadRequestError } from "../../errors/bad-request-error";
import { AssetsService } from "../assets/assets-service";

export class TradesService {
  tradesCollection = admin.firestore().collection('trades');
  vouchersCollection = admin.firestore().collection('vouchers');
  vouchersService = new VouchersService();
  usersService = new UsersService();
  assetsService = new AssetsService();

  public async getTrade(uid: string, transaction?: Transaction): Promise<Trade> {
    if (transaction) {
      const snapshot = await transaction.get(this.tradesCollection.doc(uid));
      if (!snapshot.exists) {
        throw new NotFoundError('Not found');
      }
      return snapshot.data() as Trade;
    }
    const snapshot = await this.tradesCollection.doc(uid).get();
    if (!snapshot.exists) {
      throw new NotFoundError('Not found');
    }
    return snapshot.data() as Trade;
  }

  public async getTrades(): Promise<Trade[]> {
    const snapshot = await this.tradesCollection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as Trade);
  }

  public async getMyTrades(userId: string): Promise<Trade[]> {
    const snapshot = await this.tradesCollection
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => doc.data() as Trade);
  }

  public async updateTrade(
    tradeId: string,
    userId: string,
    requestAssetsIds: string[],
    requestAmounts: number[],
    offerVoucherIds: string[],
    offerAmounts: number[],
  ) {
    /*
      1. verify that the user has the offer voucher ids and amounts 
      2. verify that the asset ids exists on the assets collection
      3. create trade document on trades collection with the array with complete data of requested assets and offered assets plus an empty array of users optional offers
    */
    const user = await new UsersService().get(userId);

    const requestAssets = await this.assetsService.getAssetsByIds(requestAssetsIds);
    const offerVouchers = await this.vouchersService.getVouchersByIds(offerVoucherIds);

    if (requestAssets.length !== requestAssetsIds.length) {
      throw new BadRequestError('Invalid request assets');
    }
    if (offerVouchers.length !== offerVoucherIds.length) {
      throw new BadRequestError('Invalid offer vouchers');
    }

    if (offerVouchers.some(v => v.userId !== userId)) {
      throw new BadRequestError('Offer vouchers do not belong to user');
    }

    if (offerVouchers.some(v => v.amount <= 0)) {
      throw new BadRequestError('Offer amount should be greater than 0');
    }

    const tradeRef = admin.firestore().collection('trades').doc(tradeId);
    const trade = {
      uid: tradeRef.id,
      userId,
      username: user.displayName,
      requestAssets: requestAssets.map(a => ({
        uid: a.uid,
        name: a.name,
        image: a.image,
        contract: a.contract,
        contractType: a.contractType,
        category: a.category,
        amount: requestAmounts[requestAssets.indexOf(a)],
        tokenId: a.tokenId
      })),
      offerAssets: offerVouchers.map(v => ({
        uid: v.uid,
        name: v.name,
        image: v.image,
        contract: v.contract,
        contractType: v.contractType,
        category: v.category,
        amount: offerAmounts[offerVouchers.indexOf(v)],
        tokenId: v.tokenId
      })),
      usersOffers: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await tradeRef.set(trade);
    return trade;
  }

  public async deleteTrade(uid: string): Promise<void> {
    await this.tradesCollection.doc(uid).delete();
  }

  public async completeTrade(uid: string, transaction?: Transaction): Promise<void> {
    if (transaction) {
      transaction.update(this.tradesCollection.doc(uid), { status: 'completed' });
    } else {
      await this.tradesCollection.doc(uid).update({ status: 'completed' });
    }
  }

  public async acceptTrade(userId: string, tradeId: string): Promise<void> {
    const res = await admin.firestore().runTransaction(async (transaction) => {
      const trade = await this.getTrade(tradeId);
      const tradeUser = await this.usersService.get(trade.userId);
      const myUser = await this.usersService.get(userId);


      const allTradeUserVouchers = await this.vouchersService.getVouchersOfUser(trade.userId, transaction);
      const tradeVouchers = allTradeUserVouchers.
        filter(voucher => trade.offerAssets.some(asset => asset.contract === voucher.contract && asset.tokenId === voucher.tokenId))
      if (tradeVouchers.length !== trade.offerAssets.length) {
        throw new BadRequestError('Vouchers not found');
      }
      const allMyUserVouchers = await this.vouchersService.getVouchersOfUser(userId, transaction);
      const myVouchers = allMyUserVouchers.
        filter(voucher => trade.requestAssets.some(asset => asset.contract === voucher.contract && asset.tokenId === voucher.tokenId))
      if (myVouchers.length !== trade.requestAssets.length) {
        throw new BadRequestError('Vouchers not found');
      }

      if (tradeUser.uid === myUser.uid) {
        throw new BadRequestError('You cannot trade with yourself');
      }

      const transferredVouchers1 = await this.transferVouchers(
        tradeUser.uid,
        myUser.uid,
        tradeVouchers,
        allMyUserVouchers,
        trade.offerAssets.map(asset => asset.amount),
        transaction
      );
      const transferredVouchers2 = await this.transferVouchers(
        myUser.uid,
        tradeUser.uid,
        myVouchers,
        allTradeUserVouchers,
        trade.requestAssets.map(asset => asset.amount),
        transaction
      );
      await this.completeTrade(tradeId, transaction);
      return {
        myUser,
        tradeUser,
        transferredVouchers1,
        transferredVouchers2
      }
    });
    const myVouchers = await this.vouchersService.getVouchersByIds(res.transferredVouchers1.map(voucher => voucher.voucher.uid));
    const tradeVouchers = await this.vouchersService.getVouchersByIds(res.transferredVouchers2.map(voucher => voucher.voucher.uid));
    await this.vouchersService.logVoucher({
      action: 'trade',
      vouchersData: myVouchers,
      actionUserId: res.tradeUser.uid,
      actionUserEmail: res.tradeUser.email,
      toUserId: res.myUser.uid,
      toUserEmail: res.myUser.email,
    })
    await this.vouchersService.logVoucher({
      action: 'trade',
      vouchersData: tradeVouchers,
      actionUserId: res.myUser.uid,
      actionUserEmail: res.myUser.email,
      toUserId: res.tradeUser.uid,
      toUserEmail: res.tradeUser.email,
    })
  }

  public async transferVouchers(
    userId: string,
    receiverUserId: string,
    vouchers: Voucher[],
    receiverVouchers: Voucher[],
    voucherAmounts: number[],
    transaction: Transaction
  ) {
    /////////////////////// transfer vouchers from tradeUser to myUser
    const insertedVouchers = [];
    for (let i = 0; i < vouchers.length; i++) {
      const voucher = vouchers[i];
      const voucherAmount = voucherAmounts[i];

      if (!voucher) {
        throw new BadRequestError('Voucher not found');
      }

      if (voucher.userId !== userId) {
        throw new BadRequestError('Voucher does not belong to user');
      }

      if (voucherAmount > voucher.amount) {
        throw new BadRequestError('Voucher amount is not enough');
      }

      const receiverVoucher = receiverVouchers.find(v => v.contract === voucher.contract && v.tokenId === voucher.tokenId);

      if (receiverVoucher) {
        const receiverVoucherRef = this.vouchersCollection.doc(receiverVoucher.uid);
        transaction.update(receiverVoucherRef, { amount: receiverVoucher.amount + voucherAmount });
        insertedVouchers.push({
          voucher: receiverVoucher,
          amount: voucherAmount
        });
      } else {
        const newVoucherRef = this.vouchersCollection.doc();
        const newVoucher = {
          uid: newVoucherRef.id,
          userId: receiverUserId,
          holder: voucher.holder,
          contract: voucher.contract,
          contractType: voucher.contractType,
          type: voucher.type,
          name: voucher.name,
          amount: voucherAmount,
          image: voucher.image,
          tokenId: voucher.tokenId,
          blockchainId: voucher.blockchainId,
          category: voucher.category,
          receiver: voucher.receiver || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        transaction.set(newVoucherRef, newVoucher);
        insertedVouchers.push({
          voucher: newVoucher,
          amount: voucherAmount
        });
      }

      const voucherRef = this.vouchersCollection.doc(voucher.uid);
      if (voucher.amount - voucherAmount === 0) {
        transaction.delete(voucherRef);
      } else {
        transaction.update(voucherRef, { amount: voucher.amount - voucherAmount });
      }
    }
    return insertedVouchers;
  }

  public async updateUsername(userId: string, username: string): Promise<void> {
    const snapshot = await this.tradesCollection
      .where('userId', '==', userId)
      .get();
    snapshot.docs.forEach(doc => {
      this.tradesCollection.doc(doc.id).update({
        username,
      });
    });
  }
}