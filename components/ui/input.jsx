import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-2xl border-2 border-outline bg-surface px-4 py-3 text-base transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-on-surface placeholder:text-on-surface-variant focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-elevation-1 focus-visible:bg-surface-bright disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-dim md:text-sm hover:border-on-surface-variant",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
