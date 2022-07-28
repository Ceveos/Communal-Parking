import Link from 'next/link';

interface TableRowProps {
  title: string;
  content: string | null | undefined;
  href?: string;
}
export const TableRow: React.FC<TableRowProps> = ({ title, content, href }) => {
  if (!content) return null;

  return (
    <div className="px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">{title}</dt>
      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
        {href ? (
          <Link
            href={href}
            passHref
          >
            <a className="underline">{content}</a>
          </Link>
        ) : <>{content}</>}
      </dd>
    </div>
  );
};
interface Props {
  children?: React.ReactNode;
}
const Table: React.FC<Props> = ({ children }) => {
  return (
    <div className="mt-6 bg-th-foreground dark:bg-th-foreground-dark shadow overflow-hidden sm:rounded-lg">
      <div className="border-t border-gray-200 dark:border-primary-dark-800">
        <dl className="divide-y divide-gray-200 dark:divide-primary-dark-600">
          {children}
        </dl>
      </div>
    </div>
  );
};

export default Table;