import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME } from "../constants";


// @~~는 지금부터 ~~를 정의할것임을 알려줌 @Resolver -> 지금부터 resolver 정의
// @Field -> 쿼리 받았을 때 사용할 수 있는 Field 정의

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

// Error 자료구조 정의
// 무엇이 Error인지 설명해주기 위한 목적
@ObjectType()
class FieldError {
    @Field()
    field: string
    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable:true})
    errors?: FieldError[] // ?의 의미는 undefined가 가능하다는 뜻
    @Field(() => User, {nullable: true})
    user?: User
}

// Resolver는 어떻게 이 graphQL이 작동하는지를 알려줌.
@Resolver()
export class UserResolver {
    // Cookie를 이용한 login 유지 확인을 위한 쿼리
    // 로그인을 하면 cookie가 클라이언트에 저장되고 이 cookie를 서버에 보냄으로써
    // login authentication이 가능함.
    @Query(() => User, {nullable : true})
    async me(
        @Ctx() { req, em }: MyContext
    ) {
        // not logged in
        if (!req.session.userId) {
            return null;
        }
        const user = await em.findOne(User, {id: req.session.userId});
        return user;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [{
                    field: "username",
                    message: "length must be greater than 2"
                }]
            };
        }
        if (options.password.length <= 3) {
            return {
                errors: [{
                    field: "password",
                    message: "length must be greater than 3"
                }]
            };
        }
        // Hashing을 통해 비번 암호화 해야 함. --> node-argon2 이용
        const hashedPassword = await argon2.hash(options.password);
        let user;
        try {
            // User schema를 사용하여 query를 만들어서 내용 업데이트한 뒤
            // 성공하면 return "*" (*은 모든것을 반환한다는 뜻임)
            const result = await (em as EntityManager)
            .createQueryBuilder(User)
            .getKnexQuery()
            .insert (
                {
                    username: options.username,
                    password: hashedPassword,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            )
            .returning("*");
            user = result[0];
            await em.persistAndFlush(user);
        } catch(err) {
            // duplicate username error
            if (err.code === "23505") {
                return {
                    errors: [{
                        field: "username",
                        message: "username already taken"
                    }]
                };
            }
        }
        
        // store user id session
        // this will set a cookie on the user
        // keep them logged in
        req.session.userId = user.id;

        return {user};
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse> { // 이 Promise가 반환할 값을 <> 안에 적음
        // username이 기존DB에 있는지 없는지 확인
        const user = await em.findOne(User, {username: options.username});
        if (!user) {
            return {
                // 우리가 반환할 값이 UserResponse 객체이므로 그 객체의 형식에 맞춰서 return
                // 특히 error 부분도 FieldError라는 객체 형식으로 반환해야 하므로 이를 지키기!
                // user부분은 undefined가 될 수도 있으므로(user?이므로) error만 돌려줘도 되는 것!
                errors: [{
                    field: "username",
                    message: "that username doesn't exist"
                }]
            };
        }
        // 비밀번호가 valid한지 확인하고 아니면 Error 전송
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors:[{
                    field: "password",
                    message: "Incorrect Password"
                }]
            };
        }
        // session에 userId를 저장하기
        req.session.userId = user.id;

        return {user};
    }
    
    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext) {
        // cookie 및 session을 없앰.
        return new Promise((resolve) => 
            req.session.destroy((err) => {
                res.clearCookie(COOKIE_NAME);
                if (err) {
                    resolve(false); // false로 response하기.
                    return
                }
                resolve(true);
            })
        );
    }
}