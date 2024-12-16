export class CoingeckoService {
  async getHatchyPrice() {
    try {
      const usdFetch = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=hatchypocket&vs_currencies=usd`);
      const usdPrice = await usdFetch.json();
      return usdPrice['hatchypocket'].usd as number
    } catch (error) {
      console.log(error);
    }
  }

}