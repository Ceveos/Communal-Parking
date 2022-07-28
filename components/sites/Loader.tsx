import { MainSiteDashboardLayout } from 'layouts/dashboard';
import DashboardSection from 'components/dashboard/section';

export default function Loader() {
  return (
    <MainSiteDashboardLayout>
      <DashboardSection loading />
    </MainSiteDashboardLayout>
  );
}
