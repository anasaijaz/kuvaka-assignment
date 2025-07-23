"use client";

import useSWR, { useSWRInfinite } from "swr";
import useSWRMutation from "swr/mutation";
import { useCallback } from "react";
import { api } from "./fetcher";
import { notify } from "./helpers";

// Enhanced SWR hook with error handling and notifications
export function useApi(key, options = {}) {
  const {
    showErrorToast = false,
    showSuccessToast = false,
    successMessage = "Operation completed successfully",
    errorMessage = "Something went wrong",
    ...swrOptions
  } = options;

  const { data, error, isLoading, isValidating, mutate } = useSWR(key, {
    onError: (error) => {
      if (showErrorToast) {
        const message = error?.response?.data?.message || errorMessage;
        notify.error(message);
      }
      console.error("SWR Error:", error);
    },
    onSuccess: (data) => {
      if (showSuccessToast) {
        notify.success(successMessage);
      }
    },
    ...swrOptions,
  });

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

// Hook for making POST requests with SWR mutation
export function useApiMutation(key, mutationFn, options = {}) {
  const {
    showErrorToast = true,
    showSuccessToast = false,
    showLoadingToast = false,
    successMessage = "Operation completed successfully",
    errorMessage = "Something went wrong",
    loadingMessage = "Processing...",
    onSuccess,
    onError,
    ...swrOptions
  } = options;

  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    key,
    mutationFn,
    {
      onSuccess: (data, key, config) => {
        if (showSuccessToast) {
          notify.success(successMessage);
        }
        onSuccess?.(data, key, config);
      },
      onError: (error, key, config) => {
        if (showErrorToast) {
          const message = error?.response?.data?.message || errorMessage;
          notify.error(message);
        }
        console.error("SWR Mutation Error:", error);
        onError?.(error, key, config);
      },
      ...swrOptions,
    }
  );

  const execute = useCallback(
    async (arg, options = {}) => {
      let toastId;

      if (showLoadingToast) {
        toastId = notify.loading(loadingMessage);
      }

      try {
        const result = await trigger(arg, options);
        if (toastId) notify.dismiss(toastId);
        return result;
      } catch (error) {
        if (toastId) notify.dismiss(toastId);
        throw error;
      }
    },
    [trigger, showLoadingToast, loadingMessage]
  );

  return {
    data,
    error,
    isMutating,
    execute,
    reset,
  };
}

// Specialized hooks for common operations
export function useGet(url, options = {}) {
  return useApi(url, options);
}

export function usePost(url, options = {}) {
  return useApiMutation(
    url,
    async (url, { arg }) => {
      const response = await api.post(url, arg);
      return response.data;
    },
    options
  );
}

export function usePut(url, options = {}) {
  return useApiMutation(
    url,
    async (url, { arg }) => {
      const response = await api.put(url, arg);
      return response.data;
    },
    options
  );
}

export function usePatch(url, options = {}) {
  return useApiMutation(
    url,
    async (url, { arg }) => {
      const response = await api.patch(url, arg);
      return response.data;
    },
    options
  );
}

export function useDelete(url, options = {}) {
  return useApiMutation(
    url,
    async (url, { arg }) => {
      const response = await api.delete(url, arg ? { data: arg } : {});
      return response.data;
    },
    {
      successMessage: "Deleted successfully",
      ...options,
    }
  );
}

// Hook for paginated data
export function usePagination(baseUrl, options = {}) {
  const { page = 1, limit = 10, ...restOptions } = options;
  const url = `${baseUrl}?page=${page}&limit=${limit}`;

  const { data, error, isLoading, mutate } = useApi(url, restOptions);

  return {
    data: data?.data || [],
    meta: data?.meta || { page, limit, total: 0, totalPages: 0 },
    error,
    isLoading,
    mutate,
  };
}

// Hook for infinite loading (scroll pagination)
export function useInfiniteApi(getKey, options = {}) {
  const {
    showErrorToast = false,
    errorMessage = "Failed to load more data",
    ...swrOptions
  } = options;

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite(getKey, {
      onError: (error) => {
        if (showErrorToast) {
          const message = error?.response?.data?.message || errorMessage;
          notify.error(message);
        }
        console.error("SWR Infinite Error:", error);
      },
      ...swrOptions,
    });

  const flatData = data ? data.flat() : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < (options.limit || 10));

  return {
    data: flatData,
    error,
    isLoading,
    isValidating,
    isLoadingMore,
    isEmpty,
    isReachingEnd,
    size,
    setSize,
    mutate,
  };
}
