import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from 'db';
import EmailProvider from 'next-auth/providers/email';;
import NextAuth from 'next-auth';

const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith('https://') ?? false;
const cookiePrefix = useSecureCookies ? '__Secure-' : '';
const hostName = new URL(process.env.NEXTAUTH_URL ?? '').hostname;

export default NextAuth({
  debug: true,
  adapter: PrismaAdapter(prisma),
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        domain: hostName == 'localhost' ? hostName : '.' + hostName
      }
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        domain: hostName == 'localhost' ? hostName : '.' + hostName
      }
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        domain: hostName == 'localhost' ? hostName : '.' + hostName
      }
    },
  },
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
    })
  ],
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   const isAllowedToSignIn = true;

    //   if (email.verificationRequest) {
    //     // Check db to see if allowed to sign in
    //     prisma.user.count({
    //       where: {
    //         email: user.email
    //       }
    //     })
    //   }

    //   if (isAllowedToSignIn) {
    //     return true;
    //   } else {
    //     // Return false to display a default error message
    //     return false;
    //     // Or you can return a URL to redirect to:
    //     // return '/unauthorized'
    //   }
    // },
    jwt({token, account, user, isNewUser, profile}) {
      if (user?.role) {
        token.role = user.role;
      }

      return token;
    },
    session({ session, token, user }) {
      if (token?.role) {
        session.user.
          session.user.role = token.role;
      }
      return session; // The return type will match the one returned in `useSession()`
    },
    async redirect({ url, baseUrl }) {
      console.log(`Redirect: URL: ${url}; Base URL: ${baseUrl}`);
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return url;
    }
  },
});