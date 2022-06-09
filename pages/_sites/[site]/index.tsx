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

  const data = JSON.parse(stringifiedData) as Prisma.Community;

  console.log(data);
  return (
    <>
    You are browsing {data.name}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<IndexProps, PathProps> = async ({ params, req, res }) => {
  if (!params) throw new Error('No path parameters found');

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  const { site } = params;

  const data = (await prisma.community.findUnique({
    where: {
      subdomain: site,
    }
  })) as Prisma.Community;

  if (!data) return { notFound: true };

  return {
    props: {
      stringifiedData: JSON.stringify(data),
    }
  };
};
