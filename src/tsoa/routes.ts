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
import { UltigenController } from './../modules/ultigen/ultigen-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LeaderboardController } from './../modules/leaderboard/leaderboard-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Gen2Controller } from './../modules/gen2/gen2-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GameSavesController } from './../modules/games/game-saves-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GameController } from './../modules/games/game-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ContractsController } from './../modules/contracts/contracts-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../modules/auth/authController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AssetsController } from './../modules/assets/assets-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ApiKeysController } from './../modules/api-keys/api-keys-controller';
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
            "holder": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["blockchain"]},{"dataType":"enum","enums":["game"]}],"required":true},
            "userId": {"dataType":"string","required":true},
            "image": {"dataType":"string"},
            "receiver": {"dataType":"string"},
            "tokenId": {"dataType":"string"},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
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
            "tokenId": {"dataType":"string"},
            "eggType": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BatchVoucherClaimSignature": {
        "dataType": "refObject",
        "properties": {
            "rewardContractType": {"dataType":"double","required":true},
            "rewardHolderAddress": {"dataType":"string","required":true},
            "rewardContract": {"dataType":"string","required":true},
            "receiver": {"dataType":"string","required":true},
            "tokenIds": {"dataType":"array","array":{"dataType":"string"}},
            "amounts": {"dataType":"array","array":{"dataType":"double"},"required":true},
            "claimableUntil": {"dataType":"double","required":true},
            "voucherIds": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "signature": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepositSignature": {
        "dataType": "refObject",
        "properties": {
            "payload": {"dataType":"array","array":{"dataType":"any"},"required":true},
            "signature": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "User": {
        "dataType": "refObject",
        "properties": {
            "uid": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "referralCode": {"dataType":"string","required":true},
            "referralCount": {"dataType":"double","required":true},
            "referrerId": {"dataType":"string"},
            "displayName": {"dataType":"string"},
            "picture": {"dataType":"string"},
            "photoUrl": {"dataType":"string"},
            "disabled": {"dataType":"boolean"},
            "roles": {"dataType":"array","array":{"dataType":"string"}},
            "bio": {"dataType":"string"},
            "xpPoints": {"dataType":"double"},
            "mainWallet": {"dataType":"string"},
            "internalWallet": {"dataType":"string","required":true},
            "vouchersMerged": {"dataType":"boolean"},
            "discordConfirmed": {"dataType":"boolean"},
            "discordId": {"dataType":"string"},
            "discordUsername": {"dataType":"string"},
            "wallets": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"createdAt":{"dataType":"double","required":true},"linked":{"dataType":"boolean","required":true},"nonce":{"dataType":"string","required":true},"address":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Wallet": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "address": {"dataType":"string","required":true},
            "mainWallet": {"dataType":"boolean"},
            "privateKey": {"dataType":"string"},
            "publicKey": {"dataType":"string"},
            "seedPhrase": {"dataType":"string"},
            "isInternalWallet": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UltigenMonster": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "element": {"dataType":"string","required":true},
            "image": {"dataType":"string","required":true},
            "monsterId": {"dataType":"double","required":true},
            "level": {"dataType":"double","required":true},
            "stage": {"dataType":"double","required":true},
            "xp": {"dataType":"double","required":true},
            "skills": {"dataType":"array","array":{"dataType":"any"},"required":true},
            "walkSpeed": {"dataType":"double","required":true},
            "attackDamage": {"dataType":"double","required":true},
            "aspd": {"dataType":"double","required":true},
            "health": {"dataType":"double","required":true},
            "behavior": {"dataType":"string","required":true},
            "dps": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UltigenEggsBalance": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "element": {"dataType":"string","required":true},
            "image": {"dataType":"string","required":true},
            "amount": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ScoreItem": {
        "dataType": "refObject",
        "properties": {
            "gameId": {"dataType":"string","required":true},
            "score": {"dataType":"double","required":true},
            "userId": {"dataType":"string","required":true},
            "username": {"dataType":"string","required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RankItem": {
        "dataType": "refObject",
        "properties": {
            "gameId": {"dataType":"string","required":true},
            "userId": {"dataType":"string","required":true},
            "rank": {"dataType":"double","required":true},
            "username": {"dataType":"string","required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HatchyBalance": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "element": {"dataType":"string","required":true},
            "image": {"dataType":"string","required":true},
            "commonAmount": {"dataType":"double","required":true},
            "shinyAmount": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GameSave": {
        "dataType": "refObject",
        "properties": {
            "uid": {"dataType":"string","required":true},
            "gameId": {"dataType":"string","required":true},
            "saveName": {"dataType":"string","required":true},
            "userId": {"dataType":"string","required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": {"dataType":"any"},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Game": {
        "dataType": "refObject",
        "properties": {
            "uid": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "itchioEmbedLink": {"dataType":"string"},
            "itchioLink": {"dataType":"string"},
            "status": {"dataType":"string"},
            "requirement": {"dataType":"string"},
            "views": {"dataType":"double"},
            "slug": {"dataType":"string"},
            "deeplink": {"dataType":"string"},
            "previewImage": {"dataType":"string"},
            "images": {"dataType":"array","array":{"dataType":"string"}},
            "downloadLink": {"dataType":"string"},
            "androidLink": {"dataType":"string"},
            "iosLink": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Contract": {
        "dataType": "refObject",
        "properties": {
            "uid": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "address": {"dataType":"string","required":true},
            "chainId": {"dataType":"double","required":true},
            "link": {"dataType":"string","required":true},
            "contractType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ERC721"]},{"dataType":"enum","enums":["ERC1155"]},{"dataType":"enum","enums":["ERC20"]},{"dataType":"enum","enums":["Other"]}]},
            "deployDate": {"dataType":"string","required":true},
            "owner": {"dataType":"string","required":true},
            "verified": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Contract.Exclude_keyofContract.uid-or-owner__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"description":{"dataType":"string"},"address":{"dataType":"string","required":true},"chainId":{"dataType":"double","required":true},"link":{"dataType":"string","required":true},"contractType":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ERC721"]},{"dataType":"enum","enums":["ERC1155"]},{"dataType":"enum","enums":["ERC20"]},{"dataType":"enum","enums":["Other"]}]},"deployDate":{"dataType":"string","required":true},"verified":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Contract.uid-or-owner_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Contract.Exclude_keyofContract.uid-or-owner__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateContractParams": {
        "dataType": "refAlias",
        "type": {"ref":"Omit_Contract.uid-or-owner_","validators":{}},
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
    "AssetAgreement": {
        "dataType": "refObject",
        "properties": {
            "uid": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "role": {"dataType":"string","required":true},
            "accepted": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Asset": {
        "dataType": "refObject",
        "properties": {
            "uid": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "category": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "contract": {"dataType":"string"},
            "holder": {"dataType":"string"},
            "contractType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ERC721"]},{"dataType":"enum","enums":["ERC1155"]},{"dataType":"enum","enums":["ERC20"]}]},
            "tokenId": {"dataType":"string"},
            "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["blockchain"]},{"dataType":"enum","enums":["game"]}]},
            "property": {"dataType":"string"},
            "image": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Asset.Exclude_keyofAsset.uid__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"description":{"dataType":"string"},"contractType":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ERC721"]},{"dataType":"enum","enums":["ERC1155"]},{"dataType":"enum","enums":["ERC20"]}]},"category":{"dataType":"string","required":true},"contract":{"dataType":"string"},"holder":{"dataType":"string"},"tokenId":{"dataType":"string"},"type":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["blockchain"]},{"dataType":"enum","enums":["game"]}]},"property":{"dataType":"string"},"image":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Asset.uid_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Asset.Exclude_keyofAsset.uid__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateAssetParams": {
        "dataType": "refAlias",
        "type": {"ref":"Omit_Asset.uid_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiKey": {
        "dataType": "refObject",
        "properties": {
            "uid": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "apiKey": {"dataType":"string","required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
            "permissions": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "appId": {"dataType":"string"},
            "balance": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"double"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_ApiKey.Exclude_keyofApiKey.uid-or-createdAt-or-updatedAt-or-apiKey__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"permissions":{"dataType":"array","array":{"dataType":"string"},"required":true},"appId":{"dataType":"string"},"balance":{"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"double"},"required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_ApiKey.uid-or-createdAt-or-updatedAt-or-apiKey_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_ApiKey.Exclude_keyofApiKey.uid-or-createdAt-or-updatedAt-or-apiKey__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateApiKeyParams": {
        "dataType": "refAlias",
        "type": {"ref":"Omit_ApiKey.uid-or-createdAt-or-updatedAt-or-apiKey_","validators":{}},
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


    
        const argsVouchersController_getVouchers: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/vouchers',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(VouchersController)),
            ...(fetchMiddlewares<RequestHandler>(VouchersController.prototype.getVouchers)),

            async function VouchersController_getVouchers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVouchersController_getVouchers, request, response });

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
        const argsVouchersController_getRandomBigNumber: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/vouchers/random',
            ...(fetchMiddlewares<RequestHandler>(VouchersController)),
            ...(fetchMiddlewares<RequestHandler>(VouchersController.prototype.getRandomBigNumber)),

            async function VouchersController_getRandomBigNumber(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVouchersController_getRandomBigNumber, request, response });

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
        const argsVouchersController_giveVoucherToUser: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"overrideTokenId":{"dataType":"string"},"amount":{"dataType":"double","required":true},"assetId":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}}},
        };
        app.post('/vouchers/admin/give',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(VouchersController)),
            ...(fetchMiddlewares<RequestHandler>(VouchersController.prototype.giveVoucherToUser)),

            async function VouchersController_giveVoucherToUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVouchersController_giveVoucherToUser, request, response });

                const controller = new VouchersController();

              await templateService.apiHandler({
                methodName: 'giveVoucherToUser',
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
        const argsVouchersController_giveVoucherWithApiKey: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"amount":{"dataType":"double","required":true},"assetId":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}}},
        };
        app.post('/vouchers/apikey/give',
            authenticateMiddleware([{"api_key_rewards":[]}]),
            ...(fetchMiddlewares<RequestHandler>(VouchersController)),
            ...(fetchMiddlewares<RequestHandler>(VouchersController.prototype.giveVoucherWithApiKey)),

            async function VouchersController_giveVoucherWithApiKey(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVouchersController_giveVoucherWithApiKey, request, response });

                const controller = new VouchersController();

              await templateService.apiHandler({
                methodName: 'giveVoucherWithApiKey',
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
        const argsVouchersController_transferVouchers: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"receiverEmail":{"dataType":"string","required":true},"voucherAmounts":{"dataType":"array","array":{"dataType":"double"},"required":true},"voucherIds":{"dataType":"array","array":{"dataType":"string"},"required":true}}},
        };
        app.post('/vouchers/transfer',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(VouchersController)),
            ...(fetchMiddlewares<RequestHandler>(VouchersController.prototype.transferVouchers)),

            async function VouchersController_transferVouchers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVouchersController_transferVouchers, request, response });

                const controller = new VouchersController();

              await templateService.apiHandler({
                methodName: 'transferVouchers',
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
        const argsVouchersController_getVoucherClaimSignature: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"address":{"dataType":"string","required":true},"voucherId":{"dataType":"string","required":true}}},
        };
        app.post('/vouchers/claim',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(VouchersController)),
            ...(fetchMiddlewares<RequestHandler>(VouchersController.prototype.getVoucherClaimSignature)),

            async function VouchersController_getVoucherClaimSignature(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVouchersController_getVoucherClaimSignature, request, response });

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
        const argsVouchersController_getBatchVoucherClaimSignature: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"address":{"dataType":"string","required":true},"voucherIds":{"dataType":"array","array":{"dataType":"string"},"required":true}}},
        };
        app.post('/vouchers/claim/batch',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(VouchersController)),
            ...(fetchMiddlewares<RequestHandler>(VouchersController.prototype.getBatchVoucherClaimSignature)),

            async function VouchersController_getBatchVoucherClaimSignature(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVouchersController_getBatchVoucherClaimSignature, request, response });

                const controller = new VouchersController();

              await templateService.apiHandler({
                methodName: 'getBatchVoucherClaimSignature',
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
        const argsVouchersController_deleteBatchVouchers: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"voucherIds":{"dataType":"array","array":{"dataType":"string"},"required":true}}},
        };
        app.delete('/vouchers/batch',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(VouchersController)),
            ...(fetchMiddlewares<RequestHandler>(VouchersController.prototype.deleteBatchVouchers)),

            async function VouchersController_deleteBatchVouchers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVouchersController_deleteBatchVouchers, request, response });

                const controller = new VouchersController();

              await templateService.apiHandler({
                methodName: 'deleteBatchVouchers',
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
        const argsVouchersController_getDepositSignature: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"amount":{"dataType":"double"},"amounts":{"dataType":"array","array":{"dataType":"double"}},"tokenIds":{"dataType":"array","array":{"dataType":"double"}},"assetAddress":{"dataType":"string","required":true},"assetType":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ERC20"]},{"dataType":"enum","enums":["ERC1155"]},{"dataType":"enum","enums":["ERC721"]}],"required":true},"receiver":{"dataType":"string","required":true}}},
        };
        app.post('/vouchers/deposit/signature',
            ...(fetchMiddlewares<RequestHandler>(VouchersController)),
            ...(fetchMiddlewares<RequestHandler>(VouchersController.prototype.getDepositSignature)),

            async function VouchersController_getDepositSignature(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVouchersController_getDepositSignature, request, response });

                const controller = new VouchersController();

              await templateService.apiHandler({
                methodName: 'getDepositSignature',
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
        const argsUsersController_getUser: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/users',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getUser)),

            async function UsersController_getUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getUser, request, response });

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
        const argsUsersController_updateUser: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"referralCode":{"dataType":"string"},"bio":{"dataType":"string"},"displayName":{"dataType":"string"}}},
        };
        app.put('/users',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.updateUser)),

            async function UsersController_updateUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_updateUser, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'updateUser',
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
        const argsUsersController_deleteAccount: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.delete('/users',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.deleteAccount)),

            async function UsersController_deleteAccount(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_deleteAccount, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'deleteAccount',
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
        const argsUsersController_getLinkedWallets: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/users/wallets',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getLinkedWallets)),

            async function UsersController_getLinkedWallets(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getLinkedWallets, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getLinkedWallets',
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
        const argsUsersController_setMainWallet: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"mainWallet":{"dataType":"string","required":true}}},
        };
        app.post('/users/main-wallet',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.setMainWallet)),

            async function UsersController_setMainWallet(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_setMainWallet, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'setMainWallet',
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
        const argsUsersController_createWallet: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/users/wallets/create',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.createWallet)),

            async function UsersController_createWallet(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_createWallet, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'createWallet',
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
        const argsUsersController_searchUsers: Record<string, TsoaRoute.ParameterSchema> = {
                query: {"in":"query","name":"query","required":true,"dataType":"string"},
        };
        app.get('/users/search',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.searchUsers)),

            async function UsersController_searchUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_searchUsers, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'searchUsers',
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
        const argsUltigenController_getUltigenMonstersBalance: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/ultigen/monsters/balance',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UltigenController)),
            ...(fetchMiddlewares<RequestHandler>(UltigenController.prototype.getUltigenMonstersBalance)),

            async function UltigenController_getUltigenMonstersBalance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUltigenController_getUltigenMonstersBalance, request, response });

                const controller = new UltigenController();

              await templateService.apiHandler({
                methodName: 'getUltigenMonstersBalance',
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
        const argsUltigenController_getUltigenEggsBalance: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/ultigen/eggs/balance',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UltigenController)),
            ...(fetchMiddlewares<RequestHandler>(UltigenController.prototype.getUltigenEggsBalance)),

            async function UltigenController_getUltigenEggsBalance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUltigenController_getUltigenEggsBalance, request, response });

                const controller = new UltigenController();

              await templateService.apiHandler({
                methodName: 'getUltigenEggsBalance',
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
        const argsUltigenController_hatchEggs: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"amount":{"dataType":"double","required":true},"eggType":{"dataType":"double","required":true}}},
        };
        app.post('/ultigen/eggs/hatch',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UltigenController)),
            ...(fetchMiddlewares<RequestHandler>(UltigenController.prototype.hatchEggs)),

            async function UltigenController_hatchEggs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUltigenController_hatchEggs, request, response });

                const controller = new UltigenController();

              await templateService.apiHandler({
                methodName: 'hatchEggs',
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
        const argsUltigenController_buyEggs: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"amount":{"dataType":"double","required":true},"eggType":{"dataType":"double","required":true}}},
        };
        app.post('/ultigen/eggs/buy',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UltigenController)),
            ...(fetchMiddlewares<RequestHandler>(UltigenController.prototype.buyEggs)),

            async function UltigenController_buyEggs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUltigenController_buyEggs, request, response });

                const controller = new UltigenController();

              await templateService.apiHandler({
                methodName: 'buyEggs',
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
        const argsUltigenController_giveEggWithApiKey: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"amount":{"dataType":"double","required":true},"eggType":{"dataType":"double","required":true},"email":{"dataType":"string","required":true}}},
        };
        app.post('/ultigen/eggs/give',
            authenticateMiddleware([{"api_key_rewards":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UltigenController)),
            ...(fetchMiddlewares<RequestHandler>(UltigenController.prototype.giveEggWithApiKey)),

            async function UltigenController_giveEggWithApiKey(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUltigenController_giveEggWithApiKey, request, response });

                const controller = new UltigenController();

              await templateService.apiHandler({
                methodName: 'giveEggWithApiKey',
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
        const argsUltigenController_evolveMonster: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"newMonsterId":{"dataType":"double","required":true},"id":{"dataType":"double","required":true}}},
        };
        app.post('/ultigen/monsters/evolve',
            authenticateMiddleware([{"api_key_ultigen_xp":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UltigenController)),
            ...(fetchMiddlewares<RequestHandler>(UltigenController.prototype.evolveMonster)),

            async function UltigenController_evolveMonster(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUltigenController_evolveMonster, request, response });

                const controller = new UltigenController();

              await templateService.apiHandler({
                methodName: 'evolveMonster',
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
        const argsUltigenController_giveXPToMonster: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"xp":{"dataType":"double","required":true},"id":{"dataType":"double","required":true}}},
        };
        app.post('/ultigen/monsters/xp',
            authenticateMiddleware([{"api_key_ultigen_xp":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UltigenController)),
            ...(fetchMiddlewares<RequestHandler>(UltigenController.prototype.giveXPToMonster)),

            async function UltigenController_giveXPToMonster(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUltigenController_giveXPToMonster, request, response });

                const controller = new UltigenController();

              await templateService.apiHandler({
                methodName: 'giveXPToMonster',
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
        const argsUltigenController_getMonsterData: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/ultigen/monsters/:id',
            ...(fetchMiddlewares<RequestHandler>(UltigenController)),
            ...(fetchMiddlewares<RequestHandler>(UltigenController.prototype.getMonsterData)),

            async function UltigenController_getMonsterData(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUltigenController_getMonsterData, request, response });

                const controller = new UltigenController();

              await templateService.apiHandler({
                methodName: 'getMonsterData',
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
        const argsLeaderboardController_addScore: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true},"score":{"dataType":"double","required":true},"appId":{"dataType":"string","required":true}}},
        };
        app.post('/leaderboard/scores',
            authenticateMiddleware([{"api_key_scores":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.addScore)),

            async function LeaderboardController_addScore(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLeaderboardController_addScore, request, response });

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
        const argsLeaderboardController_getScoreLeaderboard: Record<string, TsoaRoute.ParameterSchema> = {
                gameId: {"in":"path","name":"gameId","required":true,"dataType":"string"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/leaderboard/scores/:gameId',
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.getScoreLeaderboard)),

            async function LeaderboardController_getScoreLeaderboard(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLeaderboardController_getScoreLeaderboard, request, response });

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
        const argsLeaderboardController_getUserScore: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                gameId: {"in":"path","name":"gameId","required":true,"dataType":"string"},
        };
        app.get('/leaderboard/scores/:gameId/me',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.getUserScore)),

            async function LeaderboardController_getUserScore(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLeaderboardController_getUserScore, request, response });

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
        const argsLeaderboardController_updateRank: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"userId":{"dataType":"string","required":true},"rank":{"dataType":"double","required":true},"appId":{"dataType":"string","required":true}}},
        };
        app.post('/leaderboard/rank',
            authenticateMiddleware([{"api_key_rank":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.updateRank)),

            async function LeaderboardController_updateRank(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLeaderboardController_updateRank, request, response });

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
        const argsLeaderboardController_getRankLeaderboard: Record<string, TsoaRoute.ParameterSchema> = {
                appId: {"in":"path","name":"appId","required":true,"dataType":"string"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/leaderboard/rank/:appId',
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.getRankLeaderboard)),

            async function LeaderboardController_getRankLeaderboard(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLeaderboardController_getRankLeaderboard, request, response });

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
        const argsLeaderboardController_getUserRank: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                gameId: {"in":"path","name":"gameId","required":true,"dataType":"string"},
        };
        app.get('/leaderboard/rank/:gameId/me',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.getUserRank)),

            async function LeaderboardController_getUserRank(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLeaderboardController_getUserRank, request, response });

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
        const argsGen2Controller_getGen2SaleSignature: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"referral":{"dataType":"string","required":true},"amount":{"dataType":"double","required":true},"eggType":{"dataType":"double","required":true},"receiver":{"dataType":"string","required":true}}},
        };
        app.post('/gen2/sale-signature',
            ...(fetchMiddlewares<RequestHandler>(Gen2Controller)),
            ...(fetchMiddlewares<RequestHandler>(Gen2Controller.prototype.getGen2SaleSignature)),

            async function Gen2Controller_getGen2SaleSignature(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGen2Controller_getGen2SaleSignature, request, response });

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
        const argsGen2Controller_getGen2SalePrice: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/gen2/price',
            ...(fetchMiddlewares<RequestHandler>(Gen2Controller)),
            ...(fetchMiddlewares<RequestHandler>(Gen2Controller.prototype.getGen2SalePrice)),

            async function Gen2Controller_getGen2SalePrice(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGen2Controller_getGen2SalePrice, request, response });

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
        const argsGen2Controller_getGen2Balance: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/gen2/balance',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(Gen2Controller)),
            ...(fetchMiddlewares<RequestHandler>(Gen2Controller.prototype.getGen2Balance)),

            async function Gen2Controller_getGen2Balance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGen2Controller_getGen2Balance, request, response });

                const controller = new Gen2Controller();

              await templateService.apiHandler({
                methodName: 'getGen2Balance',
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
        const argsGameSavesController_deleteGameSave: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                saveId: {"in":"path","name":"saveId","required":true,"dataType":"string"},
        };
        app.delete('/games/saves/:saveId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController)),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController.prototype.deleteGameSave)),

            async function GameSavesController_deleteGameSave(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGameSavesController_deleteGameSave, request, response });

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
        const argsGameSavesController_updateGameSave: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                saveId: {"in":"path","name":"saveId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"required":true}}},
        };
        app.put('/games/saves/:saveId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController)),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController.prototype.updateGameSave)),

            async function GameSavesController_updateGameSave(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGameSavesController_updateGameSave, request, response });

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
        const argsGameSavesController_getGameSave: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                saveId: {"in":"path","name":"saveId","required":true,"dataType":"string"},
        };
        app.get('/games/saves/:saveId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController)),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController.prototype.getGameSave)),

            async function GameSavesController_getGameSave(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGameSavesController_getGameSave, request, response });

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
        const argsGameSavesController_createGameSave: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"saveName":{"dataType":"string"},"data":{"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"required":true},"gameId":{"dataType":"string","required":true}}},
        };
        app.post('/games/saves',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController)),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController.prototype.createGameSave)),

            async function GameSavesController_createGameSave(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGameSavesController_createGameSave, request, response });

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
        const argsGameSavesController_getAllGameSaves: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                gameId: {"in":"query","name":"gameId","dataType":"string"},
        };
        app.get('/games/saves',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController)),
            ...(fetchMiddlewares<RequestHandler>(GameSavesController.prototype.getAllGameSaves)),

            async function GameSavesController_getAllGameSaves(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGameSavesController_getAllGameSaves, request, response });

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
        const argsGameController_getGame: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"query","name":"id","required":true,"dataType":"string"},
        };
        app.get('/games',
            ...(fetchMiddlewares<RequestHandler>(GameController)),
            ...(fetchMiddlewares<RequestHandler>(GameController.prototype.getGame)),

            async function GameController_getGame(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGameController_getGame, request, response });

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
        const argsGameController_getGames: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/games/list',
            ...(fetchMiddlewares<RequestHandler>(GameController)),
            ...(fetchMiddlewares<RequestHandler>(GameController.prototype.getGames)),

            async function GameController_getGames(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGameController_getGames, request, response });

                const controller = new GameController();

              await templateService.apiHandler({
                methodName: 'getGames',
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
        const argsContractsController_getContracts: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/contracts',
            ...(fetchMiddlewares<RequestHandler>(ContractsController)),
            ...(fetchMiddlewares<RequestHandler>(ContractsController.prototype.getContracts)),

            async function ContractsController_getContracts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsContractsController_getContracts, request, response });

                const controller = new ContractsController();

              await templateService.apiHandler({
                methodName: 'getContracts',
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
        const argsContractsController_createContract: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CreateContractParams"},
        };
        app.post('/contracts',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ContractsController)),
            ...(fetchMiddlewares<RequestHandler>(ContractsController.prototype.createContract)),

            async function ContractsController_createContract(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsContractsController_createContract, request, response });

                const controller = new ContractsController();

              await templateService.apiHandler({
                methodName: 'createContract',
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
        const argsContractsController_updateContract: Record<string, TsoaRoute.ParameterSchema> = {
                uid: {"in":"path","name":"uid","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"CreateContractParams"},
        };
        app.put('/contracts/:uid',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ContractsController)),
            ...(fetchMiddlewares<RequestHandler>(ContractsController.prototype.updateContract)),

            async function ContractsController_updateContract(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsContractsController_updateContract, request, response });

                const controller = new ContractsController();

              await templateService.apiHandler({
                methodName: 'updateContract',
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
        const argsContractsController_deleteContract: Record<string, TsoaRoute.ParameterSchema> = {
                uid: {"in":"path","name":"uid","required":true,"dataType":"string"},
        };
        app.delete('/contracts/:uid',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ContractsController)),
            ...(fetchMiddlewares<RequestHandler>(ContractsController.prototype.deleteContract)),

            async function ContractsController_deleteContract(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsContractsController_deleteContract, request, response });

                const controller = new ContractsController();

              await templateService.apiHandler({
                methodName: 'deleteContract',
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
        const argsAuthController_getWalletAuthMessage: Record<string, TsoaRoute.ParameterSchema> = {
                address: {"in":"query","name":"address","required":true,"dataType":"string"},
        };
        app.get('/auth/wallet',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.getWalletAuthMessage)),

            async function AuthController_getWalletAuthMessage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_getWalletAuthMessage, request, response });

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
        const argsAuthController_postWalletAuthSignature: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"signature":{"dataType":"string","required":true},"address":{"dataType":"string","required":true}}},
        };
        app.post('/auth/wallet',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.postWalletAuthSignature)),

            async function AuthController_postWalletAuthSignature(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_postWalletAuthSignature, request, response });

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
        const argsAuthController_createUser: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"referralCode":{"dataType":"string"}}},
        };
        app.post('/auth/users',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.createUser)),

            async function AuthController_createUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_createUser, request, response });

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
        const argsAssetsController_getAssetsAgreement: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/assets/agreement',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AssetsController)),
            ...(fetchMiddlewares<RequestHandler>(AssetsController.prototype.getAssetsAgreement)),

            async function AssetsController_getAssetsAgreement(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAssetsController_getAssetsAgreement, request, response });

                const controller = new AssetsController();

              await templateService.apiHandler({
                methodName: 'getAssetsAgreement',
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
        const argsAssetsController_postAssetsAgreement: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"role":{"dataType":"string","required":true},"accepted":{"dataType":"boolean","required":true}}},
        };
        app.post('/assets/agreement',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AssetsController)),
            ...(fetchMiddlewares<RequestHandler>(AssetsController.prototype.postAssetsAgreement)),

            async function AssetsController_postAssetsAgreement(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAssetsController_postAssetsAgreement, request, response });

                const controller = new AssetsController();

              await templateService.apiHandler({
                methodName: 'postAssetsAgreement',
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
        const argsAssetsController_getAssets: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/assets',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AssetsController)),
            ...(fetchMiddlewares<RequestHandler>(AssetsController.prototype.getAssets)),

            async function AssetsController_getAssets(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAssetsController_getAssets, request, response });

                const controller = new AssetsController();

              await templateService.apiHandler({
                methodName: 'getAssets',
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
        const argsAssetsController_createAsset: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CreateAssetParams"},
        };
        app.post('/assets',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AssetsController)),
            ...(fetchMiddlewares<RequestHandler>(AssetsController.prototype.createAsset)),

            async function AssetsController_createAsset(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAssetsController_createAsset, request, response });

                const controller = new AssetsController();

              await templateService.apiHandler({
                methodName: 'createAsset',
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
        const argsAssetsController_deleteAsset: Record<string, TsoaRoute.ParameterSchema> = {
                uid: {"in":"path","name":"uid","required":true,"dataType":"string"},
        };
        app.delete('/assets/:uid',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AssetsController)),
            ...(fetchMiddlewares<RequestHandler>(AssetsController.prototype.deleteAsset)),

            async function AssetsController_deleteAsset(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAssetsController_deleteAsset, request, response });

                const controller = new AssetsController();

              await templateService.apiHandler({
                methodName: 'deleteAsset',
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
        const argsApiKeysController_getApiKeys: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api-keys',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ApiKeysController)),
            ...(fetchMiddlewares<RequestHandler>(ApiKeysController.prototype.getApiKeys)),

            async function ApiKeysController_getApiKeys(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsApiKeysController_getApiKeys, request, response });

                const controller = new ApiKeysController();

              await templateService.apiHandler({
                methodName: 'getApiKeys',
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
        const argsApiKeysController_createApiKey: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CreateApiKeyParams"},
        };
        app.post('/api-keys',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ApiKeysController)),
            ...(fetchMiddlewares<RequestHandler>(ApiKeysController.prototype.createApiKey)),

            async function ApiKeysController_createApiKey(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsApiKeysController_createApiKey, request, response });

                const controller = new ApiKeysController();

              await templateService.apiHandler({
                methodName: 'createApiKey',
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
        const argsApiKeysController_deleteApiKey: Record<string, TsoaRoute.ParameterSchema> = {
                uid: {"in":"path","name":"uid","required":true,"dataType":"string"},
        };
        app.delete('/api-keys/:uid',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ApiKeysController)),
            ...(fetchMiddlewares<RequestHandler>(ApiKeysController.prototype.deleteApiKey)),

            async function ApiKeysController_deleteApiKey(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsApiKeysController_deleteApiKey, request, response });

                const controller = new ApiKeysController();

              await templateService.apiHandler({
                methodName: 'deleteApiKey',
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
