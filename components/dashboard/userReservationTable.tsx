import { CANCEL_RESERVATION_MUTATION, CancelReservationData, CancelReservationVars } from 'lib/mutations/reservation';
import { Reservation } from 'lib/queries/reservation';
import Link from 'next/link';
import client from 'context/ApolloContext';
import toast from 'react-hot-toast';

interface Props {
  reservations?: Reservation[];
  loading: boolean;
  refresh: () => void;
}

const UserReservationsTable: React.FC<Props> = ({reservations, refresh}) => {

  // Cancel reservation
  const onCancelClick = (reservationId: string) => {
    return client.mutate<CancelReservationData,CancelReservationVars>({
      mutation: CANCEL_RESERVATION_MUTATION,
      variables: {
        reservationId: reservationId
      },
      errorPolicy: 'none'
    })
      .then(async ({data, errors}) => {
        if (data) {
          toast.success('Reservation cancelled successfully', {
            position: 'top-right'
          });
          refresh();
        }
        if (errors) {
          errors.forEach((error) => {
            toast.error(error.message, {position: 'top-right'});
          });
          refresh();
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-right'});
        refresh();
      });

  };

  return (
    <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
        <thead className="bg-neutral-50 dark:bg-neutral-700">
          <tr>
            <th
              scope="col"
              className="table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
            >
              Vehicle
            </th>
            <th scope="col" className="table-cell lg:hidden py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
              Reservation
            </th>
            <th scope="col" className="hidden lg:table-cell py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
              Reserved From
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white lg:table-cell"
            >
            Reserved To
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white table-cell"
            />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-y dark:divide-primary-dark-700 bg-th-foreground dark:bg-th-foreground-dark">
          {reservations && reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td className="table-cell px-3 py-4 text-sm text-gray-500 dark:text-primary-dark-300 underline">
                <Link
                  href={`/vehicle/${reservation.Vehicle.id}`}
                  passHref
                >
                  <a>{reservation.Vehicle.licensePlate}</a>
                </Link>
              </td>
              <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm text-gray-500 dark:text-primary-dark-300 sm:w-auto sm:max-w-none sm:pl-6">
                <time dateTime={reservation.reservedFrom}>{new Date(reservation.reservedFrom).toLocaleDateString('en-us', {weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC'})}</time>
                <dl className="font-normal lg:hidden">
                  <dt className="sr-only">Reserved To</dt>
                  <dd className="mt-1 truncate text-gray-500 dark:text-primary-dark-300"><time dateTime={reservation.reservedTo}>{new Date(reservation.reservedTo).toLocaleDateString('en-us', {weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC'})}</time></dd>
                </dl>
              </td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 dark:text-primary-dark-300 lg:table-cell"><time dateTime={reservation.reservedTo}>{new Date(reservation.reservedTo).toLocaleDateString('en-us', {weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC'})}</time></td>
              <td className="px-3 py-4 text-sm table-cell">
                <button
                  className='text-accent-500 hover:text-accent-600 dark:text-accent-dark-500 hover:dark:text-accent-400 hover:underline underline-offset-1'
                  onClick={() => onCancelClick(reservation.id)}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserReservationsTable;