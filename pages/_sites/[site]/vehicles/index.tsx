import * as Prisma from '@prisma/client';
import { prisma } from 'db';
import { useRouter } from 'next/router';

import { CalendarIcon, HomeIcon, StarIcon } from '@heroicons/react/solid';
import { MainSiteDashboardLayout } from 'layouts/dashboard';
import Loader from 'components/sites/Loader';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

const stats = [
  { name: 'Spots available', stat: '8/10' }
];

const positions = [
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

export default function Index({ communityData: stringifiedData }: IndexProps) {
  const router = useRouter();

  if (router.isFallback) return <Loader />;
  console.log(router);
  const community = JSON.parse(stringifiedData) as Prisma.Community;

  return (
    <MainSiteDashboardLayout community={community}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Replace with your content */}
          <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
            <h1 className="text-lg leading-6 font-medium text-gray-900">Vehicles</h1>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
          Register new vehicle
              </button>
            </div>
          </div>

          {/* Stats */}
          <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.name} className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{item.stat}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Table */}
          <div className="mt-5 bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {positions.map((position) => (
                <li key={position.id}>
                  <a href="#" className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">{position.title}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {position.type}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <StarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            {position.department}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <HomeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            {position.location}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                          <p>
                      Valid until <time dateTime={position.closeDate}>{position.closeDateFull}</time>
                          </p>
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* /End replace */}
        </div>
      </div>
    </MainSiteDashboardLayout>
  );
}

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  communityData: string;
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
    revalidate: 10
  };
};

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  return {
    paths: [],
    fallback: true
  };
};