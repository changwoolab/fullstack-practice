import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {
    // MikroORM.init();은 promise를 반환하기 때문에 await 사용
    const orm = await MikroORM.init(microConfig);

    // Post 객체를 생성한 뒤, DB에 업로드하기
    const post = orm.em.create(Post, {title: "my first post"});
    await orm.em.persistAndFlush(post);
    console.log("--------------sql2---------------");
    // 위의 두 줄을 한 줄로!
    await orm.em.nativeInsert(Post, {title:"my first Post 2"});
};

main().catch((err) => {
    console.log(err);
});