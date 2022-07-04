import * as Yup from 'yup';
import { ADD_VEHICLE_MUTATION, AddVehicleData, AddVehicleVars } from 'lib/mutations/vehicle';
import { Field, Formik, FormikProps } from 'formik';
import { Shape } from 'components/helpers/yup';
import FormikCheckbox from 'components/formik/checkbox';
import FormikTextbox from 'components/formik/textbox';
import Loader from 'components/common/loader';
import client from 'context/ApolloContext';
import router from 'next/router';
import toast from 'react-hot-toast';

interface Props {
}

const NewVehicleForm: React.FC<Props> = () => {
  const onAddVehicle = async (values: AddVehicleVars) => {
    return client.mutate<AddVehicleData,AddVehicleVars>({
      mutation: ADD_VEHICLE_MUTATION,
      variables: values
    })
      .then(async ({data, errors}) => {
        if (data) {
          toast.success(`${values.name} was successfully added`, {
            position: 'top-right'
          });
          await router.push('/vehicles');
        }
        if (errors) {
          console.log('We got an error');
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
        name: '',
        description: '',
        licensePlate: '',
        personalVehicle: false
      }}
      onSubmit={(values: AddVehicleVars, actions) => {
        actions.setSubmitting(true);
        onAddVehicle(values)
          .then(() => {
            actions.setSubmitting(false);
            actions.resetForm();
          });
      }}
      validationSchema={Yup.object<Shape<AddVehicleVars>>({
        name: Yup.string()
          .required('Enter a valid name')
          .min(3, 'Name must have at least 3 characters'),
        description: Yup.string(),
        licensePlate: Yup.string()
          .required('Enter a valid license plate')
          .min(3, 'License Plate must have at least 3 characters'),
        personalVehicle: Yup.bool().required()
      })}
    >
      {(props: FormikProps<AddVehicleVars>) => {
        const { handleSubmit, isSubmitting } = props;

        return (
          <form onSubmit={handleSubmit} autoComplete='off'>
            <div className="space-y-6 pt-6">
              <Loader loading={isSubmitting}>
                <div className="bg-th-foreground dark:bg-th-foreground-dark shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Vehicle</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-primary-dark-400">Details relating to your new vehicle</p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-4">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-primary-dark-300">
                            Vehicle Name
                          </label>
                          <Field name="name" component={FormikTextbox} disabled={isSubmitting} list="autocompleteOff" required/>
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                          <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 dark:text-primary-dark-300">
                            License Plate
                          </label>
                          <Field name="licensePlate" component={FormikTextbox} disabled={isSubmitting} list="autocompleteOff" required/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full my-12 border-t border-primary-300 dark:border-primary-dark-600" />

                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Personal Vehicle</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-primary-dark-400">
                        A personal vehicle is one that the household has posession of</p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-4">
                          <Field
                            name="personalVehicle"
                            type="checkbox"
                            component={FormikCheckbox}
                            disabled={isSubmitting}
                            title="Personal Vehicle"
                            subtitle="All possessed vehicles must be registered"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Loader>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

export default NewVehicleForm;