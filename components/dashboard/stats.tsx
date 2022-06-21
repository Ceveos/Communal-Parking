export interface Stat {
  name: string;
  stat: string;
}

interface Props {
  stats: Stat[]
}
const Stats: React.FC<Props> = ({ stats }) => {
  return (
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((item) => (
        <div key={item.name} className="px-4 py-5 bg-th-foreground dark:bg-th-foreground-dark shadow rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{item.name}</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{item.stat}</dd>
        </div>
      ))}
    </dl>
  );
};

export default Stats;