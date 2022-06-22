interface Props {
  header: string
  body?: string
}
const Stat: React.FC<Props> = ({ header, body }) => {
  return (
    <div className="px-4 py-5 bg-th-foreground dark:bg-th-foreground-dark shadow rounded-lg overflow-hidden sm:p-6">
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{header}</dt>
      <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
        { body || (
          <div className="animate-pulse py-3 bg-gray-300 h-8 w-24 rounded-md "/>
        )}
      </dd>
    </div>
  );
};

export default Stat;