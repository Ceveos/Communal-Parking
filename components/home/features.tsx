/* This example requires Tailwind CSS v2.0+ */
import {
  ArchiveIcon,
  CloudIcon,
  CogIcon,
  DeviceMobileIcon,
  MoonIcon,
  ShieldCheckIcon,
} from '@heroicons/react/outline';
import { NextPage } from 'next';

const features = [
  {
    name: 'Always available',
    description: 'Prioritizing speed and availability, Communal Parking uses the latest tech available to ensure we\'re here when needed.',
    icon: CloudIcon,
  },
  {
    name: 'Parking Ledger',
    description: 'Easily track the history of parking by user, car, or house! Get complete tracking on parking use.',
    icon: ArchiveIcon,
  },
  {
    name: 'Secure by design',
    description: 'Passwordles authentication, and end-to-end user verification ensures that only members of your community can use the app.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Mobile-friendly',
    description: 'Everything is crafted with care to ensure Communal Parking will work no matter what device your users use.',
    icon: DeviceMobileIcon,
  },
  {
    name: 'Dark Mode',
    description: 'Who said a utility app can\'t look good? Communal Parking adapts to your devices preferred color scheme',
    icon: MoonIcon,
  },
  {
    name: 'Powerful API',
    description: 'Communal Parking can adapt to users needs quickly and easily with its powerful API powered by GraphQL.',
    icon: CogIcon,
  },
];

const Features: NextPage = () => {
  return (
    <div className="relative bg-white py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Everything you need to manage your neighborhood parking
        </p>
        <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
          Batteries-included management portal allows you to define your neighborhood and take control of your parking today.
        </p>
        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-accent-500 p-3 shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">{feature.name}</h3>
                    <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
