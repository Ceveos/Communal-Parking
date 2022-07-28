import { GET_HOUSES_QUERY, GetHousesData, GetHousesVars } from 'lib/queries/house';
import { Prisma } from '@prisma/client';
import { prisma } from 'db';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import AdminDashboardLayout from 'layouts/dashboard/adminDashboard';
import DashboardSection from 'components/dashboard/section';
import Head from 'next/head';
import HousesTable from 'components/dashboard/housesTable';
import Loader from 'components/sites/Loader';
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

export default function Index(props: IndexProps) {
  const router = useRouter();
  const [community, setCommunity] = useState<Prisma.CommunityGetPayload<{}>>();
  const [registeredStat, setRegisteredStat] = useState<string>();
  const [vacantStat, setVacantStat] = useState<string>();
  const [getHouses, { loading, error, data }] =
    useLazyQuery<GetHousesData, GetHousesVars>(
      GET_HOUSES_QUERY, {
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
    if (community?.id) {
      getHouses({
        variables: {
          communityId: community.id,
        }
      });
    }
  }, [community, getHouses]);

  useEffect(() => {
    if (data?.getHouses) {
      setRegisteredStat(`${data.getHouses.length}`);
      setVacantStat(`${data.getHouses.filter(house => house.Users.length === 0).length}`);
    }
  }, [data]);

  // isFallback is true when page is not cached (thus no community data)
  if (router.isFallback || community === undefined) return <Loader />;

  return (
    <AdminDashboardLayout community={community}>
      <Head>
        <title>{community.name} Units</title>
      </Head>
      <DashboardSection
        title={'Units'}
        buttonText='Add Unit'
        href='/admin/units/new'
      >
        {/* Stats */}
        <Stats>
          <Stat header={'Registered Units'} body={registeredStat} />
          <Stat header={'Vacant Units'} body={vacantStat} />
        </Stats>

        {/* Table */}
        <HousesTable houses={data?.getHouses} loading={loading} />
      </DashboardSection>
    </AdminDashboardLayout>
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