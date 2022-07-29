import { CalendarIcon, HomeIcon, StarIcon } from '@heroicons/react/solid';
import { Reservation } from 'lib/queries/reservation';
import Link from 'next/link';

interface Props {
  reservations?: Reservation[];
  loading: boolean
}

const ReservationsTable: React.FC<Props> = ({reservations}) => {
  return (
    <div className="mt-5 bg-th-foreground dark:bg-th-foreground-dark shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200 dark:divide-y dark:divide-primary-dark-700">
        {reservations && reservations.map((reservation: Reservation) => (
          <li key={reservation.id}>
            <Link
              href={`/vehicle/${reservation.Vehicle.id}`}
              passHref
            >
              <a className="block hover:bg-gray-50 dark:hover:bg-primary-dark-700">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-accent-600 dark:text-accent-dark-300 truncate">{reservation.Vehicle.name}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                bg-green-100 text-green-800
                                dark:bg-green-800 dark:text-green-100">
                      Valid
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500 dark:text-primary-dark-400">
                        <StarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-primary-dark-300" aria-hidden="true" />
                        {reservation.Vehicle.licensePlate}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-primary-dark-400 sm:mt-0 sm:ml-6">
                        <HomeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-primary-dark-300" aria-hidden="true" />
                      Unit {reservation.House.unit}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-primary-dark-400 sm:mt-0">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-primary-dark-300" aria-hidden="true" />
                      <p>
                        Through <time dateTime={reservation.reservedTo}>{new Date(reservation.reservedTo).toLocaleDateString('en-us', {weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC'})}</time>
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationsTable;