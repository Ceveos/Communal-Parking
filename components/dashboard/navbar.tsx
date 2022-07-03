import {
  ChevronDownIcon,
  MenuAlt2Icon,
} from '@heroicons/react/outline';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { SearchIcon} from '@heroicons/react/solid';
import { signIn, signOut, useSession } from 'next-auth/react';
import Avatar from 'components/common/avatar';
import classNames from 'lib/classNames';

interface Props {
  // eslint-disable-next-line no-unused-vars
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<Props> = ({setSidebarOpen}) => {
  const { data: session, status } = useSession();

  return (<>
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-primary-dark-900 dark:border-b-2 dark:border-primary-dark-800 shadow">
      <button
        type="button"
        className="px-4 border-r border-gray-200 dark:border-primary-dark-700 text-gray-500 dark:text-gray-300 md:hidden
        focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500
        dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-inset dark:focus:ring-primary-dark-500"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">
          <form className="w-full flex md:ml-0" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">
                  Search License Plate
            </label>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="search-field"
                className="block w-full h-full pl-8 pr-3 py-2 border-transparent
                text-gray-900 placeholder-gray-500 dark:text-white dark:placeholder-gray-500 dark:bg-primary-dark-900
                focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Search License Plate"
                type="search"
                name="search"
              />
            </div>
          </form>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          {/* Profile dropdown */}
          {status === 'unauthenticated' && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium
                   text-white bg-accent-600 hover:bg-accent-700
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500
                   dark:text-white dark:bg-accent-dark-900 dark:hover:bg-accent-dark-800
                   dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-offset-2 dark:focus:ring-accent-dark-700"
              onClick={() => signIn()}
            >
              Sign in
            </button>
          )}
          {status === 'authenticated' && (
            <Menu as="div" className="ml-3 relative">
              <div>
                <Menu.Button className="max-w-xs bg-white dark:bg-primary-dark-900 rounded-full flex items-center text-sm
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500
              dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-offset-2 dark:focus:ring-accent-dark-500
              lg:p-2 lg:rounded-md lg:hover:bg-gray-50 dark:lg:hover:bg-primary-dark-800">
                  <Avatar name={session.user.name} className='h-8 w-8'/>
                  <span className="hidden ml-3 text-gray-700 dark:text-white text-sm font-medium md:block">
                    <span className="sr-only">Open user menu for </span>{session.user.name}
                  </span>
                  <ChevronDownIcon
                    className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 md:block"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1
              bg-white ring-1 ring-black ring-opacity-5 focus:outline-none
              dark:bg-primary-dark-900 dark:ring-1 dark:ring-primary-dark-800 dark:ring-opacity-75 dark:focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button className={classNames(
                        active ? 'bg-gray-100 dark:bg-primary-dark-700' : '',
                        'hover:bg-gray-100 dark:hover:bg-primary-dark-700 block px-4 py-2 text-sm text-gray-700 dark:text-primary-dark-200 w-full text-left'
                      )}
                      onClick={() => signOut()}
                      >
                          Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
      </div>
    </div>
  </>);
};

export default Navbar;

