import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PlexMovie {
  @Field()
  title: string;
  @Field({ nullable: true })
  overview: string;
  @Field()
  image: string
}