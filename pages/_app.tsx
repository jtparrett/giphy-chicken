import { QueryClientProvider } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'

import { queryClient } from '../utils'

function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App
