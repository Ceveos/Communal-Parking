import * as Yup from 'yup';
import { ADD_RESERVATION_MUTATION, AddReservationData, AddReservationVars } from 'lib/mutations/reservation';
import { Field, Formik, FormikProps } from 'formik';
import { GET_VEHICLES_QUERY, GetVehiclesData, GetVehiclesVars } from 'lib/queries/housesOnVehicles';
import { Shape } from 'components/helpers/yup';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import FormikSelectMenu, { SelectMenu } from 'components/formik/selectMenu';
import FormikSingleDate from 'components/formik/singleDate';
import Link from 'next/link';
import Loader from 'components/common/loader';
import client from 'context/ApolloContext';
import moment from 'moment';
import router from 'next/router';
import toast from 'react-hot-toast';

interface AddReservationFormVars {
  date: moment.Moment
  vehicle: SelectMenu
}

interface Props {
}

const NewReservationForm: React.FC<Props> = () => {
  const { data: session, status } = useSession();
  const [vehicles, setVehicles] = useState<SelectMenu[]>();
  const [getVehicles, { loading, error, data }] =
    useLazyQuery<GetVehiclesData,GetVehiclesVars>(
      GET_VEHICLES_QUERY, {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'none'
      });

  useEffect(() => {
    // We can only query for vehicles when session is loaded
    if (session?.user.houseId) {
      getVehicles({
        variables: {
          houseId: session.user.houseId,
          showHidden: false
        }
      });
    }
  }, [session, getVehicles]);

  useEffect(() => {
    if (data?.getVehicles) {
      setVehicles(data.getVehicles.map((val) => {
        return {
          id: val.id,
          name: val.description ?
            `${val.description} (${val.name})` :
            `${val.name} (${val.licensePlate})`
        };
      }));
    }
  }, [data]);

  const onAddReservation = async (values: AddReservationFormVars) => {
    if (!values.vehicle || Object.keys(values.vehicle).length === 0) {
      toast.error('No vehicle selected', {position: 'top-right'});
      return;
    }

    return client.mutate<AddReservationData,AddReservationVars>({
      mutation: ADD_RESERVATION_MUTATION,
      variables: {
        date: values.date.utc().startOf('D'),
        vehicleId: values.vehicle.id
      }
    })
      .then(async ({data, errors}) => {
        if (data) {
          toast.success(`${values.vehicle?.name} was successfully reserved`, {
            position: 'top-right'
          });
          await router.push('/reservations');
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
        date: moment().utc(true),
        vehicle: {
          id: '',
          name: 'Select Vehicle'
        }
      }}
      onSubmit={(values: AddReservationFormVars, actions) => {
        console.log('submitting');
        actions.setSubmitting(true);
        onAddReservation(values)
          .then(() => {
            actions.setSubmitting(false);
          });
      }}
      validationSchema={Yup.object<Shape<AddReservationFormVars>>({
        date: Yup.object().required('Valid reservation required'),
        vehicle: Yup.object<Shape<SelectMenu>>({
          id: Yup.string().required('Vehicle selection required').min(1, 'Vehicle selection required')
        }),
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
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Reservation</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-primary-dark-400">Details relating to your vehicle reservation</p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-4">
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-primary-dark-300">
                            Date of reservation
                          </label>
                          <Field
                            id="date"
                            name="date"
                            component={FormikSingleDate}
                            disabled={isSubmitting}
                            isOutsideRange={(day: moment.Moment) => day.isBefore(moment().startOf('day')) || day.isAfter(moment().add(14, 'days'))}
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                          <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 dark:text-primary-dark-300">
                            Vehicle
                          </label>
                          <Field
                            name="vehicle"
                            component={FormikSelectMenu}
                            items={vehicles}
                            disabled={isSubmitting || loading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Loader>

              <div className="flex justify-end">
                <Link href="/reservations" passHref>
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

export default NewReservationForm;