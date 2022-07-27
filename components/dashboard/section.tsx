import Link from 'next/link';

interface ButtonProps {
  buttonText: string;
  href: string;
}
export const DashboardSectionButton: React.FC<ButtonProps> = ({ buttonText, href }) => {
  return (
    <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
      <Link
        href={href}
        passHref
      >
        <a
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium
          text-white bg-accent-600 hover:bg-accent-700
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500
          dark:text-white dark:bg-accent-dark-900 dark:hover:bg-accent-dark-800
          dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-offset-2 dark:focus:ring-accent-dark-700"
        >
          {buttonText}
        </a>
      </Link>
    </div>
  );
};
interface Props {
  title?: string;
  buttonText?: string;
  href?: string;
  children?: React.ReactNode;
}
const DashboardSection: React.FC<Props> = ({ title, buttonText, href, children }) => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="pb-5 border-b border-primary-300 dark:border-primary-dark-700 sm:flex sm:items-center sm:justify-between">
          { title && <h1 className="text-lg leading-6 font-medium text-black dark:text-white">{title}</h1> }
          { buttonText && href && <DashboardSectionButton buttonText={buttonText} href={href} /> }
        </div>
        {children}
      </div>
    </div>
  );
};

export default DashboardSection;