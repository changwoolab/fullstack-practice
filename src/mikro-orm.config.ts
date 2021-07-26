import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";


export default {
    migrations: {
        path: path.join(__dirname, './migrations'), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    },
    // DB table 추가
    entities: [Post],
    password:"ckddnckd11",
    dbName: "lireddit",
    type: "postgresql",
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];

// as ~~ 를 사용하면 ~~ type으로써 사용 가능.
// Parameters<types> -> types에 들어있는 모든 parameters를 array로 반환