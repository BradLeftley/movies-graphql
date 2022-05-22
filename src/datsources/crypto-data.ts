import { RESTDataSource } from "apollo-datasource-rest";
import { GreenSatoshi } from "src/models/green-satoshi";

//import { env } from "process";
export class CryptoDataDatasource extends RESTDataSource {

  baseURL = 'https://api.coingecko.com'

  async getCryptoData( query: string): Promise<GreenSatoshi> {
    console.log("HERE", query)
    const greensatoshi = await this.get(`/api/v3/coins/${query}`)
   
   const name = greensatoshi.name
   const symbol = greensatoshi.symbol
   const price = greensatoshi.market_data.current_price.gbp
   const imageUrl = greensatoshi.image.small
   const priceDifference = greensatoshi.market_data.price_change_24h_in_currency.gbp
   const priceDifferenceHour = greensatoshi.market_data.price_change_percentage_1h_in_currency.gbp
    const obj: GreenSatoshi = {
        name: name,
       symbol: symbol,
       price: price,
       imageUrl: imageUrl,
       priceDifference: priceDifference,
       priceDifferenceHour: priceDifferenceHour
       }

      
    return obj;
  }


}
