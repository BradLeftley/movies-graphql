import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PlexTvShow {
  @Field()
  parentTitle: string;
  @Field()
  title: string;
  @Field()
  image: string
}