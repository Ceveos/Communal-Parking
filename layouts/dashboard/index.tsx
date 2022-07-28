import * as Prisma from '@prisma/client';

import { useState } from 'react';

import { Toaster } from 'react-hot-toast';
import MainSiteDashboardLayout from './mainSiteDashboard';
import Navbar from 'components/dashboard/navbar';
import Sidebar, { SidebarItem } from 'components/dashboard/sidebar';

interface DashboardLayoutProps {
  community: Prisma.Community;
  sidebarMenuItems: SidebarItem[];

  children?: React.ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ community, children, sidebarMenuItems }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const { user } = useContext(UserContext);

  return (
    <>
      <Toaster/>
      <Sidebar
        header={community.name}
        menuItems={sidebarMenuItems}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className='bg-th-background dark:bg-th-background-dark'>
        <div className="min-h-screen">
          <div>

            <div className="md:pl-64 flex flex-col">
              <Navbar
                setSidebarOpen={setSidebarOpen}
              />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
export { MainSiteDashboardLayout };