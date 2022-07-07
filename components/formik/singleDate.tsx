import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { FC, useState } from 'react';
import { Field, FieldAttributes, FieldProps } from 'formik';
import { SingleDatePicker, SingleDatePickerShape } from 'react-dates';

interface Props {
  children?: React.ReactNode;
}
// eslint-disable-next-line no-unused-vars
const FormikSingleDate: FC<FieldProps & SingleDatePickerShape & Props> = ({ field, form, children, ...props }) => {
  const [dateFocused, setDateFocused] = useState<boolean>(false);
  const {
    touched,
    errors
  } = form;

  return (
    <>
      <div className='relative'>
        <SingleDatePicker
          {...props}
          date={form.values[field.name]}
          onDateChange={date => form.setFieldValue(field.name, date)}
          focused={dateFocused}
          onFocusChange={({ focused }) => setDateFocused(focused)}
          id={field.name}
          disabled={form.isSubmitting}
          numberOfMonths={1}
          // isDayBlocked={(day) => }
          // showDefaultInputIcon
          readOnly
          hideKeyboardShortcutsPanel
          block
        />
        {touched[field.name] && errors[field.name] && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {touched[field.name] && errors[field.name] && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {errors[field.name] as string}
        </p>
      )}
    </>
  );
};

export const SingleDateField: FC<FieldAttributes<any>> = (props) => {
  return (
    <Field
      component={FormikSingleDate}
      {...props}
    />
  );
};

export default FormikSingleDate;