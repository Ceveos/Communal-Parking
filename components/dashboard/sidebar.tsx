import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { Fragment, SVGProps, useEffect, useState } from 'react';
import { Role } from '@prisma/client';
import { XIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import classNames from 'lib/classNames';

interface SidebarParentItem {
  name: string;
  // eslint-disable-next-line no-unused-vars
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  allowed?: Role[]
}
export interface SidebarLink extends SidebarParentItem {
  type: 'link';
  href: string;
  route: RegExp;
}

export interface SidebarChildLink {
  type: 'childlink';
  name: string;
  href: string;
  route: RegExp;
}

export interface SidebarSection extends SidebarParentItem{
  type: 'section';
  children: SidebarChildLink[];
}

export type SidebarItem = SidebarLink | SidebarSection;

interface Props {
  header: string;
  menuItems: SidebarItem[];
  sidebarOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<Props> = ({ header: name, menuItems, sidebarOpen, setSidebarOpen }) => {
  const [filteredMenuItems, setFilteredMenuItems] = useState<SidebarItem[]>([]);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    setFilteredMenuItems(menuItems.filter(item => {
      if (item.allowed) {
        return item.allowed.indexOf(session?.user.role as Role) !== -1;
      }
      return true;
    }));
  }, [menuItems, session]);

  const isActive = (item: SidebarSection | SidebarChildLink): boolean => {
    if (item.type === 'section') {
      return item.children.some(child => isActive(child));
    } else {
      return item.route.test(router.route);
    }
  };

  return (
    <>
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
            <div className="fixed inset-0 bg-primary-700 bg-opacity-75 dark:bg-primary-dark-900 dark:bg-opacity-75" />
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
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-primary-800 dark:bg-primary-dark-900 dark:border-r-2 dark:border-primary-dark-800">
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
                      <XIcon className="h-6 w-6 text-white dark:text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 flex items-center px-4">
                  <h2 className="text-lg leading-6 font-medium text-white dark:text-white">{name}</h2>
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    {filteredMenuItems.map((item) => {
                      if (item.type === 'section') {
                        return (
                          <Disclosure as="div" key={item.name} defaultOpen={isActive(item)} className="space-y-1">
                            {({ open }) => (
                              <>
                                <Disclosure.Button
                                  className={classNames(
                                    isActive(item)
                                      ? 'bg-primary-900 text-white dark:bg-primary-dark-800 dark:text-white'
                                      : 'text-gray-300 hover:bg-primary-700 hover:text-white dark:hover:bg-primary-dark-700 dark:hover:text-white',
                                    'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-0 focus:ring-accent-500'
                                  )}
                                >
                                  <item.icon
                                    className={classNames(open
                                      ? 'text-gray-300 dark:text-gray-300'
                                      : 'text-gray-400 group-hover:text-gray-300 dark:text-gray-400 dark:group-hover:text-gray-300',
                                    'mr-3 flex-shrink-0 h-6 w-6')}
                                    aria-hidden="true"
                                  />
                                  <span className="flex-1">{item.name}</span>
                                  <svg
                                    className={classNames(
                                      open ? 'text-gray-300 dark:text-gray-300 rotate-90' : 'text-gray-400 group-hover:text-gray-300 dark:text-gray-400 dark:group-hover:text-gray-300',
                                      'ml-3 flex-shrink-0 h-5 w-5 transform transition-colors ease-in-out duration-150'
                                    )}
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                  >
                                    <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                                  </svg>
                                </Disclosure.Button>
                                <Disclosure.Panel className="space-y-1">
                                  {item.children.map((subItem) => (
                                    <Link key={subItem.name} href={subItem.href} >
                                      <a
                                        className={classNames(
                                          isActive(subItem)
                                            ? 'bg-primary-900 text-white dark:bg-primary-dark-800 dark:text-white'
                                            : 'text-gray-300 hover:bg-primary-700 hover:text-white dark:hover:bg-primary-dark-700 dark:hover:text-white',
                                          'group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500'
                                        )}>
                                        {subItem.name}
                                      </a>
                                    </Link>
                                  ))}
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        );
                      } else {
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                          >
                            <a className={classNames(
                              item.route.test(router.route)
                                ? 'bg-primary-900 text-white dark:bg-primary-dark-800 dark:text-white'
                                : 'text-gray-300 hover:bg-primary-700 hover:text-white dark:hover:bg-primary-dark-700 dark:hover:text-white',
                              'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                            )}>
                              <item.icon
                                className={classNames(
                                  item.route.test(router.route) ?
                                    'text-gray-300 dark:text-gray-300' :
                                    'text-gray-400 group-hover:text-gray-300 dark:text-gray-400 dark:group-hover:text-gray-300',
                                  'mr-4 flex-shrink-0 h-6 w-6'
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </a>
                          </Link>
                        );
                      }
                    })}
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
        <div className="flex-1 flex flex-col min-h-0 bg-primary-800 dark:bg-primary-dark-900 dark:border-r-2 dark:border-primary-dark-800">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-900 dark:bg-primary-dark-900">
            <h2 className="text-lg leading-6 font-medium text-white dark:text-white">{name}</h2>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {filteredMenuItems.map(item => {
                if (item.type === 'section') {
                  return (
                    <Disclosure as="div" key={item.name} defaultOpen={isActive(item)} className="space-y-1">
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={classNames(
                              isActive(item)
                                ? 'bg-primary-900 text-white dark:bg-primary-dark-800 dark:text-white'
                                : 'text-gray-300 hover:bg-primary-700 hover:text-white dark:hover:bg-primary-dark-700 dark:hover:text-white',
                              'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-0 focus:ring-accent-500'
                            )}
                          >
                            <item.icon
                              className={classNames(open
                                ? 'text-gray-300 dark:text-gray-300'
                                : 'text-gray-400 group-hover:text-gray-300 dark:text-gray-400 dark:group-hover:text-gray-300',
                              'mr-3 flex-shrink-0 h-6 w-6')}
                              aria-hidden="true"
                            />
                            <span className="flex-1">{item.name}</span>
                            <svg
                              className={classNames(
                                open ? 'text-gray-300 dark:text-gray-300 rotate-90' : 'text-gray-400 group-hover:text-gray-300 dark:text-gray-400 dark:group-hover:text-gray-300',
                                'ml-3 flex-shrink-0 h-5 w-5 transform transition-colors ease-in-out duration-150'
                              )}
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                            </svg>
                          </Disclosure.Button>
                          <Disclosure.Panel className="space-y-1">
                            {item.children.map((subItem) => (
                              <Link key={subItem.name} href={subItem.href} >
                                <a
                                  className={classNames(
                                    isActive(subItem)
                                      ? 'bg-primary-900 text-white dark:bg-primary-dark-800 dark:text-white'
                                      : 'text-gray-300 hover:bg-primary-700 hover:text-white dark:hover:bg-primary-dark-700 dark:hover:text-white',
                                    'group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500'
                                  )}>
                                  {subItem.name}
                                </a>
                              </Link>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  );
                } else {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      passHref
                    >
                      <a className={classNames(
                        item.route.test(router.route) ?
                          'bg-primary-900 dark:bg-primary-dark-800 text-white dark:text-white' :
                          'text-gray-300 hover:bg-primary-700 hover:text-white dark:text-gray-300 dark:hover:bg-primary-dark-700 dark:hover:text-white',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}>
                        <item.icon
                          className={classNames(
                            item.route.test(router.route) ?
                              'text-gray-300 dark:text-gray-300' :
                              'text-gray-400 group-hover:text-gray-300 dark:text-gray-400 dark:group-hover:text-gray-300',
                            'mr-3 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </Link>
                  );
                }
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;