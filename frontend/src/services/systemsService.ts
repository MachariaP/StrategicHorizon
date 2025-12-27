import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { systemsAPI } from '../api';
import type { System } from '../types';
import axios from 'axios';

export interface CreateSystemData {
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  input_definition?: string;
  output_kpi_link?: string;
  last_execution_date?: string;
}

export interface UpdateSystemData {
  name?: string;
  description?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  input_definition?: string;
  output_kpi_link?: string;
  last_execution_date?: string;
}

const SYSTEMS_QUERY_KEY = 'systems';

/**
 * Custom hook for fetching systems using TanStack Query
 */
export function useSystems() {
  return useQuery({
    queryKey: [SYSTEMS_QUERY_KEY],
    queryFn: async () => {
      const response = await systemsAPI.getAll();
      return response.data.results || [];
    },
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Custom hook for fetching a single system
 */
export function useSystem(id: number | null) {
  return useQuery({
    queryKey: [SYSTEMS_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await systemsAPI.getOne(id);
      return response.data;
    },
    enabled: !!id,
    retry: (failureCount, error) => {
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
 * Custom hook for creating a system with optimistic updates
 */
export function useCreateSystem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSystemData) => {
      const response = await systemsAPI.create(data);
      return response.data;
    },
    onMutate: async (newSystem) => {
      await queryClient.cancelQueries({ queryKey: [SYSTEMS_QUERY_KEY] });
      const previousSystems = queryClient.getQueryData<System[]>([SYSTEMS_QUERY_KEY]);

      if (previousSystems) {
        const optimisticSystem: System = {
          id: Math.random() * 1000000,
          ...newSystem,
          health_status: 'unknown',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        queryClient.setQueryData<System[]>(
          [SYSTEMS_QUERY_KEY],
          [...previousSystems, optimisticSystem]
        );
      }

      return { previousSystems };
    },
    onError: (err, newSystem, context) => {
      if (context?.previousSystems) {
        queryClient.setQueryData([SYSTEMS_QUERY_KEY], context.previousSystems);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SYSTEMS_QUERY_KEY] });
    },
  });
}

/**
 * Custom hook for updating a system with optimistic updates
 */
export function useUpdateSystem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateSystemData }) => {
      const response = await systemsAPI.update(id, data);
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [SYSTEMS_QUERY_KEY] });
      await queryClient.cancelQueries({ queryKey: [SYSTEMS_QUERY_KEY, id] });

      const previousSystems = queryClient.getQueryData<System[]>([SYSTEMS_QUERY_KEY]);
      const previousSystem = queryClient.getQueryData<System>([SYSTEMS_QUERY_KEY, id]);

      if (previousSystems) {
        queryClient.setQueryData<System[]>(
          [SYSTEMS_QUERY_KEY],
          previousSystems.map((system) =>
            system.id === id
              ? { ...system, ...data, updated_at: new Date().toISOString() }
              : system
          )
        );
      }

      if (previousSystem) {
        queryClient.setQueryData<System>(
          [SYSTEMS_QUERY_KEY, id],
          { ...previousSystem, ...data, updated_at: new Date().toISOString() }
        );
      }

      return { previousSystems, previousSystem };
    },
    onError: (err, { id }, context) => {
      if (context?.previousSystems) {
        queryClient.setQueryData([SYSTEMS_QUERY_KEY], context.previousSystems);
      }
      if (context?.previousSystem) {
        queryClient.setQueryData([SYSTEMS_QUERY_KEY, id], context.previousSystem);
      }
    },
    onSuccess: (data, { id }) => {
      queryClient.setQueryData([SYSTEMS_QUERY_KEY, id], data);
      queryClient.invalidateQueries({ queryKey: [SYSTEMS_QUERY_KEY] });
    },
  });
}

/**
 * Custom hook for deleting a system
 */
export function useDeleteSystem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await systemsAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SYSTEMS_QUERY_KEY] });
    },
  });
}
