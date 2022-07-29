import { HouseTenants} from 'lib/queries/house.tenants';
import { MailIcon } from '@heroicons/react/solid';
import AddTenantCard from './addTenantCard';

interface Props {
  tenants?: HouseTenants[];
  loading: boolean
  unit?: string;
}

const TenantsTable: React.FC<Props> = ({tenants, unit}) => {

  return (
    <ul role="list" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
      {tenants && tenants.map((tenant) => (
        <li key={tenant.email} className="col-span-1 bg-th-foreground dark:bg-th-foreground-dark rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-600">
          <div className="w-full flex items-center justify-between align-top p-6 space-x-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="text-primary-900 dark:text-white text-sm font-medium truncate">{tenant.name ?? '(no name)'}</h3>
                {/* <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                  {tenant.role}
                </span> */}
              </div>
              <p className="mt-1 text-primary-500 dark:text-gray-400 text-sm truncate">{tenant.email}</p>
            </div>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="w-0 flex-1 flex">
                <a
                  href={`mailto:${tenant.email}`}
                  className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 dark:text-gray-300 font-medium border border-transparent rounded-bl-lg hover:text-gray-500 dark:hover:text-gray-100"
                >
                  <MailIcon className="w-5 h-5 text-gray-400 dark:text-gray-300" aria-hidden="true" />
                  <span className="ml-3">Email</span>
                </a>
              </div>
            </div>
          </div>
        </li>
      ))}
      {unit && (
        <AddTenantCard unit={unit} />
      )}
    </ul>
  );
};

export default TenantsTable;