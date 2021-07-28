import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";

// @~~는 지금부터 ~~를 정의할것임을 알려줌 @Resolver -> 지금부터 resolver 정의
// @Field -> 쿼리 받았을 때 사용할 수 있는 Field 정의


@InputType()
class UsernamePasswordInput {
    @Field()
    username: string

    @Field()
    password: string
}

@ObjectType()
class FieldError {

}

@ObjectType()
class UserResponse {
    @Field(() => [Error], {nullable:true})
    errors?: Error[] // ?의 의미는 undefined라는 뜻
    @Field(() => User, {nullable: true})
    user?: User
}

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

    @Mutation(() => User)
    // hello라는 query가 들어오면 return "hello world"
    async login(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ) {
        // username이 기존DB에 있는지 없는지 확인
        const user = await em.findOneOrFail(User, {username: options.username});
        if (!user) {
            return {
                errors: [{
                    
                }]
            }
        }
        const hashedPassword = await argon2.hash(options.password);
        return user;
    }
}