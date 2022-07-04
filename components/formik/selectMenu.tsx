import { CheckIcon, ExclamationCircleIcon, SelectorIcon } from '@heroicons/react/solid';
import { FC } from 'react';
import { FieldProps } from 'formik';
import { Listbox } from '@headlessui/react';
import ClassNames from 'lib/classNames';

export interface SelectMenu {
  id: string;
  name: string;
}

interface Props {
  name: string;
  label: string;
  items: SelectMenu[];
}

const FormikSelectMenu: FC<FieldProps & Props> = ({ label, items, field, form, ...props }) => {
  const {
    touched,
    errors,
    isSubmitting,
    setFieldTouched,
    setFieldValue } = form;

  return (
    <>
      <Listbox
        {...field}
        value={field.value}
        disabled={isSubmitting}
        onChange={(value) => {
          setFieldValue(field.name, value, true);
          setFieldTouched(field.name, true, true);
        }}
        {...props}
      >
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">{label}</Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button
              className={
                ClassNames(
                  errors[field.name] && touched[field.name]
                    ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400',
                  'relative w-full bg-white border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 sm:text-sm'
                )
              }>

              <span className="block truncate">{(field.value as SelectMenu).name}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {items.map((item) => (
                <Listbox.Option
                  key={item.id}
                  className={({ active }) =>
                    ClassNames(
                      active ? 'text-white bg-blue-600' : 'text-gray-900',
                      'cursor-default select-none relative py-2 pl-8 pr-4'
                    )
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={ClassNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                        {item.name}
                      </span>

                      {selected ? (
                        <span
                          className={ClassNames(
                            active ? 'text-white' : 'text-blue-600',
                            'absolute inset-y-0 left-0 flex items-center pl-1.5'
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>

            {touched[field.name] && errors[field.name] && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            )}
          </div>
        </>
      </Listbox>
      {touched[field.name] && errors[field.name] && (errors[field.name] as any as SelectMenu).id && (
        <>
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {(errors[field.name] as any as SelectMenu).id}
          </p>
        </>
      )}
    </>
  );
};

export default FormikSelectMenu;