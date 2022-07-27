import { Prisma } from '@prisma/client';
import { Role } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Loader from 'components/sites/Loader';
import Unauthenticated from './unauthenticated';
import Unauthorized from './unauthorized';

interface Props {
  community: Prisma.CommunityGetPayload<{}>;
  communityGuard?: boolean
  roleGuard?: Role[]
  children: React.ReactNode;
}
const AuthGuard: React.FC<Props> = ({community, communityGuard, roleGuard, children}) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Loader/>
    );
  }

  if (status === 'unauthenticated') {
    return <Unauthenticated/>;
  }

  if (communityGuard && (!session?.user.communityId || session?.user.communityId !== community.id)) {
    return <Unauthorized error="Sorry, only people of this community can visit this page"/>;
  }

  if (roleGuard && (roleGuard.indexOf(session?.user.role as Role) === -1)) {
    return <Unauthorized error="Sorry, only people with the appropriate privilege can visit this page"/>;
  }

  return <>{children}</>;
};

export default AuthGuard;