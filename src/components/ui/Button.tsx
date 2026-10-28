import React from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "teal" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      href,
      fullWidth = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Determine variant class
    const variantClasses: Record<ButtonVariant, string> = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      teal: "btn-teal",
      ghost: "btn-ghost",
      danger: "btn-danger",
    };

    // Determine size class
    const sizeClasses: Record<ButtonSize, string> = {
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
      icon: "btn-icon",
    };

    const combinedClasses = [
      "btn",
      variantClasses[variant] || "btn-primary",
      sizeClasses[size] || "btn-md",
      fullWidth ? "w-full" : "",
      isLoading ? "relative !text-transparent select-none cursor-wait" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const content = (
      <>
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center text-current">
            <svg
              className="animate-spin h-3.5 w-3.5 text-current opacity-90"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        {!isLoading && leftIcon && (
          <span className="inline-flex shrink-0 items-center justify-center pointer-events-none">
            {leftIcon}
          </span>
        )}
        {children && <span className={isLoading ? "invisible" : ""}>{children}</span>}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0 items-center justify-center pointer-events-none">
            {rightIcon}
          </span>
        )}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={combinedClasses}
          aria-disabled={disabled || isLoading}
          tabIndex={disabled || isLoading ? -1 : undefined}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={combinedClasses}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
