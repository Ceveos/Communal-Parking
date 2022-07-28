import { Prisma } from '@prisma/client';
import AuthGuard from 'components/common/authGuard';
import MainSiteDashboardLayout from './mainSiteDashboard';

interface MainSiteDashboardLayoutProps {
  community: Prisma.CommunityGetPayload<{}>;
  children?: React.ReactNode;
}

const AdminDashboardLayout: React.FC<MainSiteDashboardLayoutProps> = ({ community, children }) => {
  return (
    <MainSiteDashboardLayout community={community}>
      <AuthGuard community={community} communityGuard roleGuard={['ADMIN', 'MODERATOR']}>
        {children}
      </AuthGuard>
    </MainSiteDashboardLayout>
  );
};

export default AdminDashboardLayout;