import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import React from 'react'
import { createClient, Provider } from 'urql';
import theme from '../theme';

// urql client
// urql을 사용하는 이유는 프론트엔드와 백엔드를 연결하기 위함임.
// urql은 graphql client임.
// 즉, 지금까지는 playground에 들어가서 쿼리를 직접 입력해야했다면
// 지금부터는 client를 이용해서 기계 간의 쿼리가 가능하도록 함.
const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: "include", // cookie를 위한 설정
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
