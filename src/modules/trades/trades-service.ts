import { NotFoundError } from "@mikro-orm/core";
import { admin } from "../../firebase/firebase";
import { Trade, TradeAsset } from "./trade";
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
    // validate that trade is not already completed
    const tradeSnapshot = await tradeRef.get();
    if (tradeSnapshot.exists) {
      const trade = tradeSnapshot.data() as Trade;
      if (trade.status === 'completed') {
        throw new BadRequestError('Trade already completed');
      }
    }
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
      // validate that trade is not already completed
      if (trade.status === 'completed') {
        throw new BadRequestError('Trade already completed');
      }
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
      // Align amounts with tradeVouchers for tradeUser -> myUser
      const tradeVouchersAmounts = tradeVouchers.map((voucher) => {
        const matchingAsset = trade.offerAssets.find(
          (asset) => asset.contract === voucher.contract && asset.tokenId === voucher.tokenId
        );
        if (!matchingAsset) {
          throw new BadRequestError("Offer asset not found for trade voucher");
        }
        return matchingAsset.amount;
      });

      const transferredVouchers1 = await this.transferVouchers(
        tradeUser.uid,
        myUser.uid,
        tradeVouchers,
        allMyUserVouchers,
        tradeVouchersAmounts,
        transaction
      );

      // Align amounts with myVouchers for myUser -> tradeUser
      const myVouchersAmounts = myVouchers.map((voucher) => {
        const matchingAsset = trade.requestAssets.find(
          (asset) => asset.contract === voucher.contract && asset.tokenId === voucher.tokenId
        );
        if (!matchingAsset) {
          throw new BadRequestError("Requested asset not found for user's voucher");
        }
        return matchingAsset.amount;
      });

      const transferredVouchers2 = await this.transferVouchers(
        myUser.uid,
        tradeUser.uid,
        myVouchers,
        allTradeUserVouchers,
        myVouchersAmounts,
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


  public async submitOffer(
    tradeId: string,
    userId: string,
    offerVoucherIds: string[],
    offerAmounts: number[]
  ): Promise<void> {
    // Fetch the trade document
    const tradeSnapshot = await this.tradesCollection.doc(tradeId).get();
    if (!tradeSnapshot.exists) {
      throw new BadRequestError("Trade not found");
    }

    const trade = tradeSnapshot.data() as Trade;
    // validate that trade is not already completed
    if (trade.status === 'completed') {
      throw new BadRequestError('Trade already completed');
    }

    // Validate that the user is not the owner of the trade
    if (trade.userId === userId) {
      throw new BadRequestError("You cannot submit an offer to your own trade");
    }

    // Validate ownership of vouchers
    const offerVouchers = await this.vouchersService.getVouchersByIds(offerVoucherIds);
    if (offerVouchers.length !== offerVoucherIds.length) {
      throw new BadRequestError("Invalid offer vouchers");
    }
    if (offerVouchers.some(v => v.userId !== userId)) {
      throw new BadRequestError("You do not own some of the offered vouchers");
    }
    if (offerVouchers.some(v => v.amount <= 0)) {
      throw new BadRequestError("Offer amounts must be greater than 0");
    }

    // Prepare the offer
    const offer = {
      userId,
      vouchers: offerVouchers.map((v, index) => ({
        uid: v.uid,
        amount: offerAmounts[index],
        contract: v.contract,
        contractType: v.contractType,
        category: v.category,
        name: v.name,
        image: v.image,
        tokenId: v.tokenId,
        type: v.type,
      })),
    };

    // Check if the user already has an offer
    const existingOfferIndex = trade.usersOffers?.findIndex(offer => offer.userId === userId);

    if (existingOfferIndex !== undefined && existingOfferIndex >= 0) {
      // Update the existing offer
      trade.usersOffers[existingOfferIndex] = offer;
    } else {
      // Add a new offer
      trade.usersOffers = [...(trade.usersOffers || []), offer];
    }


    // Update the trade document with the new offer
    await this.tradesCollection.doc(tradeId).update({
      usersOffers: trade.usersOffers,
    });
  }

  public async acceptOffer(
    tradeCreatorId: string,
    tradeId: string,
    offerUserId: string
  ): Promise<void> {
    const res = await admin.firestore().runTransaction(async (transaction) => {
      const tradeSnapshot = await transaction.get(this.tradesCollection.doc(tradeId));
      if (!tradeSnapshot.exists) {
        throw new BadRequestError("Trade not found");
      }

      const trade = tradeSnapshot.data() as Trade;
      // validate that trade is not already completed
      if (trade.status === 'completed') {
        throw new BadRequestError('Trade already completed');
      }

      // Ensure the caller is the trade creator
      if (trade.userId !== tradeCreatorId) {
        throw new BadRequestError("You are not the creator of this trade");
      }

      // Find the offer
      const offer = trade.usersOffers?.find((o) => o.userId === offerUserId);
      if (!offer) {
        throw new BadRequestError("Offer not found");
      }

      // Validate the assets in the offer
      const allOfferUserVouchers = await this.vouchersService.getVouchersOfUser(offerUserId, transaction);
      const offerVouchers = this.filterVouchers(allOfferUserVouchers, offer.vouchers);

      if (offerVouchers.length !== offer.vouchers.length) {
        throw new BadRequestError("Offer vouchers do not match the offer details");
      }

      // Validate the trade creator's assets
      const allTradeCreatorVouchers = await this.vouchersService.getVouchersOfUser(trade.userId, transaction);
      const tradeCreatorVouchers = this.filterVouchers(
        allTradeCreatorVouchers,
        trade.offerAssets
      );

      if (tradeCreatorVouchers.length !== trade.offerAssets.length) {
        throw new BadRequestError("Trade creator's vouchers do not match requested assets");
      }

      const tradeCreatorAmounts = tradeCreatorVouchers.map((voucher) => {
        const matchingAsset = trade.offerAssets.find(
          (asset) => asset.contract === voucher.contract && asset.tokenId === voucher.tokenId
        );
        if (!matchingAsset) {
          throw new BadRequestError("Requested asset not found for trade creator voucher");
        }
        return matchingAsset.amount;
      });

      // Perform the transfer for offer user -> trade creator
      const offerUserAmounts = offerVouchers.map((voucher) => {
        const matchingOffer = offer.vouchers.find(
          (asset) => asset.contract === voucher.contract && asset.tokenId === voucher.tokenId
        );
        if (!matchingOffer) {
          throw new BadRequestError("Offered asset not found for offer user voucher");
        }
        return matchingOffer.amount;
      });

      // transfer vouchers from trade creator to offer user
      const transferredToOfferUser = await this.transferVouchers(
        trade.userId,
        offerUserId,
        tradeCreatorVouchers,
        allOfferUserVouchers,
        tradeCreatorAmounts,
        transaction
      );

      // transfer vouchers from offer user to trade creator
      const transferredToTradeCreator = await this.transferVouchers(
        offerUserId,
        trade.userId,
        offerVouchers,
        allTradeCreatorVouchers,
        offerUserAmounts,
        transaction
      );

      // Mark the trade as completed
      await this.completeTrade(tradeId, transaction);
      return {
        transferredToOfferUser,
        transferredToTradeCreator,
        tradeCreatorId,
        offerUserId,
      };
    });

    // Fetch vouchers after the transaction for logging
    const tradeCreatorVouchers = await this.vouchersService.getVouchersByIds(
      res.transferredToOfferUser.map((tv) => tv.voucher.uid)
    );

    const offerUserVouchers = await this.vouchersService.getVouchersByIds(
      res.transferredToTradeCreator.map((tv) => tv.voucher.uid)
    );
    const offerUser = await this.usersService.get(res.offerUserId);
    const myUser = await this.usersService.get(res.tradeCreatorId);

    // Log the voucher transfers
    await this.vouchersService.logVoucher({
      action: "accept-offer",
      vouchersData: tradeCreatorVouchers,
      actionUserId: myUser.uid,
      actionUserEmail: myUser.email,
      toUserId: offerUser.uid,
      toUserEmail: offerUser.email,
    });

    await this.vouchersService.logVoucher({
      action: "accept-offer",
      vouchersData: offerUserVouchers,
      actionUserId: offerUser.uid,
      actionUserEmail: offerUser.email,
      toUserId: myUser.uid,
      toUserEmail: myUser.email,
    });
  }

  private filterVouchers(vouchers: Voucher[], assets: TradeAsset[]): Voucher[] {
    return vouchers.filter((voucher) =>
      assets.some((asset) => asset.contract === voucher.contract && asset.tokenId === voucher.tokenId)
    );
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