import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kpisAPI } from '../api';
import type { KPI } from '../types';
import axios from 'axios';

export interface CreateKPIData {
  goal: number;
  name: string;
  description?: string;
  current_value: number;
  target_value: number;
  unit: string;
  trend_data?: Array<{ date: string; value: number }>;
}

export interface UpdateKPIData {
  goal?: number;
  name?: string;
  description?: string;
  current_value?: number;
  target_value?: number;
  unit?: string;
  trend_data?: Array<{ date: string; value: number }>;
}

const KPIS_QUERY_KEY = 'kpis';

/**
 * Custom hook for fetching KPIs using TanStack Query
 */
export function useKPIs() {
  return useQuery({
    queryKey: [KPIS_QUERY_KEY],
    queryFn: async () => {
      const response = await kpisAPI.getAll();
      return response.data.results || [];
    },
    retry: (failureCount, error) => {
      // Don't retry on 401 (Unauthorized)
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Custom hook for fetching a single KPI
 */
export function useKPI(id: number | null) {
  return useQuery({
    queryKey: [KPIS_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await kpisAPI.getOne(id);
      return response.data;
    },
    enabled: !!id,
    retry: (failureCount, error) => {
      // Don't retry on 401 or 404
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 404) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
}

/**
 * Custom hook for creating a KPI with optimistic updates
 */
export function useCreateKPI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateKPIData) => {
      const response = await kpisAPI.create(data);
      return response.data;
    },
    onMutate: async (newKPI) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [KPIS_QUERY_KEY] });

      // Snapshot previous value
      const previousKPIs = queryClient.getQueryData<KPI[]>([KPIS_QUERY_KEY]);

      // Optimistically update with temporary ID
      if (previousKPIs) {
        const optimisticKPI: KPI = {
          id: Math.random() * 1000000, // Temporary ID (will be replaced by server response)
          ...newKPI,
          progress_percentage: newKPI.target_value > 0 
            ? Math.min((newKPI.current_value / newKPI.target_value) * 100, 100) 
            : 0,
          actual_value: newKPI.current_value,
          trend_data: newKPI.trend_data || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        queryClient.setQueryData<KPI[]>(
          [KPIS_QUERY_KEY],
          [...previousKPIs, optimisticKPI]
        );
      }

      return { previousKPIs };
    },
    onError: (err, newKPI, context) => {
      // Rollback on error
      if (context?.previousKPIs) {
        queryClient.setQueryData([KPIS_QUERY_KEY], context.previousKPIs);
      }
    },
    onSuccess: () => {
      // Refetch to get accurate data from server
      queryClient.invalidateQueries({ queryKey: [KPIS_QUERY_KEY] });
      // Also invalidate goals to update progress
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

/**
 * Custom hook for updating a KPI with optimistic updates
 */
export function useUpdateKPI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateKPIData }) => {
      const response = await kpisAPI.update(id, data);
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [KPIS_QUERY_KEY] });
      await queryClient.cancelQueries({ queryKey: [KPIS_QUERY_KEY, id] });

      // Snapshot previous values
      const previousKPIs = queryClient.getQueryData<KPI[]>([KPIS_QUERY_KEY]);
      const previousKPI = queryClient.getQueryData<KPI>([KPIS_QUERY_KEY, id]);

      // Optimistically update KPIs list
      if (previousKPIs) {
        queryClient.setQueryData<KPI[]>(
          [KPIS_QUERY_KEY],
          previousKPIs.map((kpi) =>
            kpi.id === id
              ? { ...kpi, ...data, updated_at: new Date().toISOString() }
              : kpi
          )
        );
      }

      // Optimistically update single KPI
      if (previousKPI) {
        queryClient.setQueryData<KPI>(
          [KPIS_QUERY_KEY, id],
          { ...previousKPI, ...data, updated_at: new Date().toISOString() }
        );
      }

      return { previousKPIs, previousKPI };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousKPIs) {
        queryClient.setQueryData([KPIS_QUERY_KEY], context.previousKPIs);
      }
      if (context?.previousKPI) {
        queryClient.setQueryData([KPIS_QUERY_KEY, id], context.previousKPI);
      }
    },
    onSuccess: (data, { id }) => {
      // Update cache with server response
      queryClient.setQueryData([KPIS_QUERY_KEY, id], data);
      queryClient.invalidateQueries({ queryKey: [KPIS_QUERY_KEY] });
      // Also invalidate goals to update progress
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

/**
 * Custom hook for deleting a KPI
 */
export function useDeleteKPI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await kpisAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KPIS_QUERY_KEY] });
      // Also invalidate goals to update progress
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}
