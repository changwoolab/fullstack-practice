import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string

    @Field()
    password: string
}

// @~~는 지금부터 ~~를 정의할것임을 알려줌 @Resolver -> 지금부터 resolver 정의
// @Field -> 쿼리 받았을 때 보여줄 수 있는 Field 정의

// Resolver는 어떻게 이 graphQL이 작동하는지를 알려줌.
@Resolver()
export class UserResolver {
    @Mutation(() => User)
    // hello라는 query가 들어오면 return "hello world"
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ) {
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {
            username: options.username, 
            password: hashedPassword});
        await em.persistAndFlush(user);
        // Hashing을 통해 비번 암호화 해야 함. --> node-argon2 이용
        return user;
    }
}