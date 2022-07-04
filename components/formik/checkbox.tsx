import { FC } from 'react';
import { FieldProps } from 'formik';
import ClassNames from 'lib/classNames';

interface Props {
  title: string;
  subtitle: string;
}
const FormikCheckbox: FC<FieldProps & Props> = ({ field, form: {touched, errors, isSubmitting}, title, subtitle, ...props }) => {
  return (
    <>
      <div className="flex items-start">
        <div className="h-5 flex items-center">
          <input
            {...field}
            {...props}
            id={field.name}
            type="checkbox"
            disabled={isSubmitting}
            className={
              ClassNames(
                'h-4 w-4 rounded',
                touched[field.name] && errors[field.name]
                  ? 'border-red-500 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                  : 'focus:ring-accent-500 text-accent-600 dark:text-accent-dark-600 border-gray-300'
              )
            }
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={field.name} className="font-medium text-gray-900 dark:text-white">
            {title}
          </label>
          <p className="text-gray-500 dark:text-primary-dark-400">{subtitle}</p>
        </div>
      </div>
      {touched[field.name] && errors[field.name] && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {errors[field.name] as string}
        </p>
      )}
    </>
  );
};

export default FormikCheckbox;