import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary-container text-on-primary-container shadow-elevation-0 hover:shadow-elevation-1",
        secondary:
          "bg-secondary-container text-on-secondary-container shadow-elevation-0 hover:shadow-elevation-1",
        destructive:
          "bg-error-container text-on-error-container shadow-elevation-0 hover:shadow-elevation-1",
        outline:
          "border-2 border-outline bg-surface text-on-surface hover:bg-surface-variant",
        success:
          "bg-tertiary-container text-on-tertiary-container shadow-elevation-0 hover:shadow-elevation-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
