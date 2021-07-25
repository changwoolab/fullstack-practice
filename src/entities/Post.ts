import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Post {
    // @mikroORM을 이용하여 class와 DB 매칭
    @PrimaryKey()
    id!: number;

    @Property()
    createdAt = new Date();

    @Property({onUpdate: () => new Date() })
    updatedAt = new Date();

    @Property()
    title!: string;
}