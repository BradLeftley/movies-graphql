import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Movie {
  @Field()
  id: number;
  @Field()
  title: string;
  @Field()
  overview: string;
  @Field()
  poster_path: string; 
  @Field()
  vote_average: number; 
}