import { JWT } from 'next-auth/jwt';
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      name: string;
      role: string;
      houseId?: string;
      communityId?: string;
    } & DefaultSession['user']
  }

  interface User {
    id: string;
    role: string;
    houseId?: string;
    communityId?: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    name: string;
    role: string;
    houseId?: string;
    communityId?: string;
  }
}