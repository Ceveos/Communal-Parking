
import * as Prisma from '@prisma/client';
import {
  ChevronDownIcon,
  MenuAlt2Icon,
  XIcon,
} from '@heroicons/react/outline';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Fragment, SVGProps, useState } from 'react';
import { SearchIcon} from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MainSiteDashboardLayout from './mainSiteDashboard';
import classNames from 'lib/classNames';

export interface SidebarLink {
  name: string;
  // eslint-disable-next-line no-unused-vars
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  href: string;
  route: string;
}

interface DashboardLayoutProps {
  community: Prisma.Community;
  sidebar: SidebarLink[];

  children?: React.ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ community, children, sidebar }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  // const { user } = useContext(UserContext);

  return (
    <>
      <div className='bg-gray-100'>
        <div className="min-h-screen">
          <div>
            <Transition.Root show={sidebarOpen} as={Fragment}>
              <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 flex z-40">
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                  >
                    <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                          <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span className="sr-only">Close sidebar</span>
                            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                          </button>
                        </div>
                      </Transition.Child>
                      <div className="flex-shrink-0 flex items-center px-4">
                        <h2 className="text-lg leading-6 font-medium text-white">{community.name}</h2>
                      </div>
                      <div className="mt-5 flex-1 h-0 overflow-y-auto">
                        <nav className="px-2 space-y-1">
                          {sidebar.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                            >
                              <a className={classNames(
                                router.route === item.route
                                  ? 'bg-gray-900 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                              )}>
                                <item.icon
                                  className={classNames(
                                    router.route === item.route ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                                    'mr-4 flex-shrink-0 h-6 w-6'
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                            </Link>
                          ))}
                        </nav>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                  <div className="flex-shrink-0 w-14" aria-hidden="true">
                    {/* Dummy element to force sidebar to shrink to fit close icon */}
                  </div>
                </div>
              </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
                <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
                  <h2 className="text-lg leading-6 font-medium text-white">{community.name}</h2>
                </div>
                <div className="flex-1 flex flex-col overflow-y-auto">
                  <nav className="flex-1 px-2 py-4 space-y-1">
                    {sidebar.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                      >
                        <a className={classNames(
                          router.route === item.route ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                        )}>
                          <item.icon
                            className={classNames(
                              router.route === item.route ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                              'mr-3 flex-shrink-0 h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            <div className="md:pl-64 flex flex-col">
              <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
                <button
                  type="button"
                  className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
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
                          className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                          placeholder="Search License Plate"
                          type="search"
                          name="search"
                        />
                      </div>
                    </form>
                  </div>
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-500">
                            <span className="text-sm font-medium leading-none text-white">AC</span>
                          </span>

                          <span className="hidden ml-3 text-gray-700 text-sm font-medium md:block">
                            <span className="sr-only">Open user menu for </span>Alex Casasola
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
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {sidebar.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  href={item.href}
                                >
                                  <a className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}>
                                    {item.name}
                                  </a>
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
              <main className="flex-1">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
export { MainSiteDashboardLayout };