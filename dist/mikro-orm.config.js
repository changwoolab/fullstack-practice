import { __prod__ } from "./constants.js";
import { Post } from "./entities/Post.js";
import path from "path";
export default {
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post],
    user: "postgres",
    password: "ckddnckd11",
    dbName: "lireddit",
    type: "postgresql",
    debug: !__prod__,
};
//# sourceMappingURL=mikro-orm.config.js.map