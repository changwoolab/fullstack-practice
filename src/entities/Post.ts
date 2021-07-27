import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

// ORM -> DB table과 class/객체를 매칭시켜줌.
// @를 붙여야 class와 DB table 매칭 가능함
// 안 붙이면 그냥 class임.
@ObjectType() // graphql type으로 바꿔줘야 함.
@Entity()
export class Post {
  @Field() // @field는 typegraph schema이라는 점을 나타냄.
  @PrimaryKey()
  _id!: number;

  @Field()
  @Property({type:"date"})
  createdAt: Date = new Date();

  @Field()
  @Property({type:"date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field()
  @Property({type:"text"})
  name!: string;
}