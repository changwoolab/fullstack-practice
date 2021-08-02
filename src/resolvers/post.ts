import { Post } from "../entities/Post";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../types";

// Resolver는 어떻게 이 graphQL이 작동하는지를 알려줌.
@Resolver()
export class PostResolver {
    @Query(() => [Post])
    //posts라는 query가 들어오면 return Post들
    async posts(@Ctx() {em}: MyContext): Promise<Post[]> { // @Ctx = context를 사용한다는 뜻. 
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
        @Ctx() {em}: MyContext
        ): Promise<Post> { 
            const post = em.create(Post, {title});
            await em.persistAndFlush(post);
            return post;
    }

    @Mutation(() => Post, { nullable:true })
    async updatePost(
        @Arg("id") id: number,
        @Arg("title", () => String, { nullable: true }) title: string,
        @Ctx() {em}: MyContext
        ): Promise<Post | null> {
            // await가 없다면 async로 작동하기 때문에 post에 들어오는 인자가
            // 들어오기 전에 작동할수도 있으므로 post가 promise객체로 인식되어야 함.
            // -> await를 넣음으로써 Post|null이 먼저 들어와서 인식되도록 함.
            const post = await em.findOne(Post, {id}); // id를 이용해서 post 찾기
            if (!post) { // id에 맞는 post가 없다면 return null
                return null;
            }
            if (typeof title !== "undefined") {
                post.title = title;
                await em.persistAndFlush(post);
            }
            return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number,
        @Ctx() {em}: MyContext
        ): Promise<boolean> {
            em.nativeDelete(Post, { id });
            return true;
    }
}