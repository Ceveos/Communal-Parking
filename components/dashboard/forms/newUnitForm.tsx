import * as Yup from 'yup';
import { ADD_HOUSE_MUTATION, AddHouseData, AddHouseVars } from 'lib/mutations/house';
import { Field, Formik } from 'formik';
import { Shape } from 'components/helpers/yup';
import FormikTextbox from 'components/formik/textbox';
import Link from 'next/link';
import Loader from 'components/common/loader';
import client from 'context/ApolloContext';
import router from 'next/router';
import toast from 'react-hot-toast';

interface Props {
}

const NewUnitForm: React.FC<Props> = () => {
  const onAddUnit = async (values: AddHouseVars) => {
    return client.mutate<AddHouseData, AddHouseVars>({
      mutation: ADD_HOUSE_MUTATION,
      variables: values,
      errorPolicy: 'none'
    })
      .then(async ({data, errors}) => {
        if (data) {
          toast.success(`Unit ${values.unit} was successfully added`, {
            position: 'top-right'
          });
          await router.push('/admin/units');
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
        unit: ''
      }}
      onSubmit={(values: AddHouseVars, actions) => {
        actions.setSubmitting(true);
        onAddUnit(values)
          .then(() => {
            actions.setSubmitting(false);
            actions.resetForm();
          });
      }}
      validationSchema={Yup.object<Shape<AddHouseVars>>({
        unit: Yup.string()
          .required('Enter a valid unit')
          .min(1, 'Units need to have at least length 1')
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
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Unit</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-primary-dark-400">Details relating to the new unit</p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-4">
                          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-primary-dark-300">
                            Unit Name
                          </label>
                          <Field
                            name="unit"
                            component={FormikTextbox}
                            disabled={isSubmitting}
                            list="autocompleteOff"
                            placeholder="100"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Loader>

              <div className="flex justify-end">
                <Link href="/admin/units" passHref>
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

export default NewUnitForm;