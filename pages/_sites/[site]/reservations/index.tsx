import { GET_CURRENT_HOUSE_RESERVATIONS_QUERY, GetCurrentHouseReservationsVars, GetCurrentReservationsData } from 'lib/queries/reservation';
import { MainSiteDashboardLayout } from 'layouts/dashboard';
import { Prisma } from '@prisma/client';
import { prisma } from 'db';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AuthGuard from 'components/common/authGuard';
import DashboardSection from 'components/dashboard/section';
import Head from 'next/head';
import Loader from 'components/sites/Loader';
import UserReservationsTable from 'components/dashboard/userReservationTable';
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
  const [getReservations, { loading, error, data }] =
    useLazyQuery<GetCurrentReservationsData,GetCurrentHouseReservationsVars>(
      GET_CURRENT_HOUSE_RESERVATIONS_QUERY, {
        fetchPolicy: 'cache-and-network'
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
      getReservations({
        variables: {
          houseId: session.user.houseId
        }
      });
    }
  }, [session, getReservations]);

  // isFallback is true when page is not cached (thus no community data)
  if (router.isFallback || community === undefined) return <Loader />;

  return (
    <MainSiteDashboardLayout community={community}>
      <AuthGuard community={community} communityGuard>
        <Head>
          <title>My Reservations</title>
        </Head>
        <DashboardSection
          title='My Reservations'
          buttonText='New Reservation'
          href='/reservations/new'
        >
          {/* Table */}
          <UserReservationsTable reservations={data?.getCurrentReservations} loading={loading} />
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