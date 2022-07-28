import { ClockIcon, CollectionIcon, HomeIcon, StarIcon } from '@heroicons/react/solid';
import { Prisma } from '@prisma/client';
import { SidebarItem } from 'components/dashboard/sidebar';
import DashboardLayout from '.';

const sidebar: SidebarItem[] = [
  { name: 'Home', href: '/', icon: HomeIcon, route: /^\/_sites\/\[site\]$/, type: 'link'},
  { name: 'Vehicles', href: '/vehicles', icon: CollectionIcon, route: /^\/_sites\/\[site\]\/vehicles$/, type: 'link'},
  { name: 'Reservations', href: '/reservations', icon: ClockIcon, route: /^\/_sites\/\[site\]\/reservations$/, type: 'link'},
  {
    name: 'Admin',
    allowed: ['MODERATOR', 'ADMIN'],
    icon: StarIcon,
    type: 'section',
    children: [
      {
        name: 'Dashboard',
        href: '/admin',
        route: /^\/_sites\/\[site\]\/admin$/,
        type: 'childlink'
      },
      {
        name: 'Units',
        href: '/admin/units',
        route: /^\/_sites\/\[site\]\/admin\/units$/,
        type: 'childlink'
      },
    ]
  },
];

interface MainSiteDashboardLayoutProps {
  community: Prisma.CommunityGetPayload<{}>;
  children?: React.ReactNode;
}

const MainSiteDashboardLayout: React.FC<MainSiteDashboardLayoutProps> = ({ community, children }) => {
  return <DashboardLayout community={community} sidebarMenuItems={sidebar}>{children}</DashboardLayout>;
};

export default MainSiteDashboardLayout;