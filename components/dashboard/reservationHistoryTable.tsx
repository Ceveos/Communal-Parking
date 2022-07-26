import { Reservation } from 'lib/queries/reservation';

interface Props {
  reservations: Reservation[];
}

const ReservationHistoryTable: React.FC<Props> = ({reservations}) => {
  return (
    <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
        <thead className="bg-neutral-50 dark:bg-neutral-700">
          <tr>
            <th scope="col" className="table-cell md:hidden py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-300 sm:pl-6">
              Reservation
            </th>
            <th scope="col" className="hidden md:table-cell py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-300 sm:pl-6">
              Reserved From
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white md:table-cell"
            >
            Reserved To
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white sm:table-cell"
            >
            Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-y dark:divide-primary-dark-700 bg-th-foreground dark:bg-th-foreground-dark">
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm text-gray-500 dark:text-primary-dark-400 sm:w-auto sm:max-w-none sm:pl-6">
                <time dateTime={reservation.reservedFrom}>{new Date(reservation.reservedFrom).toLocaleDateString('en-us', {weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'})}</time>
                <dl className="font-normal md:hidden">
                  <dt className="sr-only">Reserved To</dt>
                  <dd className="mt-1 truncate text-gray-500 dark:text-primary-dark-400"><time dateTime={reservation.reservedTo}>{new Date(reservation.reservedTo).toLocaleDateString('en-us', {weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'})}</time></dd>
                </dl>
              </td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 dark:text-primary-dark-400 md:table-cell"><time dateTime={reservation.reservedTo}>{new Date(reservation.reservedTo).toLocaleDateString('en-us', {weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'})}</time></td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 dark:text-primary-dark-400 sm:table-cell">Valid</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationHistoryTable;