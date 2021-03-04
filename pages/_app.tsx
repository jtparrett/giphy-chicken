import { QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';

import { queryClient } from '../utils';
import { UserProvider } from '../contexts';

function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
