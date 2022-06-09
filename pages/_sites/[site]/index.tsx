import * as Prisma from '@prisma/client';
import { prisma } from 'db';
import { useRouter } from 'next/router';

import Loader from 'components/sites/Loader';
import type { GetServerSideProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  stringifiedData: string;
}

export default function Index({ stringifiedData }: IndexProps) {
  const router = useRouter();

  if (router.isFallback) return <Loader />;

  const community = JSON.parse(stringifiedData) as Prisma.Community;

  return (
    <>
    You are browsing {community.name}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<IndexProps, PathProps> = async ({ params, res }) => {
  if (!params) throw new Error('No path parameters found');

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

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
      stringifiedData: JSON.stringify(communityData),
    }
  };
};
