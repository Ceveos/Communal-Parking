import { ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import classNames from 'lib/classNames';

export interface SectionTab {
  name: string;
  href: string;
  route: RegExp;
}

interface Props {
  title: string;
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: any) => void;
  children: React.ReactNode;
}
const DashboardTabbedSection: React.FC<Props> = ({ title, tabs, activeTab, setActiveTab, children }) => {
  const router = useRouter();

  const onSelectMenuChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setActiveTab(e.target.value);
  };

  if (tabs.length <= 0) {
    throw new Error('Tabbed section should contain at least 1 tab');
  }

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="relative pb-5 border-b border-primary-300 dark:border-primary-dark-700 sm:pb-0 mb-4">
        <div className="md:flex md:items-center md:justify-between">
          <h3 className="text-lg leading-6 font-medium text-black dark:text-white">{title}</h3>
          <div className="mt-3 flex md:mt-0 md:absolute md:top-3 md:right-0">
          </div>
        </div>
        <div className="mt-4">
          <div className="sm:hidden">
            <label htmlFor="current-tab" className="sr-only">
            Select a tab
            </label>
            <select
              id="current-tab"
              name="current-tab"
              className="block w-full pl-3 pr-10 py-2 text-base focus:outline-none sm:text-sm rounded-md
              border-primary-300 focus:ring-accent-500 focus:border-accent-500
              dark:border-primary-dark-700  dark:focus:ring-accent-dark-500 dark:focus:border-accent-dark-500"
              defaultValue={tabs.find((tab) => tab === activeTab) ?? 'Select a tab'}
              onChange={onSelectMenuChange}
            >
              {tabs.map((tab) => (
                <option key={tab}>{tab}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={classNames(
                    tab === activeTab
                      ? 'border-accent-500 text-accent-600 hover:text-accent-800 hover:border-accent-700 dark:border-accent-dark-400 dark:text-accent-dark-500 dark:hover:text-accent-dark-400 dark:hover:border-accent-dark-300'
                      : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-600 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-300',
                    'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm'
                  )}
                  aria-current={tab === activeTab ? 'page' : undefined}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default DashboardTabbedSection;