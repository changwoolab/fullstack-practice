import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";


const main = async () => {
    // MikroORM.init();은 promise를 반환하기 때문에 await 사용
    // initialize orm (connect to DB)
    const orm = await MikroORM.init(microConfig);

    // run migrations
    await orm.getMigrator().up();

    // express.js를 이용하여 app server 생성
    const app = express();
    app.get("/", (_, res) => {
        res.send("hello");
    });
    app.listen(4000, () => {
        console.log("server: 4000");
    });
};

main().catch((err) => {
    console.log(err);
});