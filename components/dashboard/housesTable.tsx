import { CalendarIcon, UsersIcon } from '@heroicons/react/solid';
import { HouseModified } from 'lib/queries/house';
import Link from 'next/link';

interface Props {
  houses?: HouseModified[];
  loading: boolean
}

const HousesTable: React.FC<Props> = ({houses}) => {

  return (
    <div className="mt-5 bg-th-foreground dark:bg-th-foreground-dark shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200 dark:divide-y dark:divide-primary-dark-700">
        {houses && houses.map((house: HouseModified) => (
          <li key={house.id}>
            <Link
              href={`/unit/${house.unit}`}
              passHref
            >
              <a className="block hover:bg-gray-50 dark:hover:bg-primary-dark-700">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-accent-600 dark:text-accent-dark-300 truncate">Unit {house.unit}</p>
                    {house.Users.length > 0 && (
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                      Occupied
                        </p>
                      </div>
                    )}
                    {house.Users.length === 0 && (
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                      Vacant
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500 dark:text-primary-dark-400">
                        <UsersIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-primary-dark-300" aria-hidden="true" />
                        {house.Users.length}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-primary-dark-400 sm:mt-0">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-primary-dark-300" aria-hidden="true" />
                      <p>
                      Added <time dateTime={house.createdAt}>{new Date(house.createdAt).toLocaleDateString('en-us', {month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'})}</time>
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

export default HousesTable;