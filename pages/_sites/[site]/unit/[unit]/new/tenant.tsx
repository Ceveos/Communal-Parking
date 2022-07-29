import { MainSiteDashboardLayout } from 'layouts/dashboard';
import { Prisma } from '@prisma/client';
import { prisma } from 'db';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminDashboardLayout from 'layouts/dashboard/adminDashboard';
import AuthGuard from 'components/common/authGuard';
import DashboardSection from 'components/dashboard/section';
import Head from 'next/head';
import Loader from 'components/sites/Loader';
import NewReservationForm from 'components/dashboard/forms/newReservationForm';
import NewTenantForm from 'components/dashboard/forms/newTenantForm';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';
;

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  communityData: string;
}

export default function Index(props: IndexProps) {
  const router = useRouter();
  const [community, setCommunity] = useState<Prisma.CommunityGetPayload<{}>>();

  useEffect(() => {
    if (props.communityData !== undefined && community === undefined) {
      // Community Data is passed in from the server.
      // However, it is not always defined here due to SSR. So ensure it's defined before parsing.
      setCommunity(JSON.parse(props.communityData));
    }
  }, [props.communityData, community]);

  // isFallback is true when page is not cached (thus no community data)
  if (router.isFallback || community === undefined) return <Loader />;

  if (!router.query.unit || typeof(router.query.unit) !== 'string') return null;

  return (
    <AdminDashboardLayout community={community}>
      <Head>
        <title>New Tenant</title>
      </Head>
      <DashboardSection
        title={`New Tenant (Unit ${router.query.unit})`}
      >
        <NewTenantForm communityId={community.id} unit={router.query.unit} />
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