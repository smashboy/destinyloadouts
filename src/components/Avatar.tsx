import { forwardRef } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/utils/tailwind";

const avatarRootVariants = cva(
  "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        default: "h-10 w-10",
        sm: "w-16 h-16",
        xs: "w-12 h-12",
        xxs: "w-8 h-8",
        lg: "w-32 h-32",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export type AvatarProps = VariantProps<typeof avatarRootVariants> & {
  src: string | null | undefined;
  className?: string;
  fallback: string;
};

const AvatarRoot = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarRootVariants>
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarRootVariants({ size, className }))}
    {...props}
  />
));

const AvatarImage = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));

const AvatarFallback = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700",
      className
    )}
    {...props}
  />
));

export const Avatar: React.FC<AvatarProps> = ({
  src,
  fallback,
  className,
  size,
}) => (
  <AvatarRoot size={size} className={className}>
    <AvatarImage src={src} />
    <AvatarFallback>{fallback.split("")[0] || "U"}</AvatarFallback>
  </AvatarRoot>
);
