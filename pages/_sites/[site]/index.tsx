import * as Prisma from '@prisma/client';
import { prisma } from 'db';
import { useRouter } from 'next/router';

import { MainSiteDashboardLayout } from 'layouts/dashboard';
import DashboardSection from 'components/dashboard/section';
import Loader from 'components/sites/Loader';
import ReservationsTable, { Reservation } from 'components/dashboard/reservationTable';
import Stats, { Stat } from 'components/dashboard/stats';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

const stats: Stat[] = [
  { name: 'Availability', stat: '8/10' }
];

const reservations: Reservation[] = [
  {
    id: 1,
    title: 'Tesla Model 3',
    type: 'Valid',
    location: 'Unit J5',
    department: 'BQV9911',
    closeDate: '2020-01-07',
    closeDateFull: 'January 7, 2020',
  },
  {
    id: 2,
    title: 'Ford Fiesta',
    type: 'Valid',
    location: 'Unit J5',
    department: 'BDB5128',
    closeDate: '2020-01-07',
    closeDateFull: 'January 7, 2020',
  },
];

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  communityData: string;
}

export default function Index(props: IndexProps) {
  const router = useRouter();

  if (router.isFallback) return <Loader />;
  console.log(router);
  const community = JSON.parse(props.communityData) as Prisma.Community;

  return (
    <MainSiteDashboardLayout community={community}>
      <DashboardSection
        title='Parking'
        buttonText='Reserve a spot'
        href='#'
      >
        {/* Stats */}
        <Stats stats={stats} />

        {/* Table */}
        <ReservationsTable reservations={reservations} loading={false} />
      </DashboardSection>
    </MainSiteDashboardLayout>
  );
}

export const getStaticProps: GetStaticProps<IndexProps, PathProps> = async ({params}) => {
  if (!params) throw new Error('No path parameters found');

  const { site } = params;
  let communityData;

  // If we have a period, it's a customized domain
  if (site.indexOf('.') !== -1) {
    const domainData = (await prisma.customDomain.findUnique({
      where: {
        domain: site
      },
      include: {
        Community: true
      }
    }));

    communityData = domainData?.Community;
  } else {
    // Otherwise, it's a community slug
    communityData = (await prisma.community.findUnique({
      where: {
        subdomain: site,
      }
    }));
  }

  if (!communityData) return { notFound: true };

  return {
    props: {
      communityData: JSON.stringify(communityData),
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  return {
    paths: [],
    fallback: true
  };
};