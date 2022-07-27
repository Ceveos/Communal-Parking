import { ClockIcon, CollectionIcon, HomeIcon, StarIcon } from '@heroicons/react/solid';
import { Prisma } from '@prisma/client';
import { SidebarLink } from 'components/dashboard/sidebar';
import DashboardLayout from '.';

const sidebar: SidebarLink[] = [
  { name: 'Home', href: '/', icon: HomeIcon, route: /^\/_sites\/\[site\]$/ },
  { name: 'Vehicles', href: '/vehicles', icon: CollectionIcon, route: /^\/_sites\/\[site\]\/vehicles$/},
  { name: 'Reservations', href: '/reservations', icon: ClockIcon, route: /^\/_sites\/\[site\]\/reservations$/},
  { name: 'Admin', href: '/admin', allowed: ['MODERATOR', 'ADMIN'], icon: StarIcon, route: /^\/_sites\/\[site\]\/admin/},
];

interface MainSiteDashboardLayoutProps {
  community: Prisma.CommunityGetPayload<{}>;
  children?: React.ReactNode;
}

const MainSiteDashboardLayout: React.FC<MainSiteDashboardLayoutProps> = ({ community, children }) => {
  return <DashboardLayout community={community} sidebarMenuItems={sidebar}>{children}</DashboardLayout>;
};

export default MainSiteDashboardLayout;