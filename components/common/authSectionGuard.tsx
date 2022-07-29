import { Prisma } from '@prisma/client';
import { Role } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface Props {
  community: Prisma.CommunityGetPayload<{}>;
  communityGuard?: boolean
  authenticationGuard?: boolean
  roleGuard?: Role[]
  children: React.ReactNode;
}
const AuthSectionGuard: React.FC<Props> = ({community, authenticationGuard, communityGuard, roleGuard, children}) => {
  const { data: session, status } = useSession();

  if (communityGuard && (!session?.user.communityId || session?.user.communityId !== community.id)) {
    return null;
  }

  if (authenticationGuard && !session?.user.id) {
    return null;
  }

  if (roleGuard && (roleGuard.indexOf(session?.user.role as Role) === -1)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthSectionGuard;