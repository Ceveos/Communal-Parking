import { GET_TENANTS_QUERY, GetTenantsData, GetTenantsVars, HouseTenants } from 'lib/queries/house.tenants';
import { MainSiteDashboardLayout } from 'layouts/dashboard';
import { Modify } from 'lib/FixType';
import { Prisma } from '@prisma/client';
import { Reservation } from 'lib/queries/reservation';
import { prisma } from 'db';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import DashboardSection from 'components/dashboard/section';
import Head from 'next/head';
import Loader from 'components/sites/Loader';
import ModSectionGuard from 'components/common/modSectionGuard';
import ReservationHistoryTable from 'components/dashboard/reservationHistoryTable';
import TenantsTable from 'components/dashboard/tenantsTable';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

interface PathProps extends ParsedUrlQuery {
  site: string;
  id: string;
}

interface IndexProps {
  communityData: string;
  houseData: string;
}

export default function Index(props: IndexProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [community, setCommunity] = useState<Prisma.CommunityGetPayload<{}>>();
  const [house, setHouse] = useState<HouseModified>();
  const [tenants, setTenants] = useState<HouseTenants[]>();
  const [getTenants, { loading, error, data }] =
  useLazyQuery<GetTenantsData,GetTenantsVars>(
    GET_TENANTS_QUERY, {
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
    if (props.houseData !== undefined && house === undefined) {
      // Vehicle Data is passed in from the server.
      // However, it is not always defined here due to SSR. So ensure it's defined before parsing.
      setHouse(JSON.parse(props.houseData));
    }
  }, [props.houseData, house]);

  useEffect(() => {
    // We can only query for vehicles when session is loaded
    if (session?.user.communityId && typeof(router.query.unit) === 'string') {
      getTenants({
        variables: {
          communityId: session?.user.communityId,
          houseUnit: router.query.unit
        }
      });
    }
  }, [session, getTenants, router.query.unit]);

  useEffect(() => {
    if (data?.getTenants && !tenants) {
      setTenants(data.getTenants);
    }
  }, [data, setTenants, tenants]);

  // isFallback is true when page is not cached (thus no community data)
  if (router.isFallback || community === undefined || house === undefined) return <Loader />;

  return (
    <MainSiteDashboardLayout community={community}>
      <Head>
        <title>Unit {house.unit}</title>
      </Head>
      <ModSectionGuard community={community}>
        <DashboardSection title={`Unit ${house.unit} Tenants`} buttonText='Edit' href={`/unit/${house.unit}/edit`}>
          <TenantsTable loading={loading} tenants={tenants} />
        </DashboardSection>
      </ModSectionGuard>
      <DashboardSection title={`Unit ${house.unit} Reservation Log`}>
        <ReservationHistoryTable
          reservations={house.Reservations as unknown as Reservation[]}
          showVehicle
        />
      </DashboardSection>
    </MainSiteDashboardLayout>
  );
}

export const getStaticProps: GetStaticProps<IndexProps, PathProps> = async ({params}) => {
  if (!params) throw new Error('No path parameters found');

  const { site, unit } = params;

  if (typeof unit !== 'string') return { notFound: true };

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

  const houseData: House | null = await prisma.house.findUnique({
    where: {
      communityId_unit: {
        communityId: communityData.id,
        unit: unit
      }
    },
    include: {
      Reservations: {
        orderBy: {
          reservedFrom: 'desc'
        },
        take: 10,
        include: {
          Vehicle: true,
          User: true
        }
      }
    }
  });

  if (!houseData) return { notFound: true };

  return {
    props: {
      communityData: JSON.stringify(communityData),
      houseData: JSON.stringify(houseData)
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

const house = Prisma.validator<Prisma.HouseArgs>()({
  include: {
    Reservations: {
      include: {
        Vehicle: true,
        User: true
      }
    },
  }
});

type House = Prisma.HouseGetPayload<typeof house>
type HouseModified = Modify<
    Prisma.HouseGetPayload<typeof house>,
    { createdAt: string, updatedAt: string }
  >