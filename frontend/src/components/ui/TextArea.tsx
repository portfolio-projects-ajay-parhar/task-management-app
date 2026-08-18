import { TextareaHTMLAttributes, useId } from "react";
import { Field, controlClass } from "./Field";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const TextArea = ({
  id,
  label,
  error,
  required,
  className = "",
  containerClassName = "",
  rows = 3,
  ...props
}: TextAreaProps) => {
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
      <textarea
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        className={controlClass({
          error: Boolean(error),
          className: `resize-none ${className}`,
        })}
        {...props}
      />
    </Field>
  );
};
