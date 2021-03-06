import { dedupExchange, fetchExchange } from "urql"
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation } from "../generated/graphql"
import { betterUpdateQuery } from "./betterUpdateQuery";
import { cacheExchange } from "@urql/exchange-graphcache";

// urql client
// urql을 사용하는 이유는 프론트엔드와 백엔드를 연결하기 위함임.
// urql은 graphql client임.
// 즉, 지금까지는 playground에 들어가서 쿼리를 직접 입력해야했다면
// 지금부터는 client를 이용해서 기계 간의 쿼리가 가능하도록 함.
export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: "include" as const, // cookie를 위한 설정
  },
  // login 했을 때 cache 때문에 로그인 안된 것처럼 보이는 문제 해결
  // cache 업데이트!
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        logout: (_result, args, cache, info) => {
          betterUpdateQuery<LogoutMutation, MeQuery>(
            cache,
            {query: MeDocument},
            _result,
            ()=> ({me: null})
          )
        },
        login: (_result, args, cache, info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(
            cache,
            {query: MeDocument},
            _result,
            (result, query) => { // updater function, login mutation이 발생할때마다 실행
              // login에서 error발생하면 현재 Mequery를 리턴 (cache에 변함이 없음)
              if (result.login.errors) { 
                return query;
              } else {
                return { // error 발생 안하면 Mequery를 업데이트 (cache가 변함)
                  me: result.login.user
                };
              }
            }
          );
        },
        register: (_result, args, cache, info) => {
          betterUpdateQuery<RegisterMutation, MeQuery>(
            cache,
            {query: MeDocument},
            _result,
            (result, query) => {
              if (result.register.errors) {
                return query;
              } else {
                return {
                  me: result.register.user
                };
              }
            }
          );
        },
      }
    }
  }), ssrExchange, fetchExchange],
});