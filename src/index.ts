import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core"
import { COOKIE_NAME, __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";

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
    
    // redis는 DB, 캐시 등을 위한 데이터 저장 매체임.
    // Session을 위해 redis를 사용, redis를 사용하는 이유는 빨라서!
    // redis가 빠른 이유는 디스크가 아닌 메모리에 저장하기 때문임.
    // + 단순한 key-value 방식을 사용하기 때문에 빠름.
    // 아폴로를 사용하기 전에 session을 먼저 연결해야 하므로 아폴로 앞에 코드 적기.
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient()

    app.use(cors({ // express CORS에서 localhost:3000 서버에 대한 접속 허용하기.
        origin: "http://localhost:3000",
        credentials: true,
    }))
    
    app.use(
    session({
        name: COOKIE_NAME,
        store: new RedisStore({ client: redisClient,
            disableTouch:true,
        }),
        cookie:{
            httpOnly: true, // security 때문에 씀 (js로 접근X하게 함)
            sameSite: "lax", // csrf로부터 보호
            secure: __prod__ // https에서만 쿠키 작동
        },
        secret: 'keyboard cat',
        saveUninitialized: false,
        resave: false,
    })
    )

    // REST API는 메소드와 URL조합하여 예측가능하고 일정한 정보와 작업을 요청 (자판기)
    // 단점은 필요없는 정보도 받아와야할 때도 있고 여러 depth에 있는 정보를 가져오려면 여러번 요청해야함.
    // GraphQL은 REST API의 단점을 보완하기 위한 쿼리언어임.
    // 즉, 자신이 필요한 정보만 요청해서 받아올 수 있음.
    // Apollo는 GraphQL의 라이브러리 중 하나.
    // TypegraphQL도 GraphQL의 라이브러리 중 하나. (Typescript를 위한)
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        plugins: [
            // explorer은 cookie를 차단하기 때문에 playground에서 실험해야함.
            ApolloServerPluginLandingPageGraphQLPlayground({
            }),
        ],
        // context: 모든 resolver에 의해 접근됨, resolver가 필요한 것들을 가지고 있음.
        // {req, res}를 넣어주면 context를 통해 resolver가 session에 접근 가능해짐.
        // 정확히는 req을 통해 session에 접근 가능
        context: ({req, res}): MyContext => ({ em: orm.em, req, res })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false, // CORS policy
    });
    app.listen(4000, () => {
        console.log("server: 4000");
    });
};

main().catch((err) => {
    console.log(err);
});