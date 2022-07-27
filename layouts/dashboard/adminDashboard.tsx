import { Prisma } from '@prisma/client';
import AuthGuard from 'components/common/authGuard';
import DashboardTabbedSection, { SectionTab } from 'components/dashboard/tabbedSection';
import MainSiteDashboardLayout from './mainSiteDashboard';

const tabs: SectionTab[] = [
  { name: 'Dashboard', href: '/admin', route: /^\/_sites\/\[site\]\/admin$/ },
  { name: 'Units', href: '/admin/units', route: /^\/_sites\/\[site\]\/admin\/units/},
  { name: 'Tenants', href: '/admin/tenants', route: /^\/_sites\/\[site\]\/admin\/tenants/},
];

interface MainSiteDashboardLayoutProps {
  community: Prisma.CommunityGetPayload<{}>;
  children?: React.ReactNode;
}

const AdminDashboardLayout: React.FC<MainSiteDashboardLayoutProps> = ({ community, children }) => {
  return (
    <MainSiteDashboardLayout community={community}>
      <AuthGuard community={community} communityGuard roleGuard={['ADMIN', 'MODERATOR']}>
        <DashboardTabbedSection title='Admin' tabs={tabs}>
          {children}
        </DashboardTabbedSection>
      </AuthGuard>
    </MainSiteDashboardLayout>
  );
};

export default AdminDashboardLayout;