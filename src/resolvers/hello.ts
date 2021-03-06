import { Query, Resolver } from "type-graphql";

// Resolver는 어떻게 이 graphQL이 작동하는지를 알려줌.
@Resolver()
export class HelloResolver {
    @Query(() => String)
    // hello라는 query가 들어오면 return "hello world"
    hello() {
        return "hello world"
    }
}