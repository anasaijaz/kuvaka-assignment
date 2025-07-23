import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground rounded-full shadow-elevation-1 hover:shadow-elevation-2 hover:bg-primary/90 active:shadow-elevation-0 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground rounded-full shadow-elevation-1 hover:shadow-elevation-2 hover:bg-destructive/90 active:shadow-elevation-0 active:scale-95",
        outline:
          "border-2 border-outline bg-surface text-on-surface rounded-full shadow-elevation-0 hover:shadow-elevation-1 hover:bg-surface-variant active:bg-surface-variant/80 active:scale-95",
        secondary:
          "bg-secondary-container text-on-secondary-container rounded-full shadow-elevation-1 hover:shadow-elevation-2 hover:bg-secondary-container/80 active:shadow-elevation-0 active:scale-95",
        ghost:
          "rounded-full hover:bg-surface-variant/50 text-on-surface active:bg-surface-variant/80 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline rounded-full px-0 hover:bg-primary/5 active:bg-primary/10",
      },
      size: {
        default: "h-10 px-6 py-2.5",
        sm: "h-8 rounded-full px-4 text-xs",
        lg: "h-12 rounded-full px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
