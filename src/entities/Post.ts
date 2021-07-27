import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

// ORM -> DB table과 class/객체를 매칭시켜줌.
// @를 붙여야 class와 DB table 매칭 가능함
// 안 붙이면 그냥 class임.
@Entity()
export class Post {

  @PrimaryKey()
  _id!: number;

  @Property({type:"date"})
  createdAt: Date = new Date();

  @Property({type:"date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({type:"text"})
  name!: string;
}