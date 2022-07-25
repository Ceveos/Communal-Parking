import { GET_VEHICLES_QUERY, GetVehiclesData, GetVehiclesVars } from 'lib/queries/housesOnVehicles';
import { MainSiteDashboardLayout } from 'layouts/dashboard';
import { Prisma } from '@prisma/client';
import { prisma } from 'db';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AuthGuard from 'components/common/authGuard';
import DashboardSection from 'components/dashboard/section';
import Loader from 'components/sites/Loader';
import Stat from 'components/dashboard/stat';
import Stats from 'components/dashboard/stats';
import VehiclesTable from 'components/dashboard/vehiclesTable';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  communityData: string;
}

export default function Index(props: IndexProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [community, setCommunity] = useState<Prisma.CommunityGetPayload<{}>>();
  const [registeredStat, setRegisteredStat] = useState<string>();
  const [showHidden, setShowHidden] = useState<boolean>(false);
  const [getVehicles, { loading, error, data }] =
    useLazyQuery<GetVehiclesData,GetVehiclesVars>(
      GET_VEHICLES_QUERY, {
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
    // We can only query for vehicles when session is loaded
    if (session?.user.houseId) {
      getVehicles({
        variables: {
          houseId: session.user.houseId,
          showHidden: showHidden
        }
      });
    }
  }, [session, getVehicles, showHidden]);

  useEffect(() => {
    if (data?.getVehicles) {
      setRegisteredStat(`${data.getVehicles.length}`);
    }
  }, [community, data]);

  // isFallback is true when page is not cached (thus no community data)
  if (router.isFallback || community === undefined) return <Loader />;

  return (
    <MainSiteDashboardLayout community={community}>
      <AuthGuard community={community} communityGuard>
        <head>
          <title>My Vehicles</title>
        </head>
        <DashboardSection
          title={showHidden ? 'My Hidden Vehicles' : 'My Vehicles'}
          buttonText='Register New Vehicle'
          href='/vehicles/new'
        >
          {/* Stats */}
          <Stats>
            <Stat header={showHidden ? 'Vehicles Hidden' : 'Vehicles Registered'} body={registeredStat} />
          </Stats>

          {/* Table */}
          <VehiclesTable vehicles={data?.getVehicles} loading={loading} />

          {/* Show hidden vehicles */}
          <div className="flex justify-center py-4" >
            <button disabled={loading} onClick={() => { setShowHidden(!showHidden); }}>
              <p className="text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-dark-400 dark:hover:text-accent-dark-300 truncate">{showHidden ? 'Hide hidden' : 'Show hidden'}</p>
            </button>
          </div>
        </DashboardSection>
      </AuthGuard>
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