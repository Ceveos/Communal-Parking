import { signIn } from 'next-auth/react';

interface Props {
}
const Unauthenticated: React.FC<Props> = () => {
  return (
    <div className="py-16">
      <div className="text-center">
        <p className="text-sm font-semibold text-accent-600 dark:text-accent-dark-600 uppercase tracking-wide">Unauthenticated</p>
        <h1 className="mt-2 text-4xl font-extrabold text-primary-900 dark:text-primary-dark-400 tracking-tight sm:text-5xl">Please sign in</h1>
        <p className="mt-2 text-base text-primary-500 dark:text-primary-dark-500">Sorry, only signed in people may view this page</p>
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium
                   text-white bg-accent-600 hover:bg-accent-700
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500
                   dark:text-white dark:bg-accent-dark-900 dark:hover:bg-accent-dark-800
                   dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-offset-2 dark:focus:ring-accent-dark-700"
            onClick={() => signIn()}
          >
              Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthenticated;