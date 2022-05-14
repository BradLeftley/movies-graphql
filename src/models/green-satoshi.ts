import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class GreenSatoshi {
  @Field()
  name: string;
  @Field()
  symbol: string;
  @Field()
  price: string
  @Field()
  imageUrl: string; 
  @Field()
  priceDifference: string;
  @Field()
  priceDifferenceHour: string
}