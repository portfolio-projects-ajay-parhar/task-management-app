import {
  InputHTMLAttributes,
  ReactNode,
  useId,
  useState,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import { Field, controlClass } from "./Field";

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  passwordToggle?: boolean;
  containerClassName?: string;
}

export const TextInput = ({
  id,
  label,
  error,
  required,
  leftIcon,
  passwordToggle = false,
  type = "text",
  className = "",
  containerClassName = "",
  ...props
}: TextInputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password" || passwordToggle;
  const resolvedType = isPassword && passwordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <Field
      id={inputId}
      label={label}
      required={required}
      error={error}
      className={containerClassName}
    >
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          type={resolvedType}
          required={required}
          aria-invalid={Boolean(error)}
          className={controlClass({
            error: Boolean(error),
            withLeftIcon: Boolean(leftIcon),
            withRightSlot: passwordToggle,
            className,
          })}
          {...props}
        />
        {passwordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </Field>
  );
};
