import { MainSiteDashboardLayout } from 'layouts/dashboard';
import { Prisma } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Loader from 'components/sites/Loader';
import Unauthenticated from './unauthenticated';
import Unauthorized from './unauthorized';

interface Props {
  community: Prisma.CommunityGetPayload<{}>;
  communityGuard?: boolean
  children: React.ReactNode;
}
const AuthGuard: React.FC<Props> = ({community, communityGuard, children}) => {
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
    return <Unauthorized/>;
  }

  return <>{children}</>;
};

export default AuthGuard;