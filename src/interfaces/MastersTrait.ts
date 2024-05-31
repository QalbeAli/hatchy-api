/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MastersColor } from './MastersColor';
import type { MastersGender } from './MastersGender';
import type { MastersTraitType } from './MastersTraitType';

export type MastersTrait = {
    id: number;
    name: string;
    traitId: number;
    image: string;
    frontImage?: string;
    backImage?: string;
    type: MastersTraitType;
    gender?: MastersGender;
    color?: MastersColor;
};
