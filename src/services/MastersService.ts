import { DynamoDB, S3 } from "aws-sdk";
import { cloudfrontBaseUrl, mastersItemsLength, ItemTypeRange, MastersItemsCategory } from "../constants";
import { MastersItem } from "../models/mastersItem";
import { BigNumber, Wallet, ethers } from "ethers";
import { lookup } from "mime-types";
import { CreateTraitParams } from "../models/CreateTraitParams";
import { Trait } from "../entities/Trait";
import { Item } from "../entities/Item";
import { DI } from "..";
import { setAvatarLayer } from "../utils";
import config from "../config";
import { DefaultChainId, getContract } from "../modules/contracts/networks";

const s3 = new S3();
const dynamoDB = new DynamoDB.DocumentClient();
const mainHeadTattooId = 11;
const headTattooOrder = [17, 18, 19, 20];

const mainBodyTattooId = 12;
const bodyTattooOrder = [8, 9, 10, 11];

const hairOrderIds = [28, 25]
const backHairOrderId = 3
const earOrderId = 6;
const backMaskCategoryIds = [11];
const headTypeId = 8;
const requiredTraitTypes = [1, 3, 4, 5, 6, 7, 8]

const avatarsTicketId = 0;

export class MastersService {
  chainId: number;

  constructor(chainId?: number) {
    this.chainId = chainId || DefaultChainId;
  }

  async getItem(tokenId: string) {
    const category = MastersItemsCategory;
    const params = {
      TableName: process.env.ASSETS_TABLE,
      IndexName: 'categoryTokenIdIndex',
      KeyConditionExpression: 'category = :category AND tokenId = :tokenId',
      ExpressionAttributeValues: {
        ':category': category,
        ':tokenId': tokenId
      },
      ScanIndexForward: false,
      Limit: 1
    };
    const result = await dynamoDB.query(params).promise();
    return {
      ...result.Items[0],
      tokenId: parseInt(result.Items[0].tokenId),
      itemType: Math.floor(parseInt(result.Items[0].tokenId) / ItemTypeRange),
    } as MastersItem;
  }

  async getGenders() {
    const genders = await DI.traitGenders.findAll();
    return genders;
  }

  async getAvatarsPrices() {
    const prices = await DI.mastersAvatarsPrice.findAll({
      where: { chainId: this.chainId }
    });
    return prices;
  }

  async getAvatarPrice(currency: string) {
    const price = await DI.mastersAvatarsPrice.findOne({
      chainId: this.chainId,
      currency: currency
    });
    return price;
  }

  async getColors(typeId: number) {
    const filter = { typeId: typeId };
    const colors = await DI.traitColors.findAll({ where: filter });
    return colors;
  }

  async getTraitTypes() {
    const traitTypes = await DI.traitTypes.findAll({
      populate: ["layers"],
    });
    return traitTypes;
  }

  async getTraitUploadUrl(filename: string, traitId: number) {
    const trait = await DI.traitTypes.findOne({ id: traitId });
    const timestamp = Date.now();
    const extension = filename.split('.').pop();
    const name = filename.split('.').shift();
    const contentType = lookup(filename);
    const s3Key = `masters/traits/${trait.name}/${name}-${timestamp}.${extension}`;
    const s3Params = {
      Bucket: config.HATCHYPOCKET_BUCKET_NAME,
      Key: s3Key,
      Expires: 60 * 60 * 1, // URL will be valid for 5 hours
      ContentType: contentType,
    };
    const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);

    return {
      uploadUrl,
      fileUrl: `https://${config.HATCHYPOCKET_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`
    };
  }

  async addTrait(trait: CreateTraitParams) {
    const traitsWithSameType = await DI.traits.find({ type: trait.typeId });

    const traitType = await DI.traitTypes.findOne({ id: trait.typeId });
    const traitId = traitsWithSameType.length + 1;
    const newTrait = DI.traits.create({
      name: trait.name || `${traitType.name} ${traitId}`,
      image: trait.image,
      frontImage: trait.frontImage,
      backImage: trait.backImage,
      type: trait.typeId,
      gender: trait.genderId,
      color: trait.colorId,
    });
    await DI.traits.insert(newTrait);
    return newTrait;
  }

  async getAllTraits(
    // genderId?: number,
    // colorId?: number,
    typeId?: number
  ) {
    const filters = {};
    filters['hide'] = false;
    // if (genderId) {
    //   filters['gender'] = genderId;
    // }
    // if (colorId) {
    //   filters['color'] = colorId;
    // }
    if (typeId != null) {
      filters['type'] = typeId;
    }
    const traits = await DI.traits.find(
      filters,
      {
        populate: ["gender", "color", "type", "type.layers"],
      }
    );

    return traits;
  }

  async getMintTraits() {
    // exclude non main head/body tattoo
    const traitTypes = await DI.traitTypes.findAll({
      where: {
        id: { $nin: [13, 14, 15, 16, 17, 18] }
      }
    });
    const traitPromises = traitTypes
      .sort((a, b) => a.order - b.order)
      .map(async (type) => {
        const [colors, traits] = await Promise.all([
          this.getColors(type.id),
          this.getAllTraits(type.id)
        ]);
        return {
          colors,
          traits,
          type
        };
      });
    const mintTraits = await Promise.all(traitPromises);
    return mintTraits;
  }

  async isValidTraits(traits: number[]) {
    const allTraits = await DI.traits.find(
      {
        id: { $in: traits }
      }
    );

    const nonNullTraits = allTraits.map(trait => trait.id);
    // validate that all the required trait types are present
    const traitTypes = allTraits.map(trait => trait.type.id);
    const missingTraitTypes = requiredTraitTypes.filter(type => !traitTypes.includes(type));
    if (missingTraitTypes.length > 0) {
      return false;
    }
    // validate that all the traits are unique
    const uniqueTraits = new Set(nonNullTraits);
    if (uniqueTraits.size !== nonNullTraits.length) {
      return false;
    }
    // validate that all traits have the same gender or undefined
    const genders = allTraits
      .filter(trait => trait.gender !== undefined) // Step 1: Filter out undefined genders
      .map(trait => trait.gender);

    const isSameGender = genders.every((gender, _, array) => gender === array[0]); // Step 2: Check if all genders are the same
    if (!isSameGender && genders.length > 0) { // Step 3: If there are different genders, return false
      return false;
    }

    return true;
  }

  async getAvatarMintSignature(
    receiver: string,
    traits: number[],
    currency: string,
    payWithTicket: boolean
  ) {
    const provider = new ethers.providers.JsonRpcProvider(
      config.JSON_RPC_URL
    );
    const signer = new Wallet(config.MASTERS_SIGNER_KEY, provider);
    const nonce = BigNumber.from(ethers.utils.randomBytes(32));
    const ticketsContract = getContract('hatchyTickets', this.chainId);

    if (payWithTicket) {
      const ticketsBalance = await ticketsContract.balanceOf(receiver, avatarsTicketId);
      if (ticketsBalance.eq(0)) {
        throw new Error("No tickets available to mint avatar");
      }
      const currency = ethers.constants.AddressZero;
      const values = [receiver, currency, 0, true, traits, nonce];
      console.log(values);

      const hash = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "bool", "uint256[]", "uint256"],
        values
      );
      const signature = await signer.signMessage(ethers.utils.arrayify(hash));
      return {
        receiver,
        price: 0,
        decimals: 18,
        currency: currency,
        payWithTicket: true,
        traits,
        nonce,
        signature
      };
    } else {
      const avatarPrice = await this.getAvatarPrice(currency);

      const price = ethers.utils.parseUnits(avatarPrice.price, avatarPrice.decimals);
      const hash = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "bool", "uint256[]", "uint256"],
        [receiver, avatarPrice.address, price, false, traits, nonce]
      );
      const signature = await signer.signMessage(ethers.utils.arrayify(hash));
      return {
        receiver,
        price: price.toString(),
        decimals: avatarPrice.decimals,
        currency: avatarPrice.address,
        payWithTicket: false,
        traits,
        nonce,
        signature
      };
    }
  };

  async getAvatarFreeMintSignature(
    receiver: string,
    traits: number[],
  ) {
    const provider = new ethers.providers.JsonRpcProvider(
      config.JSON_RPC_URL
    );
    const signer = new Wallet(config.MASTERS_SIGNER_KEY, provider);
    const nonce = BigNumber.from(ethers.utils.randomBytes(32));
    const ticketsContract = getContract('joepegsTickets', this.chainId);
    const ticketsBalance = await ticketsContract.balanceOf(receiver, 0);
    if (ticketsBalance.eq(0)) {
      throw new Error("No tickets available to mint avatar");
    }

    const hash = ethers.utils.solidityKeccak256(
      ["address", "uint256[]", "uint256"],
      [receiver, traits, nonce]
    );
    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return {
      receiver,
      traits,
      nonce,
      signature
    };
  };

  async getAvatarTraits(tokenId: number) {
    const avatarsContract = getContract('mastersAvatars', this.chainId);
    const traits: BigNumber[] = await avatarsContract.getTraits(tokenId);
    const numberTraits = traits.map(trait => trait.toNumber());
    const nonNullTraits = numberTraits.filter((trait) => trait !== 0);
    const allTraitsResult = await DI.traits.find(
      {
        id: { $in: nonNullTraits }
      },
      { populate: ["type", "type.layers", "gender"] }
    );
    // Sort allTraits in the same order as nonNullTraits
    const allTraits = allTraitsResult.sort((a, b) => nonNullTraits.indexOf(a.id) - nonNullTraits.indexOf(b.id));
    return allTraits;
  };

  async getAvatarItems(tokenId: number, positioned?: boolean) {
    const avatarsContract = getContract('mastersAvatars', this.chainId);
    const itemIds: BigNumber[] = await avatarsContract.getEquippedItems(tokenId);
    const items = await DI.items.findAll({
      populate: ['category', 'category.type', 'category.type.layers', 'gender'],
      where: {
        id: { $in: itemIds.map(id => id.toNumber()) }
      }
    });
    if (positioned) {
      const itemsPositioned = Array.from({ length: mastersItemsLength }, () => undefined);
      for (const item of items) {
        itemsPositioned[item.category.type.id] = item;
      }
      return itemsPositioned;
    }
    return items;
  };

  async getAvatarImage(id: number) {
    const avatar = await DI.mastersAvatars.findOne(id);
    return {
      ...avatar,
      timestamp: avatar?.image.split('_')[1].split('.')[0]
    }
  };

  async updateAvatarImage(tokenId: number, image: string) {
    const existingAvatar = await DI.mastersAvatars.findOne(tokenId);
    if (!existingAvatar) {
      const newAvatar = DI.mastersAvatars.create({
        id: tokenId,
        image
      });
      await DI.mastersAvatars.insert(newAvatar);
      return newAvatar;
    }
    await DI.mastersAvatars.nativeUpdate(
      { id: tokenId },
      { image }
    );
    return existingAvatar;
  }

  async getAvatarImageUploadURL(tokenId: number, extension: string) {
    const timestamp = Date.now();
    const image = `${config.NODE_ENV == 'dev' ? 'dev/' : ''}masters/avatars/${tokenId}_${timestamp}.${extension}`;

    const s3Params = {
      Bucket: config.HATCHYPOCKET_BUCKET_NAME,
      Key: image,
      Expires: 60 * 5, // URL will be valid for 5 minutes
      ContentType: `image/${extension}`,
    };
    const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);
    const traits = await this.getAvatarTraits(tokenId);
    const items = await this.getAvatarItems(tokenId);

    const oldImage = await this.getAvatarImage(tokenId);
    if (oldImage) {
      console.log(`${config.NODE_ENV == 'dev' ? 'dev/' : ''}masters/avatars/${tokenId}_${oldImage.timestamp}.${extension}`);
      await s3.deleteObject({
        Bucket: config.HATCHYPOCKET_BUCKET_NAME,
        Key: `${config.NODE_ENV == 'dev' ? 'dev/' : ''}masters/avatars/${tokenId}_${oldImage.timestamp}.${extension}`,
      }).promise();
    }

    const dbImage = `${cloudfrontBaseUrl}${image}`;
    await this.updateAvatarImage(tokenId, dbImage);

    return {
      uploadUrl,
      layers: this.getAvatarLayers(traits, items),
    }
  }

  async getAvatar(tokenId: number) {
    const avatarsContract = getContract('mastersAvatars', this.chainId);
    const nextMintId = await avatarsContract.nextMintId();
    if (tokenId >= Number(nextMintId)) {
      throw new Error("Avatar not found");
    }

    // const items = await this.getAvatarItems(tokenId);
    // const allTraits = await this.getAvatarTraits(tokenId);
    // const avatarImage = await this.getAvatarImage(tokenId);

    const [items, allTraits, avatarImage] = await Promise.all([
      this.getAvatarItems(tokenId, true),
      this.getAvatarTraits(tokenId),
      this.getAvatarImage(tokenId)
    ]);

    return {
      tokenId: tokenId,
      image: avatarImage.image,
      name: `Master Avatar #${tokenId}`,
      attributes: allTraits.map((trait, index) => {
        return {
          trait_type: trait.type.name,
          value: trait.name,
        };
      }),
      traits: allTraits,
      equippedItems: items,
      layers: this.getAvatarLayers(allTraits, items)
    };
  };

  async getAvatarsBalance(address: string) {
    const avatarsContract = getContract('mastersAvatars', this.chainId);
    const balance: BigNumber = await avatarsContract.balanceOf(address);
    const avatarsPromises = [];
    for (let i = 0; i < balance.toNumber(); i++) {
      const _tokenId = await avatarsContract.tokenOfOwnerByIndex(address, i);
      const tokenId = Number(_tokenId);
      avatarsPromises.push(this.getAvatar(tokenId));
    }
    const avatars = await Promise.all(avatarsPromises);
    return avatars;
  };

  getAvatarLayers(traits: Trait[], items: Item[]) {
    const orderedLayers = new Map();
    let headTattooCount = 0;
    let bodyTattooCount = 0;
    for (const trait of traits) {
      if (trait.type.id === mainHeadTattooId) {
        const order = headTattooOrder[headTattooCount];
        setAvatarLayer(orderedLayers, order, trait.image);
        headTattooCount++;
      } else if (trait.type.id === mainBodyTattooId) {
        const order = bodyTattooOrder[bodyTattooCount];
        setAvatarLayer(orderedLayers, order, trait.image);
        bodyTattooCount++;
      } else {
        for (const layer of trait.type.layers) {
          switch (layer.layer) {
            case 'back':
              setAvatarLayer(orderedLayers, layer.order, trait.backImage);
              break;
            case 'front':
              setAvatarLayer(orderedLayers, layer.order, trait.frontImage);
              break;
            default:
              setAvatarLayer(orderedLayers, layer.order, trait.image);
              break;
          }
        }
      }
    }

    // mask head tattoos with face trait
    const headTrait = traits.find(trait => trait.type.id === headTypeId);
    for (const orderId of headTattooOrder) {
      const tattooData = orderedLayers.get(orderId);
      setAvatarLayer(orderedLayers, orderId, tattooData?.image, headTrait.image);
    }

    for (const item of items) {
      if (!item) continue;

      if (backMaskCategoryIds.includes(item.category.id)) {
        // if hat is on remove back hair
        setAvatarLayer(orderedLayers, backHairOrderId, undefined);
      }

      if (!!item.maskImage) {
        // mask front and main hair
        for (const orderId of hairOrderIds) {
          const hairData = orderedLayers.get(orderId);
          setAvatarLayer(orderedLayers, orderId, hairData?.image, item.maskImage);
        }
        setAvatarLayer(orderedLayers, backHairOrderId, undefined);

        // mask ear
        const earData = orderedLayers.get(earOrderId);
        setAvatarLayer(orderedLayers, earOrderId, earData.image, item.maskImage);
      }

      for (const layer of item.category.type.layers) {
        switch (layer.layer) {
          case 'back':
            setAvatarLayer(orderedLayers, layer.order, item.backImage);
            break;
          case 'front':
            setAvatarLayer(orderedLayers, layer.order, item.frontImage);
            break;
          default:
            setAvatarLayer(orderedLayers, layer.order, item.image);
            break;
        }
      }
    }

    const layers = Array.from(orderedLayers)
      .sort((a, b) => a[0] - b[0])
      .map(([key, value]) => value)
      .filter(value => !!value.image);
    return layers;
  }

  async getAvatarsImages(address: string) {
    const avatarsContract = getContract('mastersAvatars', this.chainId);
    const balance: BigNumber = await avatarsContract.balanceOf(address);
    const tokenIdsPromises = [];

    for (let i = 0; i < balance.toNumber(); i++) {
      tokenIdsPromises.push(avatarsContract.tokenOfOwnerByIndex(address, i));
    }

    const tokenIds = await Promise.all(tokenIdsPromises);
    const tokenIdsArray = tokenIds.map(_tokenId => Number(_tokenId));

    // Fetch all avatars in a single database query
    const avatars = await DI.mastersAvatars.findAll({
      where: { id: { $in: tokenIdsArray } },
      fields: ['image']
    });

    const avatarImages = avatars.map(avatar => avatar.image);


    return {
      type: 'ERC-721',
      name: 'Masters Avatars',
      profilePictures: avatarImages
    };
  };
}