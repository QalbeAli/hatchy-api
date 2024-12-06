/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { VouchersController } from './../modules/vouchers/vouchers-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UsersController } from './../modules/users/usersController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TraitsController } from './../masters/TraitsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MastersController } from './../masters/MastersController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LootboxesController } from './../masters/LootboxesController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ItemsController } from './../masters/ItemsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AvatarsController } from './../masters/AvatarsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LinkController } from './../modules/link/linkController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GameSavesController } from './../modules/games/game-saves-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GameController } from './../modules/games/game-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LeaderboardController } from './../modules/leaderboard/leaderboard-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../modules/auth/authController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Gen2Controller } from './../modules/gen2/Gen2Controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TicketsController } from './../modules/tickets/TicketsController';
import { expressAuthentication } from './../authentication';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Voucher": {
        "dataType": "refObject",
        "properties": {
            "blockchainId": {"dataType":"string","required":true},
            "uid": {"dataType":"string","required":true},
            "amount": {"dataType":"double","required":true},
            "category": {"dataType":"string","required":true},
            "contract": {"dataType":"string","required":true},
            "contractType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ERC20"]},{"dataType":"enum","enums":["ERC721"]},{"dataType":"enum","enums":["ERC1155"]}],"required":true},
            "holder": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["blockchain"]},{"dataType":"enum","enums":["game"]}],"required":true},
            "userId": {"dataType":"string","required":true},
            "image": {"dataType":"string"},
            "receiver": {"dataType":"string"},
            "tokenId": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BigNumber": {
        "dataType": "refAlias",
        "type": {"dataType":"any","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VoucherClaimSignature": {
        "dataType": "refObject",
        "properties": {
            "rewardContractType": {"dataType":"double","required":true},
            "rewardHolderAddress": {"dataType":"string","required":true},
            "rewardContract": {"dataType":"string","required":true},
            "receiver": {"dataType":"string","required":true},
            "amount": {"dataType":"union","subSchemas":[{"ref":"BigNumber"},{"dataType":"double"}],"required":true},
            "claimableUntil": {"dataType":"double","required":true},
            "voucherId": {"dataType":"string","required":true},
            "signature": {"dataType":"string","required":true},
            "tokenId": {"dataType":"double"},
            "eggType": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessageResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "User": {
        "dataType": "refObject",
        "properties": {
            "uid": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "displayName": {"dataType":"string","required":true},
            "picture": {"dataType":"string","required":true},
            "disabled": {"dataType":"boolean","required":true},
            "bio": {"dataType":"string","required":true},
            "xpPoints": {"dataType":"double","required":true},
            "rewardReceiverAddress": {"dataType":"string","required":true},
            "wallets": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"createdAt":{"dataType":"double","required":true},"linked":{"dataType":"boolean","required":true},"nonce":{"dataType":"string","required":true},"address":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MastersTraitType": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "order": {"dataType":"double","required":true},
            "layers": {"dataType":"array","array":{"dataType":"refObject","ref":"TraitLayer"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TraitLayer": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "order": {"dataType":"double","required":true},
            "layer": {"dataType":"string","required":true},
            "type": {"ref":"MastersTraitType"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TraitGender": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MastersColor": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "color": {"dataType":"string","required":true},
            "typeId": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MastersTrait": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "createdAt": {"dataType":"datetime","default":"2024-12-06T04:30:34.926Z"},
            "updatedAt": {"dataType":"datetime","default":"2024-12-06T04:30:34.926Z"},
            "name": {"dataType":"string","required":true},
            "image": {"dataType":"string","required":true},
            "frontImage": {"dataType":"string"},
            "backImage": {"dataType":"string"},
            "type": {"ref":"MastersTraitType","required":true},
            "gender": {"ref":"TraitGender","required":true},
            "color": {"ref":"MastersColor","required":true},
            "hide": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MastersMintTrait": {
        "dataType": "refObject",
        "properties": {
            "colors": {"dataType":"array","array":{"dataType":"refObject","ref":"MastersColor"},"required":true},
            "traits": {"dataType":"array","array":{"dataType":"refObject","ref":"MastersTrait"},"required":true},
            "type": {"ref":"MastersTraitType","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ItemType": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "layers": {"dataType":"array","array":{"dataType":"refObject","ref":"ItemLayer"},"required":true},
            "categories": {"dataType":"array","array":{"dataType":"refObject","ref":"ItemCategory"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ItemLayer": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "order": {"dataType":"double","required":true},
            "layer": {"dataType":"string","required":true},
            "type": {"ref":"ItemType","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ItemCategory": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"ref":"ItemType","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MastersItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "createdAt": {"dataType":"datetime","default":"2024-12-06T04:30:34.937Z"},
            "updatedAt": {"dataType":"datetime","default":"2024-12-06T04:30:34.937Z"},
            "name": {"dataType":"string","required":true},
            "category": {"ref":"ItemCategory","required":true},
            "gender": {"ref":"TraitGender"},
            "description": {"dataType":"string"},
            "image": {"dataType":"string","required":true},
            "frontImage": {"dataType":"string"},
            "backImage": {"dataType":"string"},
            "maskImage": {"dataType":"string"},
            "rarity": {"dataType":"string"},
            "effects": {"dataType":"string"},
            "storyNotes": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MastersLootboxJoepegsSignature": {
        "dataType": "refObject",
        "properties": {
            "receiver": {"dataType":"string","required":true},
            "tokenIds": {"dataType":"array","array":{"dataType":"double"},"required":true},
            "amounts": {"dataType":"array","array":{"dataType":"double"},"required":true},
            "items": {"dataType":"array","array":{"dataType":"refObject","ref":"MastersItem"},"required":true},
            "nonce": {"dataType":"nestedObjectLiteral","nestedProperties":{"type":{"dataType":"string","required":true},"hex":{"dataType":"string","required":true}},"required":true},
            "signature": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MastersLootbox": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "active": {"dataType":"boolean","required":true},
            "image": {"dataType":"string","required":true},
            "order": {"dataType":"double","required":true},
            "chainId": {"dataType":"double","required":true},
            "gameId": {"dataType":"string"},
            "genderId": {"dataType":"double","required":true},
            "ticketId": {"dataType":"double","required":true},
            "itemWeights": {"dataType":"array","array":{"dataType":"refObject","ref":"MastersLootboxItem"},"required":true},
            "prices": {"dataType":"array","array":{"dataType":"refObject","ref":"LootboxPrice"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MastersLootboxItem": {
        "dataType": "refObject",
        "properties": {
            "weight": {"dataType":"double","required":true},
            "lootbox": {"ref":"MastersLootbox","required":true},
            "item": {"ref":"MastersItem","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LootboxPrice": {
        "dataType": "refObject",
        "properties": {
            "lootbox": {"ref":"MastersLootbox"},
            "currency": {"dataType":"string","required":true},
            "price": {"dataType":"string","required":true},
            "decimals": {"dataType":"double","required":true},
            "address": {"dataType":"string","required":true},
            "image": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MastersLootboxSignature": {
        "dataType": "refObject",
        "properties": {
            "receiver": {"dataType":"string","required":true},
            "tokenIds": {"dataType":"array","array":{"dataType":"double"},"required":true},
            "amounts": {"dataType":"array","array":{"dataType":"double"},"required":true},
            "items": {"dataType":"array","array":{"dataType":"refObject","ref":"MastersItem"},"required":true},
            "nonce": {"dataType":"nestedObjectLiteral","nestedProperties":{"type":{"dataType":"string","required":true},"hex":{"dataType":"string","required":true}},"required":true},
            "claimableUntil": {"dataType":"double","required":true},
            "currency": {"dataType":"string","required":true},
            "price": {"dataType":"string","required":true},
            "decimals": {"dataType":"double","required":true},
            "payWithTicket": {"dataType":"boolean","required":true},
            "ticketId": {"dataType":"double","required":true},
            "signature": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MastersItemBalance": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "createdAt": {"dataType":"datetime","default":"2024-12-06T04:30:34.946Z"},
            "updatedAt": {"dataType":"datetime","default":"2024-12-06T04:30:34.947Z"},
            "name": {"dataType":"string","required":true},
            "category": {"ref":"ItemCategory","required":true},
            "gender": {"ref":"TraitGender"},
            "description": {"dataType":"string"},
            "image": {"dataType":"string","required":true},
            "frontImage": {"dataType":"string"},
            "backImage": {"dataType":"string"},
            "maskImage": {"dataType":"string"},
            "rarity": {"dataType":"string"},
            "effects": {"dataType":"string"},
            "storyNotes": {"dataType":"string"},
            "balance": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MastersAvatar": {
        "dataType": "refObject",
        "properties": {
            "tokenId": {"dataType":"double","required":true},
            "image": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "attributes": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"value":{"dataType":"string","required":true},"trait_type":{"dataType":"string","required":true}}},"required":true},
            "equippedItems": {"dataType":"array","array":{"dataType":"refObject","ref":"MastersItem"},"required":true},
            "traits": {"dataType":"array","array":{"dataType":"refObject","ref":"MastersTrait"},"required":true},
            "layers": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WalletSignatureMessage": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "nonce": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthCustomToken": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "token": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FirebaseFirestore.Timestamp": {
        "dataType": "refObject",
        "properties": {
            "seconds": {"dataType":"double","required":true},
            "nanoseconds": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GameSave": {
        "dataType": "refObject",
        "properties": {
            "uid": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"required":true},
            "gameId": {"dataType":"string","required":true},
            "saveName": {"dataType":"string","required":true},
            "userId": {"dataType":"string","required":true},
            "createdAt": {"ref":"FirebaseFirestore.Timestamp","required":true},
            "updatedAt": {"ref":"FirebaseFirestore.Timestamp","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Game": {
        "dataType": "refObject",
        "properties": {
            "uid": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "requirement": {"dataType":"string","required":true},
            "views": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "deeplink": {"dataType":"string"},
            "description": {"dataType":"string","required":true},
            "previewImage": {"dataType":"string"},
            "images": {"dataType":"array","array":{"dataType":"string"}},
            "downloadLink": {"dataType":"string"},
            "androidLink": {"dataType":"string"},
            "iosLink": {"dataType":"string"},
            "createdAt": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Score": {
        "dataType": "refObject",
        "properties": {
            "gameId": {"dataType":"string","required":true},
            "score": {"dataType":"double","required":true},
            "userId": {"dataType":"string","required":true},
            "username": {"dataType":"string","required":true},
            "createdAt": {"ref":"FirebaseFirestore.Timestamp","required":true},
            "updatedAt": {"ref":"FirebaseFirestore.Timestamp","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Rank": {
        "dataType": "refObject",
        "properties": {
            "gameId": {"dataType":"string","required":true},
            "userId": {"dataType":"string","required":true},
            "rank": {"dataType":"double","required":true},
            "username": {"dataType":"string","required":true},
            "createdAt": {"ref":"FirebaseFirestore.Timestamp","required":true},
            "updatedAt": {"ref":"FirebaseFirestore.Timestamp","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TicketPrice": {
        "dataType": "refObject",
        "properties": {
            "ticket": {"ref":"Ticket"},
            "currency": {"dataType":"string","required":true},
            "price": {"dataType":"string","required":true},
            "decimals": {"dataType":"double","required":true},
            "address": {"dataType":"string","required":true},
            "image": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Ticket": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "image": {"dataType":"string","required":true},
            "prices": {"dataType":"array","array":{"dataType":"refObject","ref":"TicketPrice"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TicketBalance": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "image": {"dataType":"string","required":true},
            "price": {"dataType":"array","array":{"dataType":"refObject","ref":"TicketPrice"},"required":true},
            "balance": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        app.get('/vouchers',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(VouchersController)),
            ...(fetchMiddlewares<RequestHandler>(VouchersController.prototype.getVouchers)),

            async function VouchersController_getVouchers(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new VouchersController();

              await templateService.apiHandler({
                methodName: 'getVouchers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/vouchers/random',
            ...(fetchMiddlewares<RequestHandler>(VouchersController)),
            ...(fetchMiddlewares<RequestHandler>(VouchersController.prototype.getRandomBigNumber)),

            async function VouchersController_getRandomBigNumber(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new VouchersController();

              await templateService.apiHandler({
                methodName: 'getRandomBigNumber',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/vouchers/claim',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(VouchersController)),
            ...(fetchMiddlewares<RequestHandler>(VouchersController.prototype.getVoucherClaimSignature)),

            async function VouchersController_getVoucherClaimSignature(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"address":{"dataType":"string","required":true},"voucherId":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new VouchersController();

              await templateService.apiHandler({
                methodName: 'getVoucherClaimSignature',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/vouchers/:voucherId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(VouchersController)),
            ...(fetchMiddlewares<RequestHandler>(VouchersController.prototype.deleteVoucher)),

            async function VouchersController_deleteVoucher(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    voucherId: {"in":"path","name":"voucherId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new VouchersController();

              await templateService.apiHandler({
                methodName: 'deleteVoucher',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/users',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getUser)),

            async function UsersController_getUser(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/masters/traits',
            ...(fetchMiddlewares<RequestHandler>(TraitsController)),
            ...(fetchMiddlewares<RequestHandler>(TraitsController.prototype.getMastersTraits)),

            async function TraitsController_getMastersTraits(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TraitsController();

              await templateService.apiHandler({
                methodName: 'getMastersTraits',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/masters/traits/types',
            ...(fetchMiddlewares<RequestHandler>(TraitsController)),
            ...(fetchMiddlewares<RequestHandler>(TraitsController.prototype.getMastersTraitTypes)),

            async function TraitsController_getMastersTraitTypes(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TraitsController();

              await templateService.apiHandler({
                methodName: 'getMastersTraitTypes',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/masters/colors',
            ...(fetchMiddlewares<RequestHandler>(MastersController)),
            ...(fetchMiddlewares<RequestHandler>(MastersController.prototype.getMastersColors)),

            async function MastersController_getMastersColors(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
                    typeId: {"in":"query","name":"typeId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MastersController();

              await templateService.apiHandler({
                methodName: 'getMastersColors',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/masters/genders',
            ...(fetchMiddlewares<RequestHandler>(MastersController)),
            ...(fetchMiddlewares<RequestHandler>(MastersController.prototype.getMastersGenders)),

            async function MastersController_getMastersGenders(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MastersController();

              await templateService.apiHandler({
                methodName: 'getMastersGenders',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/masters/equip/signature',
            ...(fetchMiddlewares<RequestHandler>(MastersController)),
            ...(fetchMiddlewares<RequestHandler>(MastersController.prototype.getMastersEquipSignature)),

            async function MastersController_getMastersEquipSignature(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"tokenId":{"dataType":"double","required":true},"owner":{"dataType":"string","required":true},"itemIds":{"dataType":"array","array":{"dataType":"double"},"required":true}}},
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MastersController();

              await templateService.apiHandler({
                methodName: 'getMastersEquipSignature',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/masters/mint/traits',
            ...(fetchMiddlewares<RequestHandler>(MastersController)),
            ...(fetchMiddlewares<RequestHandler>(MastersController.prototype.getMintTraits)),

            async function MastersController_getMintTraits(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MastersController();

              await templateService.apiHandler({
                methodName: 'getMintTraits',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/masters/lootbox/buy',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LootboxesController)),
            ...(fetchMiddlewares<RequestHandler>(LootboxesController.prototype.buyLootbox)),

            async function LootboxesController_buyLootbox(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"body","name":"request","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"saveId":{"dataType":"string","required":true},"currency":{"dataType":"string","required":true},"amount":{"dataType":"double","required":true},"lootboxId":{"dataType":"double","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LootboxesController();

              await templateService.apiHandler({
                methodName: 'buyLootbox',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/masters/lootbox/joepegs',
            ...(fetchMiddlewares<RequestHandler>(LootboxesController)),
            ...(fetchMiddlewares<RequestHandler>(LootboxesController.prototype.getMastersLootboxJPSignature)),

            async function LootboxesController_getMastersLootboxJPSignature(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"body","name":"request","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"receiver":{"dataType":"string","required":true},"amount":{"dataType":"double","required":true},"lootboxId":{"dataType":"double","required":true}}},
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LootboxesController();

              await templateService.apiHandler({
                methodName: 'getMastersLootboxJPSignature',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/masters/lootbox',
            ...(fetchMiddlewares<RequestHandler>(LootboxesController)),
            ...(fetchMiddlewares<RequestHandler>(LootboxesController.prototype.getMastersLootboxes)),

            async function LootboxesController_getMastersLootboxes(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
                    gameId: {"in":"query","name":"gameId","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LootboxesController();

              await templateService.apiHandler({
                methodName: 'getMastersLootboxes',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/masters/lootbox',
            ...(fetchMiddlewares<RequestHandler>(LootboxesController)),
            ...(fetchMiddlewares<RequestHandler>(LootboxesController.prototype.getMastersLootboxSignature)),

            async function LootboxesController_getMastersLootboxSignature(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"body","name":"request","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"payWithTicket":{"dataType":"boolean"},"currency":{"dataType":"string","required":true},"amount":{"dataType":"double","required":true},"receiver":{"dataType":"string","required":true},"lootboxId":{"dataType":"double","required":true}}},
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LootboxesController();

              await templateService.apiHandler({
                methodName: 'getMastersLootboxSignature',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/masters/items/mint',
            ...(fetchMiddlewares<RequestHandler>(ItemsController)),
            ...(fetchMiddlewares<RequestHandler>(ItemsController.prototype.mintMastersItem)),

            async function ItemsController_mintMastersItem(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"amount":{"dataType":"double","required":true},"receiver":{"dataType":"string","required":true},"itemId":{"dataType":"double","required":true},"clientId":{"dataType":"string","required":true},"apiKey":{"dataType":"string","required":true}}},
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ItemsController();

              await templateService.apiHandler({
                methodName: 'mintMastersItem',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/masters/items/categories',
            ...(fetchMiddlewares<RequestHandler>(ItemsController)),
            ...(fetchMiddlewares<RequestHandler>(ItemsController.prototype.getMastersItemCategories)),

            async function ItemsController_getMastersItemCategories(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ItemsController();

              await templateService.apiHandler({
                methodName: 'getMastersItemCategories',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/masters/items/balance/:address',
            ...(fetchMiddlewares<RequestHandler>(ItemsController)),
            ...(fetchMiddlewares<RequestHandler>(ItemsController.prototype.getMastersItemsBalance)),

            async function ItemsController_getMastersItemsBalance(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
                    includeSubnet: {"in":"query","name":"includeSubnet","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ItemsController();

              await templateService.apiHandler({
                methodName: 'getMastersItemsBalance',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/masters/items/:tokenId',
            ...(fetchMiddlewares<RequestHandler>(ItemsController)),
            ...(fetchMiddlewares<RequestHandler>(ItemsController.prototype.getMastersItem)),

            async function ItemsController_getMastersItem(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    tokenId: {"in":"path","name":"tokenId","required":true,"dataType":"string"},
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ItemsController();

              await templateService.apiHandler({
                methodName: 'getMastersItem',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/masters/items',
            ...(fetchMiddlewares<RequestHandler>(ItemsController)),
            ...(fetchMiddlewares<RequestHandler>(ItemsController.prototype.getMastersItems)),

            async function ItemsController_getMastersItems(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ItemsController();

              await templateService.apiHandler({
                methodName: 'getMastersItems',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/masters/avatars/image/:tokenId',
            ...(fetchMiddlewares<RequestHandler>(AvatarsController)),
            ...(fetchMiddlewares<RequestHandler>(AvatarsController.prototype.updateImage)),

            async function AvatarsController_updateImage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    tokenId: {"in":"path","name":"tokenId","required":true,"dataType":"double"},
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
                    extension: {"in":"query","name":"extension","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AvatarsController();

              await templateService.apiHandler({
                methodName: 'updateImage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/masters/avatars/image-upload-url/:tokenId',
            ...(fetchMiddlewares<RequestHandler>(AvatarsController)),
            ...(fetchMiddlewares<RequestHandler>(AvatarsController.prototype.getMastersPFPImageUploadURL)),

            async function AvatarsController_getMastersPFPImageUploadURL(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    tokenId: {"in":"path","name":"tokenId","required":true,"dataType":"double"},
                    extension: {"in":"query","name":"extension","dataType":"string"},
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
                    authorization: {"in":"header","name":"Authorization","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AvatarsController();

              await templateService.apiHandler({
                methodName: 'getMastersPFPImageUploadURL',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/masters/avatars/images/:address',
            ...(fetchMiddlewares<RequestHandler>(AvatarsController)),
            ...(fetchMiddlewares<RequestHandler>(AvatarsController.prototype.getMastersAvatarImage)),

            async function AvatarsController_getMastersAvatarImage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AvatarsController();

              await templateService.apiHandler({
                methodName: 'getMastersAvatarImage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/masters/avatars/balance/:address',
            ...(fetchMiddlewares<RequestHandler>(AvatarsController)),
            ...(fetchMiddlewares<RequestHandler>(AvatarsController.prototype.getMastersAvatarBalance)),

            async function AvatarsController_getMastersAvatarBalance(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AvatarsController();

              await templateService.apiHandler({
                methodName: 'getMastersAvatarBalance',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/masters/avatars/prices',
            ...(fetchMiddlewares<RequestHandler>(AvatarsController)),
            ...(fetchMiddlewares<RequestHandler>(AvatarsController.prototype.getMastersAvatarPrices)),

            async function AvatarsController_getMastersAvatarPrices(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AvatarsController();

              await templateService.apiHandler({
                methodName: 'getMastersAvatarPrices',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/masters/avatars/free',
            ...(fetchMiddlewares<RequestHandler>(AvatarsController)),
            ...(fetchMiddlewares<RequestHandler>(AvatarsController.prototype.getMastersFreePFPSignature)),

            async function AvatarsController_getMastersFreePFPSignature(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"traits":{"dataType":"array","array":{"dataType":"double"},"required":true},"receiver":{"dataType":"string"}}},
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AvatarsController();

              await templateService.apiHandler({
                methodName: 'getMastersFreePFPSignature',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/masters/avatars/:tokenId',
            ...(fetchMiddlewares<RequestHandler>(AvatarsController)),
            ...(fetchMiddlewares<RequestHandler>(AvatarsController.prototype.getMastersAvatar)),

            async function AvatarsController_getMastersAvatar(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    tokenId: {"in":"path","name":"tokenId","required":true,"dataType":"string"},
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AvatarsController();

              await templateService.apiHandler({
                methodName: 'getMastersAvatar',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/masters/avatars',
            ...(fetchMiddlewares<RequestHandler>(AvatarsController)),
            ...(fetchMiddlewares<RequestHandler>(AvatarsController.prototype.getMastersPFPSignature)),

            async function AvatarsController_getMastersPFPSignature(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"payWithTicket":{"dataType":"boolean","required":true},"currency":{"dataType":"string","required":true},"traits":{"dataType":"array","array":{"dataType":"double"},"required":true},"receiver":{"dataType":"string"}}},
                    chainId: {"in":"query","name":"chainId","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AvatarsController();

              await templateService.apiHandler({
                methodName: 'getMastersPFPSignature',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/link/wallet',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LinkController)),
            ...(fetchMiddlewares<RequestHandler>(LinkController.prototype.getWalletLinkMessage)),

            async function LinkController_getWalletLinkMessage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    address: {"in":"query","name":"address","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LinkController();

              await templateService.apiHandler({
                methodName: 'getWalletLinkMessage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/link/wallet',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LinkController)),
            ...(fetchMiddlewares<RequestHandler>(LinkController.prototype.postWalletLinkSignature)),

            async function LinkController_postWalletLinkSignature(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    request: {"in":"body","name":"request","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"signature":{"dataType":"string","required":true},"address":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LinkController();

              await templateService.apiHandler({
                methodName: 'postWalletLinkSignature',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/games/saves/:saveId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController)),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController.prototype.deleteGameSave)),

            async function GameSavesController_deleteGameSave(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    saveId: {"in":"path","name":"saveId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new GameSavesController();

              await templateService.apiHandler({
                methodName: 'deleteGameSave',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/games/saves/:saveId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController)),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController.prototype.updateGameSave)),

            async function GameSavesController_updateGameSave(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    saveId: {"in":"path","name":"saveId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new GameSavesController();

              await templateService.apiHandler({
                methodName: 'updateGameSave',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/games/saves/:saveId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController)),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController.prototype.getGameSave)),

            async function GameSavesController_getGameSave(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    saveId: {"in":"path","name":"saveId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new GameSavesController();

              await templateService.apiHandler({
                methodName: 'getGameSave',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/games/saves',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController)),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController.prototype.createGameSave)),

            async function GameSavesController_createGameSave(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"saveName":{"dataType":"string"},"data":{"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"required":true},"gameId":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new GameSavesController();

              await templateService.apiHandler({
                methodName: 'createGameSave',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/games/saves',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController)),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController.prototype.getAllGameSaves)),

            async function GameSavesController_getAllGameSaves(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new GameSavesController();

              await templateService.apiHandler({
                methodName: 'getAllGameSaves',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/games',
            ...(fetchMiddlewares<RequestHandler>(GameController)),
            ...(fetchMiddlewares<RequestHandler>(GameController.prototype.getGame)),

            async function GameController_getGame(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"query","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new GameController();

              await templateService.apiHandler({
                methodName: 'getGame',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/leaderboard/scores',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.addScore)),

            async function LeaderboardController_addScore(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"clientId":{"dataType":"string"},"apiKey":{"dataType":"string"},"score":{"dataType":"double","required":true},"gameId":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LeaderboardController();

              await templateService.apiHandler({
                methodName: 'addScore',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/leaderboard/scores/:gameId',
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.getScoreLeaderboard)),

            async function LeaderboardController_getScoreLeaderboard(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    gameId: {"in":"path","name":"gameId","required":true,"dataType":"string"},
                    limit: {"in":"query","name":"limit","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LeaderboardController();

              await templateService.apiHandler({
                methodName: 'getScoreLeaderboard',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/leaderboard/scores/:gameId/me',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.getUserScore)),

            async function LeaderboardController_getUserScore(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    gameId: {"in":"path","name":"gameId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LeaderboardController();

              await templateService.apiHandler({
                methodName: 'getUserScore',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/leaderboard/rank',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.updateRank)),

            async function LeaderboardController_updateRank(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"clientId":{"dataType":"string"},"apiKey":{"dataType":"string"},"rank":{"dataType":"double","required":true},"gameId":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LeaderboardController();

              await templateService.apiHandler({
                methodName: 'updateRank',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/leaderboard/rank/:gameId',
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.getRankLeaderboard)),

            async function LeaderboardController_getRankLeaderboard(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    gameId: {"in":"path","name":"gameId","required":true,"dataType":"string"},
                    limit: {"in":"query","name":"limit","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LeaderboardController();

              await templateService.apiHandler({
                methodName: 'getRankLeaderboard',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/leaderboard/rank/:gameId/me',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.getUserRank)),

            async function LeaderboardController_getUserRank(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    gameId: {"in":"path","name":"gameId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LeaderboardController();

              await templateService.apiHandler({
                methodName: 'getUserRank',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/auth/wallet',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.getWalletAuthMessage)),

            async function AuthController_getWalletAuthMessage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"query","name":"address","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'getWalletAuthMessage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/auth/wallet',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.postWalletAuthSignature)),

            async function AuthController_postWalletAuthSignature(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"body","name":"request","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"signature":{"dataType":"string","required":true},"address":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'postWalletAuthSignature',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/auth/users',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.createUser)),

            async function AuthController_createUser(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'createUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/gen2/sale-signature',
            ...(fetchMiddlewares<RequestHandler>(Gen2Controller)),
            ...(fetchMiddlewares<RequestHandler>(Gen2Controller.prototype.getGen2SaleSignature)),

            async function Gen2Controller_getGen2SaleSignature(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"referral":{"dataType":"string","required":true},"amount":{"dataType":"double","required":true},"eggType":{"dataType":"double","required":true},"receiver":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new Gen2Controller();

              await templateService.apiHandler({
                methodName: 'getGen2SaleSignature',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/gen2/price',
            ...(fetchMiddlewares<RequestHandler>(Gen2Controller)),
            ...(fetchMiddlewares<RequestHandler>(Gen2Controller.prototype.getGen2SalePrice)),

            async function Gen2Controller_getGen2SalePrice(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new Gen2Controller();

              await templateService.apiHandler({
                methodName: 'getGen2SalePrice',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/tickets/metadata',
            ...(fetchMiddlewares<RequestHandler>(TicketsController)),
            ...(fetchMiddlewares<RequestHandler>(TicketsController.prototype.getTicketsMetadata)),

            async function TicketsController_getTicketsMetadata(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TicketsController();

              await templateService.apiHandler({
                methodName: 'getTicketsMetadata',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/tickets/balance/:address',
            ...(fetchMiddlewares<RequestHandler>(TicketsController)),
            ...(fetchMiddlewares<RequestHandler>(TicketsController.prototype.getTicketsBalance)),

            async function TicketsController_getTicketsBalance(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    chainId: {"in":"query","name":"chainId","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TicketsController();

              await templateService.apiHandler({
                methodName: 'getTicketsBalance',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/tickets',
            ...(fetchMiddlewares<RequestHandler>(TicketsController)),
            ...(fetchMiddlewares<RequestHandler>(TicketsController.prototype.getTickets)),

            async function TicketsController_getTickets(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    chainId: {"in":"query","name":"chainId","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TicketsController();

              await templateService.apiHandler({
                methodName: 'getTickets',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/tickets/:id',
            ...(fetchMiddlewares<RequestHandler>(TicketsController)),
            ...(fetchMiddlewares<RequestHandler>(TicketsController.prototype.getTicket)),

            async function TicketsController_getTicket(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    chainId: {"in":"query","name":"chainId","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TicketsController();

              await templateService.apiHandler({
                methodName: 'getTicket',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
