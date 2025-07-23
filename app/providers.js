"use client";

import { SWRConfig } from "swr";
import { Toaster } from "react-hot-toast";
import { fetcher } from "@/lib/fetcher";

// SWR global configuration
const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 1000,
  dedupingInterval: 2000,
  focusThrottleInterval: 5000,
};

// Toast configuration with Material 3 styling
const toastOptions = {
  duration: 4000,
  position: "bottom-right",
  reverseOrder: false,
  gutter: 8,
  containerClassName: "",
  containerStyle: {},
  toastOptions: {
    className: "",
    duration: 4000,
    style: {
      background: "hsl(var(--surface-container-high))",
      color: "hsl(var(--foreground))",
      borderRadius: "24px",
      padding: "16px 20px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow:
        "0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)",
      border: "1px solid hsl(var(--outline-variant))",
      maxWidth: "400px",
    },
    success: {
      duration: 3000,
      style: {
        background: "hsl(var(--success))",
        color: "hsl(var(--success-foreground))",
      },
      iconTheme: {
        primary: "hsl(var(--success-foreground))",
        secondary: "hsl(var(--success))",
      },
    },
    error: {
      duration: 5000,
      style: {
        background: "hsl(var(--destructive))",
        color: "hsl(var(--destructive-foreground))",
      },
      iconTheme: {
        primary: "hsl(var(--destructive-foreground))",
        secondary: "hsl(var(--destructive))",
      },
    },
    loading: {
      style: {
        background: "hsl(var(--info))",
        color: "hsl(var(--info-foreground))",
      },
      iconTheme: {
        primary: "hsl(var(--info-foreground))",
        secondary: "hsl(var(--info))",
      },
    },
  },
};

export function Providers({ children }) {
  return (
    <SWRConfig value={swrConfig}>
      {children}
      <Toaster {...toastOptions} />
    </SWRConfig>
  );
}
