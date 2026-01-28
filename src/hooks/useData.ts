/**
 * Custom Hooks for Data Fetching
 */

import { useState, useEffect, useCallback } from 'react';
import dataService from '../services/dataService';
import type { BaseEntity, ApiError } from '../types';

interface UseDataState<T> {
  data: T[] | null;
  loading: boolean;
  error: ApiError | null;
}

/**
 * Hook for fetching data from API or mock data
 */
export const useData = <T extends BaseEntity>(endpoint: string) => {
  const [state, setState] = useState<UseDataState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await dataService.fetchData<T>(endpoint);
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as ApiError,
      });
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch };
};

/**
 * Hook for fetching a single item
 */
export const useItem = <T extends BaseEntity>(endpoint: string, id: string) => {
  const [state, setState] = useState<UseDataState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchItem = useCallback(async () => {
    if (!id) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState({ data: null, loading: true, error: null });
    try {
      const result = await dataService.fetchItem<T>(endpoint, id);
      setState({ data: [result], loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as ApiError,
      });
    }
  }, [endpoint, id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const refetch = useCallback(() => {
    fetchItem();
  }, [fetchItem]);

  return { ...state, refetch };
};

/**
 * Hook for handling mutations (create, update, delete)
 */
export const useMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(
    async (operation: () => Promise<any>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await operation();
        setLoading(false);
        return result;
      } catch (err) {
        setError(err as ApiError);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { loading, error, mutate, reset };
};
