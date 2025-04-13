import _ultigenEggsData from "./ultigenEggsMetadata.json";

export const ultigenEggPrice = 1000;
export const ultigenEggsData: any = _ultigenEggsData;
export const availableMonsterIds = [20000];

export const fireEggId = 1;
export const waterEggId = 2;
export const plantEggId = 3;
export const lightEggId = 4;
export const darkEggId = 5;

export const ultigenEggsIds = [
  fireEggId, // Fire Egg
  // waterEggId, // Plant Egg
  // plantEggId, // Water Egg
  // lightEggId, // Dark Egg
  // darkEggId, // Light Egg
]


import { createRangeArray, getGen2ShinyIds } from "../../utils";

export const gen1VoidIds = [0];
export const gen1PlantIds = createRangeArray(1, 9);
export const gen1WaterIds = createRangeArray(10, 18);
export const gen1FireIds = createRangeArray(19, 27);
export const gen1DarkIds = createRangeArray(28, 33);
export const gen1LightIds = createRangeArray(34, 39);
export const gen1Ids = createRangeArray(1, 39);

export const firstGen2Id = 40;
export const gen2PlantCommonIds = createRangeArray(firstGen2Id, 62);
export const gen2WaterCommonIds = createRangeArray(63, 85);
export const gen2FireCommonIds = createRangeArray(86, 108);
export const gen2DarkCommonIds = createRangeArray(109, 122);
export const gen2LightCommonIds = createRangeArray(123, 136);

export const plantShinyIdsGen2 = [
  ...gen2PlantCommonIds.map((id) => id * 1000 + 888),
];
export const waterShinyIdsGen2 = [
  ...gen2WaterCommonIds.map((id) => id * 1000 + 888),
];
export const fireShinyIds = [...gen2FireCommonIds.map((id) => id * 1000 + 888)];
export const darkShinyIds = [...gen2DarkCommonIds.map((id) => id * 1000 + 888)];
export const lightShinyIds = [
  ...gen2LightCommonIds.map((id) => id * 1000 + 888),
];
export const voidShinyIds = [10011001, 10100101, 10101001, 11111111];

export const gen2VoidIds = [10011001, 10101001, 10100101, 11111111];
export const dragonShinyIds = [137888, 138888, 139888, 140888, 141888, 142888];
export const dragonMonsterShinyIds = [137, 138, 139, 140, 141, 142];

export const gen2CommonIds = createRangeArray(firstGen2Id, 136);
export const gen2ShinyIds = getGen2ShinyIds(firstGen2Id);
export const gen2SpecialIds = dragonShinyIds.concat(voidShinyIds);
export const gen2AllIds = gen2CommonIds
  .concat(gen2ShinyIds)
  .concat(gen2VoidIds);

export const gen1BaseUrlCommon = 'https://hatchy-api-hatchypocket-assets-prod.s3.amazonaws.com/gen1/icons/common/';
export const gen1BaseUrlShiny = 'https://hatchy-api-hatchypocket-assets-prod.s3.amazonaws.com/gen1/icons/shiny/';
export const gen2BaseUrlCommon = 'https://hatchy-api-hatchypocket-assets-prod.s3.amazonaws.com/gen2/icons/common/';
export const gen2BaseUrlShiny = 'https://hatchy-api-hatchypocket-assets-prod.s3.amazonaws.com/gen2/icons/shiny/';
export const cloudfrontBaseUrl = 'https://d2pdcsofh1vza7.cloudfront.net/';
