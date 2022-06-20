import 'styles/tailwind.css';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { UserContextWrapper } from 'context/UserContext';
import { store } from 'app/store';
import client from 'context/ApolloContext';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ThemeProvider>
      <ApolloProvider client={client}> {/* Apollo first so react context can use graphql */}
        <Provider store={store}>
          <UserContextWrapper>
            <Component {...pageProps} />
          </UserContextWrapper>
        </Provider>
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default MyApp;
