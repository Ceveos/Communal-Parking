interface Props {
    title: string;
    buttonText: string;
    href: string;
    children?: React.ReactNode;
}

const DashboardSection: React.FC<Props> = ({ title, buttonText, children }) => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <h1 className="text-lg leading-6 font-medium text-gray-900">{title}</h1>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {buttonText}
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DashboardSection;