import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PlexTvShow {
  @Field()
  title: string;
  @Field()
  updatedAt: string;
  @Field()
  image: string
}