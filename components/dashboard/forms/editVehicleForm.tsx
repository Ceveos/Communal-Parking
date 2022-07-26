import * as Yup from 'yup';
import { EDIT_VEHICLE_MUTATION, EditVehicleData, EditVehicleVars } from 'lib/mutations/vehicle';
import { Field, Formik, FormikProps } from 'formik';
import { Shape } from 'components/helpers/yup';
import { VehicleModified } from 'lib/queries/vehicle';
import FormikCheckbox from 'components/formik/checkbox';
import FormikTextbox from 'components/formik/textbox';
import Link from 'next/link';
import Loader from 'components/common/loader';
import client from 'context/ApolloContext';
import router from 'next/router';
import toast from 'react-hot-toast';

interface Props {
  vehicle: VehicleModified
}

const EditVehicleForm: React.FC<Props> = ({vehicle}) => {
  const onEditVehicle = async (values: EditVehicleVars) => {
    return client.mutate<EditVehicleData,EditVehicleVars>({
      mutation: EDIT_VEHICLE_MUTATION,
      variables: values
    })
      .then(async ({data, errors}) => {
        if (data) {
          toast.success(`${values.name} was successfully updated`, {
            position: 'top-right'
          });
          await router.push('/vehicles');
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
        id: vehicle.id,
        name: vehicle.name,
        description: vehicle.description,
        hidden: vehicle.hidden,
      }}
      onSubmit={(values: EditVehicleVars, actions) => {
        actions.setSubmitting(true);
        onEditVehicle(values)
          .then(() => {
            actions.setSubmitting(false);
            actions.resetForm();
          });
      }}
      validationSchema={Yup.object<Shape<EditVehicleVars>>({
        name: Yup.string()
          .required('Enter a valid car make/model')
          .min(3, 'Name must have at least 3 characters'),
        description: Yup.string().nullable(),
        hidden: Yup.bool().required()
      })}
    >
      {(props: FormikProps<EditVehicleVars>) => {
        const { handleSubmit, isSubmitting } = props;

        return (
          <form onSubmit={handleSubmit} autoComplete='off'>
            <div className="space-y-6 pt-6">
              <Loader loading={isSubmitting}>
                <div className="bg-th-foreground dark:bg-th-foreground-dark shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Vehicle</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-primary-dark-400">Details relating to your vehicle</p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-4">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-primary-dark-300">
                            Nickname
                          </label>
                          <Field
                            name="description"
                            component={FormikTextbox}
                            disabled={isSubmitting}
                            list="autocompleteOff"
                            placeholder="Joe's car"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-primary-dark-300">
                            Vehicle Make/Model
                          </label>
                          <Field name="name"
                            component={FormikTextbox}
                            disabled={isSubmitting}
                            list="autocompleteOff"
                            placeholder="Honda Civic"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full my-12 border-t border-primary-300 dark:border-primary-dark-600" />

                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Visibility</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-primary-dark-400">
                        While vehicles can never be removed (to retain history), you can decide to hide the vehicle so it does not show up on your dashboard.
                      </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-4">
                          <Field
                            name="hidden"
                            type="checkbox"
                            component={FormikCheckbox}
                            disabled={isSubmitting}
                            title="Hide Vehicle"
                            subtitle="Any future parking with this vehicle is still valid"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Loader>

              <div className="flex justify-end">
                <Link href="/vehicles" passHref>
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

export default EditVehicleForm;