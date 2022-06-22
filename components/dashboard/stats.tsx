export interface Stat {
  name: string;
  stat: string;
}

interface Props {
  children?: React.ReactNode;
}
const Stats: React.FC<Props> = ({ children }) => {
  return (
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      {children}
    </dl>
  );
};

export default Stats;