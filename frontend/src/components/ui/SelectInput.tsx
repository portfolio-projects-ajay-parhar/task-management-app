import { SelectHTMLAttributes, useId } from "react";
import { Field, controlClass } from "./Field";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  containerClassName?: string;
}

export const SelectInput = ({
  id,
  label,
  error,
  required,
  options,
  className = "",
  containerClassName = "",
  ...props
}: SelectInputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <Field
      id={inputId}
      label={label}
      required={required}
      error={error}
      className={containerClassName}
    >
      <select
        id={inputId}
        required={required}
        aria-invalid={Boolean(error)}
        className={controlClass({
          error: Boolean(error),
          className,
        })}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
};
