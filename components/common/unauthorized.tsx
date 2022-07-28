import Head from 'next/head';
import Link from 'next/link';

interface Props {
  error: string;
}
const Unauthenticated: React.FC<Props> = ({error}) => {
  return (
    <div className="py-16">
      <Head>
        <title>Unauthorized error</title>
      </Head>
      <div className="text-center">
        <p className="text-sm font-semibold text-accent-600 dark:text-accent-dark-600 uppercase tracking-wide">Unauthorized</p>
        <h1 className="mt-2 text-4xl font-extrabold text-primary-900 dark:text-primary-dark-400 tracking-tight sm:text-5xl">Access Denied</h1>
        <p className="mt-2 text-base text-primary-500 dark:text-primary-dark-500">{error}</p>
        <div className="mt-6">
          <Link
            href='/'
            passHref
          >
            <a className="text-base font-medium text-accent-600 hover:text-accent-500 dark:text-accent-dark-600 dark:hover:text-accent-dark-500">
                  Go back home<span aria-hidden="true"> &rarr;</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthenticated;