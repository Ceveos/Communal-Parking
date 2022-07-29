import { Prisma } from '@prisma/client';
import { Role } from '@prisma/client';
import AuthSectionGuard from './authSectionGuard';

interface Props {
  community: Prisma.CommunityGetPayload<{}>;
  communityGuard?: boolean
  authenticationGuard?: boolean
  roleGuard?: Role[]
  children: React.ReactNode;
}
const ModSectionGuard: React.FC<Props> = ({community, children}) => {

  return (
    <AuthSectionGuard
      community={community}
      roleGuard={['ADMIN', 'MODERATOR']}
      communityGuard
      authenticationGuard
    >
      {children}
    </AuthSectionGuard>
  );
};

export default ModSectionGuard;