import { FullHouseModified, GET_FULL_HOUSE_QUERY, GetFullHouseData, GetFullHouseVars } from 'lib/queries/house.full';
import { Prisma } from '@prisma/client';
import { prisma } from 'db';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import AdminDashboardLayout from 'layouts/dashboard/adminDashboard';
import AuthGuard from 'components/common/authGuard';
import DashboardTabbedSection from 'components/dashboard/tabbedSection';
import Head from 'next/head';
import Loader from 'components/sites/Loader';
import ReservationHistoryTable from 'components/dashboard/reservationHistoryTable';
import ReservationsTable from 'components/dashboard/reservationTable';
import TenantsTable from 'components/dashboard/tenantsTable';
import VehiclesTable from 'components/dashboard/vehiclesTable';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  communityData: string;
}

type EditUnitTabs = 'Tenants' | 'Vehicles' | 'Reservations'

const tabs: EditUnitTabs[] = ['Tenants', 'Vehicles', 'Reservations'];

export default function Index(props: IndexProps) {
  const router = useRouter();
  const [community, setCommunity] = useState<Prisma.CommunityGetPayload<{}>>();
  const [activeTab, setActiveTab] = useState<EditUnitTabs>(tabs[0]);
  const [house, setHouse] = useState<FullHouseModified>();
  const [getHouse, { loading, error, data }] =
    useLazyQuery<GetFullHouseData, GetFullHouseVars>(
      GET_FULL_HOUSE_QUERY, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'network-only'
      });

  useEffect(() => {
    if (props.communityData !== undefined && community === undefined) {
      // Community Data is passed in from the server.
      // However, it is not always defined here due to SSR. So ensure it's defined before parsing.
      setCommunity(JSON.parse(props.communityData));
    }
  }, [props.communityData, community]);

  useEffect(() => {
    // We can only query for houses when session is loaded
    if (community?.id && router.query.unit && typeof(router.query.unit) === 'string') {
      getHouse({
        variables: {
          communityId: community.id,
          houseUnit: router.query.unit
        }
      });
    }
  }, [community, router.query.unit, getHouse]);

  useEffect(() => {
    if (data?.getHouse && !house) {
      setHouse(data.getHouse);
    }
  }, [data, setHouse, house]);

  // isFallback is true when page is not cached (thus no community/vehicle data)
  if (router.isFallback || community === undefined || tabs === undefined) return <Loader />;

  return (
    <AdminDashboardLayout community={community}>
      <AuthGuard community={community} communityGuard>
        <Head>
          <title>Edit Unit {router.query.unit}</title>
        </Head>
        <DashboardTabbedSection title={`Unit ${router.query.unit}`} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
          {activeTab === 'Tenants' && (
            <TenantsTable key='Tenants' loading={loading} tenants={house?.Users} unit={house?.unit} />
          )}
          {activeTab === 'Vehicles' && (
            <VehiclesTable key='Vehicles' loading={loading} vehicles={house?.Vehicles} />
          )}
          {activeTab === 'Reservations' && (
            <ReservationHistoryTable key='Reservations' reservations={house?.Reservations}/>
          )}
        </DashboardTabbedSection>
      </AuthGuard>
    </AdminDashboardLayout>
  );
}

export const getStaticProps: GetStaticProps<IndexProps, PathProps> = async ({params}) => {
  if (!params) throw new Error('No path parameters found');

  const { site } = params;
  let communityData;

  if (!site) {
    return { notFound: true };
  }

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
      communityData: JSON.stringify(communityData)
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