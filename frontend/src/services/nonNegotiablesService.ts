import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nonNegotiablesAPI } from '../api';
import type { NonNegotiable } from '../types';
import axios from 'axios';

export interface CreateNonNegotiableData {
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
}

export interface UpdateNonNegotiableData {
  title?: string;
  description?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

const NON_NEGOTIABLES_QUERY_KEY = 'non-negotiables';

/**
 * Custom hook for fetching non-negotiables using TanStack Query
 */
export function useNonNegotiables() {
  return useQuery({
    queryKey: [NON_NEGOTIABLES_QUERY_KEY],
    queryFn: async () => {
      const response = await nonNegotiablesAPI.getAll();
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
 * Custom hook for fetching a single non-negotiable
 */
export function useNonNegotiable(id: number | null) {
  return useQuery({
    queryKey: [NON_NEGOTIABLES_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await nonNegotiablesAPI.getOne(id);
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
 * Custom hook for creating a non-negotiable with optimistic updates
 */
export function useCreateNonNegotiable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNonNegotiableData) => {
      const response = await nonNegotiablesAPI.create(data);
      return response.data;
    },
    onMutate: async (newNonNegotiable) => {
      await queryClient.cancelQueries({ queryKey: [NON_NEGOTIABLES_QUERY_KEY] });
      const previousNonNegotiables = queryClient.getQueryData<NonNegotiable[]>([NON_NEGOTIABLES_QUERY_KEY]);

      if (previousNonNegotiables) {
        const optimisticNonNegotiable: NonNegotiable = {
          id: Math.random() * 1000000,
          ...newNonNegotiable,
          is_binary: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        queryClient.setQueryData<NonNegotiable[]>(
          [NON_NEGOTIABLES_QUERY_KEY],
          [...previousNonNegotiables, optimisticNonNegotiable]
        );
      }

      return { previousNonNegotiables };
    },
    onError: (err, newNonNegotiable, context) => {
      if (context?.previousNonNegotiables) {
        queryClient.setQueryData([NON_NEGOTIABLES_QUERY_KEY], context.previousNonNegotiables);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NON_NEGOTIABLES_QUERY_KEY] });
    },
  });
}

/**
 * Custom hook for updating a non-negotiable with optimistic updates
 */
export function useUpdateNonNegotiable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateNonNegotiableData }) => {
      const response = await nonNegotiablesAPI.update(id, data);
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [NON_NEGOTIABLES_QUERY_KEY] });
      await queryClient.cancelQueries({ queryKey: [NON_NEGOTIABLES_QUERY_KEY, id] });

      const previousNonNegotiables = queryClient.getQueryData<NonNegotiable[]>([NON_NEGOTIABLES_QUERY_KEY]);
      const previousNonNegotiable = queryClient.getQueryData<NonNegotiable>([NON_NEGOTIABLES_QUERY_KEY, id]);

      if (previousNonNegotiables) {
        queryClient.setQueryData<NonNegotiable[]>(
          [NON_NEGOTIABLES_QUERY_KEY],
          previousNonNegotiables.map((nn) =>
            nn.id === id
              ? { ...nn, ...data, updated_at: new Date().toISOString() }
              : nn
          )
        );
      }

      if (previousNonNegotiable) {
        queryClient.setQueryData<NonNegotiable>(
          [NON_NEGOTIABLES_QUERY_KEY, id],
          { ...previousNonNegotiable, ...data, updated_at: new Date().toISOString() }
        );
      }

      return { previousNonNegotiables, previousNonNegotiable };
    },
    onError: (err, { id }, context) => {
      if (context?.previousNonNegotiables) {
        queryClient.setQueryData([NON_NEGOTIABLES_QUERY_KEY], context.previousNonNegotiables);
      }
      if (context?.previousNonNegotiable) {
        queryClient.setQueryData([NON_NEGOTIABLES_QUERY_KEY, id], context.previousNonNegotiable);
      }
    },
    onSuccess: (data, { id }) => {
      queryClient.setQueryData([NON_NEGOTIABLES_QUERY_KEY, id], data);
      queryClient.invalidateQueries({ queryKey: [NON_NEGOTIABLES_QUERY_KEY] });
    },
  });
}

/**
 * Custom hook for deleting a non-negotiable
 */
export function useDeleteNonNegotiable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await nonNegotiablesAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NON_NEGOTIABLES_QUERY_KEY] });
    },
  });
}
