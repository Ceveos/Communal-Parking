import * as Yup from 'yup';
import { ADD_TENANT_MUTATION, AddTenantData, AddTenantVars } from 'lib/mutations/house.tenant';
import { Field, Formik } from 'formik';
import { Shape } from 'components/helpers/yup';
import FormikTextbox from 'components/formik/textbox';
import Link from 'next/link';
import Loader from 'components/common/loader';
import client from 'context/ApolloContext';
import router from 'next/router';
import toast from 'react-hot-toast';

interface Props {
  communityId: string;
  unit: string;
}

const NewTenantForm: React.FC<Props> = ({communityId, unit}) => {
  const onAddTenant = async (values: AddTenantVars) => {
    return client.mutate<AddTenantData, AddTenantVars>({
      mutation: ADD_TENANT_MUTATION,
      variables: values
    })
      .then(async ({data, errors}) => {
        if (data) {
          toast.success(`${values.name} was successfully added to Unit ${values.unit}`, {
            position: 'top-right'
          });
          await router.push(`/unit/${values.unit}/edit`);
        }
        if (errors) {
          errors.forEach((error) => {
            toast.error(error.message, {position: 'top-right'});
          });
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-right'});
      });

  };

  return (
    <Formik
      initialValues={{
        communityId: communityId,
        unit: unit,
        name: '',
        email: ''
      }}
      onSubmit={(values: AddTenantVars, actions) => {
        actions.setSubmitting(true);
        onAddTenant(values)
          .then(() => {
            actions.setSubmitting(false);
            actions.resetForm();
          });
      }}
      validationSchema={Yup.object<Shape<AddTenantVars>>({
        name: Yup.string()
          .required('Enter a valid name')
          .min(3, 'Names need to have at least 3 characters'),
        email: Yup.string()
          .required('Please enter an email')
          .email('Please enter a valid email')
      })}
    >
      {props => {
        const { handleSubmit, isSubmitting } = props;

        return (
          <form onSubmit={handleSubmit} autoComplete='off'>
            <div className="space-y-6 pt-6">
              <Loader loading={isSubmitting}>
                <div className="bg-th-foreground dark:bg-th-foreground-dark shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Tenant</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-primary-dark-400">Details relating to the new tenant</p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-4">
                          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-primary-dark-300">
                            Tenant Name
                          </label>
                          <Field
                            name="name"
                            component={FormikTextbox}
                            disabled={isSubmitting}
                            list="autocompleteOff"
                            placeholder="Joe"
                            required
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-primary-dark-300">
                            Tenant Email
                          </label>
                          <Field
                            name="email"
                            component={FormikTextbox}
                            disabled={isSubmitting}
                            list="autocompleteOff"
                            placeholder="joesmith@gmail.com"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Loader>

              <div className="flex justify-end">
                <Link href={`/unit/${unit}/edit`} passHref>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                  >
                  Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        );}}
    </Formik>
  );
};

export default NewTenantForm;