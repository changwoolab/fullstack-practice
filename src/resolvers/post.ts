import { Post } from "../entities/Post";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../types";

// Resolver는 어떻게 이 graphQL이 작동하는지를 알려줌.
@Resolver()
export class PostResolver {
    @Query(() => [Post])
    //posts라는 query가 들어오면 return Post들
    posts(@Ctx() {em}: MyContext): Promise<Post[]> { // @Ctx = context를 사용한다는 뜻. 
        return em.find(Post, {}); // 모든 Post들을 em DB에서 찾아서 return
    }

    @Query(() => Post, { nullable: true})
    post(
        @Arg('id') id: number, // query Arg로 무엇을 받을 것인가를 결정
        @Ctx() {em}: MyContext): Promise<Post | null> { 
        return em.findOne(Post, { id }); // id값을 만족하는 Post 찾기
    }

    // Query는 데이터 요청, Mutation은 데이터 update
    @Mutation(() => Post)
    async createPost( // em을 사용하려면 비동기적 작동이 필요 (+Promise를 반환하므로)
        @Arg("title") title: string,
        @Ctx() {em}: MyContext): Promise<Post> { 
            const post = em.create(Post, {title});
            await em.persistAndFlush(post);
            return post;
    }
}