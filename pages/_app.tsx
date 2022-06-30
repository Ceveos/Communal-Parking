import 'styles/tailwind.css';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { store } from 'app/store';
import client from 'context/ApolloContext';
import type { AppProps } from 'next/app';;

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <SessionProvider session={pageProps.session}>
      <ApolloProvider client={client}> {/* Apollo first so react context can use graphql */}
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ApolloProvider>
    </SessionProvider>
  );
}

export default MyApp;
