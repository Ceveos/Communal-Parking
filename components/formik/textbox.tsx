import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { FC } from 'react';
import { FieldProps } from 'formik';
import ClassNames from 'lib/classNames';

const FormikTextbox: FC<FieldProps> = ({ field, form: {touched, errors, isSubmitting}, ...props }) => {
  return (
    <>
      <div className='relative'>
        <input
          {...field}
          {...props}
          type="text"
          disabled={isSubmitting}
          className={
            ClassNames(
              'mt-1 block w-full shadow-sm sm:text-sm rounded-md',
              touched[field.name] && errors[field.name]
                ? 'border-red-500 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                : 'focus:ring-accent-500 focus:border-accent-500 border-gray-300'
            )
          }
          aria-invalid={touched[field.name] && errors[field.name] ? 'true' : 'false'}
          aria-describedby={touched[field.name] && errors[field.name] ? 'game-name-error' : ''}
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

export default FormikTextbox;