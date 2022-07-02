import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from 'db';
import EmailProvider from 'next-auth/providers/email';;
import NextAuth from 'next-auth';

const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith('https://') ?? false;
const cookiePrefix = useSecureCookies ? '__Secure-' : '';
const hostName = new URL(process.env.NEXTAUTH_URL ?? '').hostname;

console.log(`Hostnamne: ${hostName}`);

export default NextAuth({
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
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
    async jwt({token, user}) {
      if (user) {
        // If we have a house, get the community ID
        if (user.houseId) {
          const houseData = await prisma.house.findUnique({
            where: {
              id: user.houseId
            }
          });

          token.communityId = houseData?.communityId;
        }

        token.role = user?.role ?? token.role;
        token.id = user?.id ?? token.id;
        token.houseId = user?.houseId ?? token.houseId;
      }
      token.name = user?.name ?? token.name ?? token.email ?? 'User';
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.houseId = token.houseId;
      session.user.communityId = token.communityId;
      session.user.name = token.name;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return Promise.resolve(`${baseUrl}${url}`);
      return Promise.resolve(url);
    }
  },
});