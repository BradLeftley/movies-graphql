import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PlexMovie {
  @Field()
  title: string;
  @Field()
  overview: string;
  @Field()
  imdb_id: string
}