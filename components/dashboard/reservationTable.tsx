import { CalendarIcon, HomeIcon, StarIcon } from '@heroicons/react/solid';

export interface Reservation {
  id: number;
  title: string;
  type: string;
  location: string;
  department: string;
  closeDate: string;
  closeDateFull: string;
}

interface Props {
  reservations: Reservation[];
  loading: boolean
}

const ReservationsTable: React.FC<Props> = ({reservations}) => {
  return (
    <div className="mt-5 bg-th-foreground dark:bg-th-foreground-dark shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200 dark:divide-y dark:divide-primary-dark-700">
        {reservations.map((position) => (
          <li key={position.id}>
            <a href="#" className="block hover:bg-gray-50 dark:hover:bg-primary-dark-700">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-accent-600 dark:text-accent-dark-300 truncate">{position.title}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                bg-green-100 text-green-800
                                dark:bg-green-800 dark:text-green-100">
                      {position.type}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 dark:text-primary-dark-400">
                      <StarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-primary-dark-300" aria-hidden="true" />
                      {position.department}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-primary-dark-400 sm:mt-0 sm:ml-6">
                      <HomeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-primary-dark-300" aria-hidden="true" />
                      {position.location}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-primary-dark-400 sm:mt-0">
                    <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-primary-dark-300" aria-hidden="true" />
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
  );
};

export default ReservationsTable;