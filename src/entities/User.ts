import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

// ORM -> DB table과 class/객체를 매칭시켜줌.
// @를 붙여야 class와 DB table 매칭 가능함
// 안 붙이면 그냥 class임.
@ObjectType() // graphql type으로 바꿔줘야 함, @Field라는 데코레이터를 통해 보여줄 데이터를 결정
@Entity()
export class User {
  @Field() // @field는 typegraph schema이라는 점을 나타냄. + 보여줄지를 결정
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({type:"date"})
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({type:"date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field()
  @Property({type:"text", unique: true}) // username은 1개만!
  username!: string;

  // 여기에 @Field가 없는 이유는 query 받았을 때 password를 돌려주면 안되니깐!
  @Property({type:"text"}) // username은 1개만!
  password!: string;
}