import { MainSiteDashboardLayout } from 'layouts/dashboard';
import { Modify } from 'lib/FixType';
import { Prisma } from '@prisma/client';
import { Reservation } from 'lib/queries/reservation';
import { prisma } from 'db';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import DashboardSection from 'components/dashboard/section';
import Head from 'next/head';
import Loader from 'components/sites/Loader';
import ReservationHistoryTable from 'components/dashboard/reservationHistoryTable';
import Table, { TableRow } from 'components/dashboard/table';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

interface PathProps extends ParsedUrlQuery {
  site: string;
  id: string;
}

interface IndexProps {
  communityData: string;
  vehicleData: string;
}

export default function Index(props: IndexProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [community, setCommunity] = useState<Prisma.CommunityGetPayload<{}>>();
  const [vehicle, setVehicle] = useState<VehicleModified>();

  useEffect(() => {
    if (props.communityData !== undefined && community === undefined) {
      // Community Data is passed in from the server.
      // However, it is not always defined here due to SSR. So ensure it's defined before parsing.
      setCommunity(JSON.parse(props.communityData));
    }
  }, [props.communityData, community]);

  useEffect(() => {
    if (props.vehicleData !== undefined && vehicle === undefined) {
      // Vehicle Data is passed in from the server.
      // However, it is not always defined here due to SSR. So ensure it's defined before parsing.
      setVehicle(JSON.parse(props.vehicleData));
    }
  }, [props.vehicleData, vehicle]);

  // isFallback is true when page is not cached (thus no community data)
  if (router.isFallback || community === undefined || vehicle === undefined) return <Loader />;

  const mainSectionForm = () => {
    return (
      <Table>
        <Head>
          <title>Vehicle Details</title>
        </Head>
        {vehicle.houseId === session?.user.houseId && (
          <TableRow title='Nickname' content={vehicle.description} />
        )}
        <TableRow title='Make/Model' content={vehicle.name} />
        <TableRow title='License Plate' content={vehicle.licensePlate} />
        <TableRow title='Associated with' content={`Unit ${vehicle.House?.unit ?? 'N/A'}`} />
        <TableRow title='Added By' content={vehicle.User?.name ?? vehicle.User?.email} />
        <TableRow title='Added On' content={new Date(vehicle.createdAt).toLocaleDateString('en-us', {year: 'numeric', month: 'long', day: '2-digit'})} />
      </Table>
    );
  };

  return (
    <MainSiteDashboardLayout community={community}>
      {session?.user.houseId === vehicle.houseId ? (
        <DashboardSection
          title={vehicle.name}
          buttonText='Edit'
          href={`/vehicle/${vehicle.id}/edit`}
        >
          {mainSectionForm()}
        </DashboardSection>
      ) : (
        <DashboardSection
          title={vehicle.name}
        >
          {mainSectionForm()}
        </DashboardSection>
      )}

      <DashboardSection title='Reservation Log'>
        <ReservationHistoryTable reservations={vehicle.Reservations as unknown as Reservation[]}/>
      </DashboardSection>
    </MainSiteDashboardLayout>
  );
}

export const getStaticProps: GetStaticProps<IndexProps, PathProps> = async ({params}) => {
  if (!params) throw new Error('No path parameters found');

  const { site, id } = params;
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

  const vehicleData: Vehicle | null = await prisma.vehicle.findUnique({
    where: {
      id: id
    },
    include: {
      House: {
        include: {
          Community: true
        }
      },
      Reservations: {
        orderBy: {
          reservedFrom: 'desc'
        },
        take: 10,
        include: {
          House: true,
          User: true
        }
      },
      User: true
    }
  });

  if (!vehicleData) return { notFound: true };

  return {
    props: {
      communityData: JSON.stringify(communityData),
      vehicleData: JSON.stringify(vehicleData)
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

const vehicle = Prisma.validator<Prisma.VehicleArgs>()({
  include: {
    House: {
      include: {
        Community: true
      }
    },
    Reservations: {
      include: {
        House: true,
        User: true
      }
    },
    User: true
  }
});

type Vehicle = Prisma.VehicleGetPayload<typeof vehicle>
type VehicleModified = Modify<
    Prisma.VehicleGetPayload<typeof vehicle>,
    { createdAt: string, updatedAt: string }
  >