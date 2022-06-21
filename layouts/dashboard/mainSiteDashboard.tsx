
import * as Prisma from '@prisma/client';
import { ClockIcon, CollectionIcon, HomeIcon } from '@heroicons/react/solid';
import { SidebarLink } from 'components/dashboard/sidebar';
import DashboardLayout from '.';

const sidebar: SidebarLink[] = [
  { name: 'Home', href: '/', icon: HomeIcon, route: '/_sites/[site]' },
  { name: 'Vehicles', href: '/vehicles', icon: CollectionIcon, route: '/_sites/[site]/vehicles'},
  { name: 'Reservations', href: '/reservations', icon: ClockIcon, route: '/_sites/[site]/reservations'},
];

interface MainSiteDashboardLayoutProps {
  community: Prisma.Community;
  children?: React.ReactNode;
}
const MainSiteDashboardLayout: React.FC<MainSiteDashboardLayoutProps> = ({ community, children }) => {
  return <DashboardLayout community={community} sidebarMenuItems={sidebar}>{children}</DashboardLayout>;
};

export default MainSiteDashboardLayout;