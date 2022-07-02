import { useEffect, useState } from 'react';
import ClassNames from 'lib/classNames';

interface Props {
  name: string;
  className: string;
}
const Avatar: React.FC<Props> = ({ name, className }) => {

  const [initials, setInitials] = useState<string>();

  useEffect(() => {
    const newInitials = name.match(/(\b\S)?/g)?.join('')?.match(/(^\S|\S$)?/g)?.join('')?.toUpperCase() ?? '?';

    setInitials(newInitials);
  }, [name]);

  return (
    <span className={ClassNames(className, 'inline-flex items-center justify-center rounded-full bg-gray-500')}>
      <span className="text-sm font-medium leading-none text-white">{initials}</span>
    </span>
  );
};

export default Avatar;