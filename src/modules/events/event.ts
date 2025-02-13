export interface Event {
  uid: string;
  name: string;
  description?: string;
  gameId?: string;
  image?: string;
  rewards: {
    fromRank: number;
    toRank: number;
    assets: {
      uid: string;
      image: string;
      name: string
      amount: number;
    }[]
  }[]
  rewardsGiven: boolean;
  startDate: string;
  endDate: string;
}