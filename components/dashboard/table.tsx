interface TableRowProps {
  title: string;
  content: string | null | undefined;
}
export const TableRow: React.FC<TableRowProps> = ({ title, content }) => {
  if (!content) return null;

  return (
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">{title}</dt>
      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{content}</dd>
    </div>
  );
};
interface Props {
  children?: React.ReactNode;
}
const Table: React.FC<Props> = ({ children }) => {
  return (
    <div className="mt-6 bg-th-foreground dark:bg-th-foreground-dark shadow overflow-hidden sm:rounded-lg">
      <div className="border-t border-gray-200 dark:border-primary-dark-800 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-primary-dark-600">
          {children}
        </dl>
      </div>
    </div>
  );
};

export default Table;