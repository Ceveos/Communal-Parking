import { PlusCircleIcon } from '@heroicons/react/outline';
import Link from 'next/link';

interface Props {
}

const AddTenantCard: React.FC<Props> = () => {
  return (<>
    <Link href="/unit/J5/add/tenant" passHref>
      <a
        className="relative block w-full h-full border-2 border-primary-300 dark:border-primary-dark-700 border-dashed rounded-lg p-6 text-center hover:border-primary-400 dark:hover:border-primary-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
      >
        <PlusCircleIcon className='mx-auto h-12 w-12 text-primary-400 dark:text-primary-dark-700' />
        <span className="mt-2 block text-lg font-medium text-gray-500 dark:text-primary-dark-700">Add Tenant</span>
      </a>
    </Link>
  </>);
};

export default AddTenantCard;