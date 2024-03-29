import { forwardRef } from "react";
import Link from "next/link";
import { type IconProp } from "@fortawesome/fontawesome-svg-core";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/utils/tailwind";
import { Loader } from "./Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600",
        outline:
          "bg-transparent border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100",
        subtle:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100",
        ghost:
          "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent",
        link: "bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  iconLeft?: IconProp;
  isLoading?: boolean;
};

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  ButtonBaseProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      children,
      disabled,
      isLoading,
      iconLeft,
      ...props
    },
    ref
  ) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {iconLeft && (
            <FontAwesomeIcon icon={iconLeft} className="mr-2 h-4 w-4" />
          )}
          {children}
        </>
      )}
    </button>
  )
);

export type ButtonLinkProps = React.ComponentPropsWithoutRef<"a"> &
  ButtonBaseProps & {
    href: string;
  };

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, children, iconLeft, ...props }, ref) => (
    <Link
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    >
      {iconLeft && <FontAwesomeIcon icon={iconLeft} className="mr-2 h-4 w-4" />}
      {children}
    </Link>
  )
);
