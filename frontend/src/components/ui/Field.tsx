import { ReactNode } from "react";

interface FieldProps {
  id?: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

export const Field = ({
  id,
  label,
  required,
  error,
  className = "",
  children,
}: FieldProps) => {
  return (
    <div className={`min-w-0 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export const controlClass = ({
  error,
  withLeftIcon,
  withRightSlot,
  className = "",
}: {
  error?: boolean;
  withLeftIcon?: boolean;
  withRightSlot?: boolean;
  className?: string;
}) =>
  [
    "w-full min-w-0 border rounded-lg text-base sm:text-sm",
    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
    "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent",
    "transition disabled:opacity-60 disabled:cursor-not-allowed",
    error
      ? "border-red-300 dark:border-red-500"
      : "border-gray-200 dark:border-gray-700",
    withLeftIcon ? "pl-9 pr-4 py-2.5" : "px-3.5 py-2.5",
    withRightSlot ? "pr-10" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
