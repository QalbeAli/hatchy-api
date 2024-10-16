/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageResponse } from '../models/MessageResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MastersImageService {

    /**
     * update master avatar image
     * @param tokenId tokenId
     * @param chainId 
     * @returns MessageResponse OK
     * @throws ApiError
     */
    public static updateMastersAvatarImage(
tokenId: number,
chainId?: any,
): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/masters/avatars/image/{tokenId}',
            path: {
                'tokenId': tokenId,
            },
            query: {
                'chainId': chainId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

}
