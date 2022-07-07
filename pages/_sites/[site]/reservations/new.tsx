import { DateRangePicker, DayPickerRangeController, FocusedInputShape, SingleDatePicker } from 'react-dates';
import { MainSiteDashboardLayout } from 'layouts/dashboard';
import { Prisma } from '@prisma/client';
import { prisma } from 'db';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AuthGuard from 'components/common/authGuard';
import DashboardSection from 'components/dashboard/section';
import Loader from 'components/sites/Loader';
import NewReservationForm from 'components/dashboard/forms/newReservationForm';
import moment from 'moment';import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';
;

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  communityData: string;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);

  result.setDate(result.getDate() + days);
  return result;
}

export default function Index(props: IndexProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [community, setCommunity] = useState<Prisma.CommunityGetPayload<{}>>();
  const [date, setDate] = useState<moment.Moment | null>(moment());
  const [dateFocused, setDateFocused] = useState<boolean>(false);

  useEffect(() => {
    if (props.communityData !== undefined && community === undefined) {
      // Community Data is passed in from the server.
      // However, it is not always defined here due to SSR. So ensure it's defined before parsing.
      setCommunity(JSON.parse(props.communityData));
    }
  }, [props.communityData, community]);

  // isFallback is true when page is not cached (thus no community data)
  if (router.isFallback || community === undefined) return <Loader />;

  return (
    <MainSiteDashboardLayout community={community}>
      <AuthGuard community={community} communityGuard>
        <DashboardSection
          title='New Reservation'
        >
          <NewReservationForm />
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