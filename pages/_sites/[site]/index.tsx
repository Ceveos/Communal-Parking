import { GET_CURRENT_RESERVATIONS_QUERY, GetCurrentReservationsData, GetCurrentReservationsVars } from 'lib/queries/reservation';
import { MainSiteDashboardLayout } from 'layouts/dashboard';
import { Prisma } from '@prisma/client';
import { prisma } from 'db';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import DashboardSection from 'components/dashboard/section';
import Loader from 'components/sites/Loader';
import ReservationsTable from 'components/dashboard/reservationTable';
import Stat from 'components/dashboard/stat';
import Stats from 'components/dashboard/stats';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  communityData: string;
}

export type Community = Prisma.CommunityGetPayload<{}>;

export default function Index(props: IndexProps) {
  const router = useRouter();
  const [community, setCommunity] = useState<Community>();
  const [parkingStat, setParkingStat] = useState<string>();
  const [getCurrentReservations, { loading, error, data }] =
    useLazyQuery<GetCurrentReservationsData,GetCurrentReservationsVars>(
      GET_CURRENT_RESERVATIONS_QUERY, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'network-only'
      });

  useEffect(() => {
    if (props.communityData !== undefined && community === undefined) {
      console.log(props.communityData);
      setCommunity(JSON.parse(props.communityData));
    }
  }, [props.communityData, community]);

  useEffect(() => {
    if (community) {
      getCurrentReservations({
        variables: {
          communityId: community.id
        }
      });
    }
  }, [community, getCurrentReservations]);

  useEffect(() => {
    console.log({loading, data, error});
  }, [loading, data, error]);

  useEffect(() => {
    if (community && data?.getCurrentReservations) {
      setParkingStat(`${community.parkingSpaces - data.getCurrentReservations.length}/${community.parkingSpaces}`);
    }
  }, [community, data]);

  if (router.isFallback || community === undefined) return <Loader />;

  return (
    <MainSiteDashboardLayout community={community}>
      <DashboardSection
        title='Parking'
        buttonText='Reserve a spot'
        href='#'
      >
        {/* Stats */}
        <Stats>
          <Stat header='Availability' body={parkingStat} />
        </Stats>

        {/* Table */}
        <ReservationsTable reservations={data?.getCurrentReservations} loading={loading} />
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