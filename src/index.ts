import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

const main = async () => {
    // MikroORM.init();은 promise를 반환하기 때문에 await 사용
    // initialize orm (connect to DB)
    const orm = await MikroORM.init(microConfig);

    // run migrations
    await orm.getMigrator().up();

    // express.js를 이용하여 app server 생성
    // node.js할 때는 if문으로 app 내부를 계속 추가해줬다면
    // express.js에서는 app.get으로 함수 각각으로 나눌 수 있다는 것이 장점인듯!
    const app = express();
    
    // REST API는 메소드와 URL조합하여 예측가능하고 일정한 정보와 작업을 요청 (자판기)
    //            단점은 필요없는 정보도 받아와야할 때도 있고 여러 depth에 있는 정보를 가져오려면 여러번 요청해야함.
    // GraphQL은 REST API의 단점을 보완하기 위한 쿼리언어임.
    // 즉, 자신이 필요한 정보만 요청해서 받아올 수 있음.
    // Apollo는 GraphQL의 라이브러리 중 하나.
    // TypegraphQL도 GraphQL의 라이브러리 중 하나. (Typescript를 위한)
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        // context: 모든 resolver에 의해 접근됨, 모든 resolver가 필요한 것들을 가지고 있음.
        context: () => ({ em: orm.em })
    });
    apolloServer.applyMiddleware({app});
    app.listen(4000, () => {
        console.log("server: 4000");
    });
};

main().catch((err) => {
    console.log(err);
});