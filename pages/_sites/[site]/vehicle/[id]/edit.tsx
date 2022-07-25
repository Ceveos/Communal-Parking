import { MainSiteDashboardLayout } from 'layouts/dashboard';
import { Prisma } from '@prisma/client';
import { prisma } from 'db';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AuthGuard from 'components/common/authGuard';
import DashboardSection from 'components/dashboard/section';
import EditVehicleForm from 'components/dashboard/forms/editVehicleForm';
import Loader from 'components/sites/Loader';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  communityData: string;
  vehicleData: string;
}

export default function Index(props: IndexProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [community, setCommunity] = useState<Prisma.CommunityGetPayload<{}>>();
  const [vehicle, setVehicle] = useState<Prisma.VehicleGetPayload<{}>>();

  useEffect(() => {
    if (props.communityData !== undefined && community === undefined) {
      // Community Data is passed in from the server.
      // However, it is not always defined here due to SSR. So ensure it's defined before parsing.
      setCommunity(JSON.parse(props.communityData));
    }
  }, [props.communityData, community]);

  useEffect(() => {
    if (props.vehicleData !== undefined && vehicle === undefined) {
      // Community Data is passed in from the server.
      // However, it is not always defined here due to SSR. So ensure it's defined before parsing.
      setVehicle(JSON.parse(props.vehicleData));
    }
  }, [props.vehicleData, vehicle]);

  // isFallback is true when page is not cached (thus no community/vehicle data)
  if (router.isFallback || community === undefined || vehicle === undefined) return <Loader />;

  return (
    <MainSiteDashboardLayout community={community}>
      <AuthGuard community={community} communityGuard>
        <head>
          <title>Edit Vehicle</title>
        </head>
        <DashboardSection
          title={`Edit Vehicle (${vehicle.licensePlate})`}
        >
          <EditVehicleForm vehicle={vehicle} />
        </DashboardSection>
      </AuthGuard>
    </MainSiteDashboardLayout>
  );
}

export const getServerSideProps: GetStaticProps<IndexProps, PathProps> = async ({params}) => {
  if (!params) throw new Error('No path parameters found');

  const { site, id } = params;
  let communityData;

  if (!site || !id || typeof id !== 'string') {
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

  let vehicleData = await prisma.vehicle.findFirst({
    where: {
      id: id,
      House: {
        communityId: communityData.id
      }
    },
    include: {
      House: true,
      User: true
    }
  });

  if (!vehicleData) return { notFound: true };

  return {
    props: {
      communityData: JSON.stringify(communityData),
      vehicleData: JSON.stringify(vehicleData)
    }
  };
};