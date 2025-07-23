import { toast } from "react-hot-toast";

// Toast utilities with Material 3 styling
export const notify = {
  success: (message, options = {}) => {
    return toast.success(message, {
      ...options,
      className: "animate-slide-up",
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      ...options,
      className: "animate-slide-up",
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      ...options,
      className: "animate-fade-in",
    });
  },

  promise: (promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || "Loading...",
        success: messages.success || "Success!",
        error: messages.error || "Something went wrong",
      },
      {
        ...options,
        className: "animate-slide-up",
      }
    );
  },

  dismiss: (toastId) => {
    return toast.dismiss(toastId);
  },

  custom: (component, options = {}) => {
    return toast.custom(component, {
      ...options,
      className: "animate-bounce-in",
    });
  },
};

// Format utilities
export const formatters = {
  currency: (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  },

  number: (number, options = {}) => {
    return new Intl.NumberFormat("en-US", options).format(number);
  },

  date: (date, options = {}) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    }).format(new Date(date));
  },

  dateTime: (date, options = {}) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      ...options,
    }).format(new Date(date));
  },

  relativeTime: (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatters.date(date);
  },
};

// Validation utilities
export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  url: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  required: (value) => {
    return value !== null && value !== undefined && value !== "";
  },

  minLength: (value, length) => {
    return value && value.length >= length;
  },

  maxLength: (value, length) => {
    return value && value.length <= length;
  },
};

// Storage utilities (client-side only)
export const storage = {
  get: (key, defaultValue = null) => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: (key, value) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  remove: (key) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },

  clear: () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Class name utility (enhanced)
export const cx = (...classes) => {
  return classes
    .filter(Boolean)
    .map((cls) => (typeof cls === "string" ? cls.trim() : cls))
    .join(" ");
};
