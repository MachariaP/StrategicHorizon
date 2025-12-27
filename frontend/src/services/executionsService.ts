import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { executionsAPI } from '../api';
import type { Execution } from '../types';
import axios from 'axios';

export interface CreateExecutionData {
  goal?: number;
  title: string;
  description: string;
  month: number;
  year: number;
  status?: 'planned' | 'in_progress' | 'completed' | 'deferred';
}

export interface UpdateExecutionData {
  goal?: number;
  title?: string;
  description?: string;
  month?: number;
  year?: number;
  status?: 'planned' | 'in_progress' | 'completed' | 'deferred';
}

const EXECUTIONS_QUERY_KEY = 'executions';

/**
 * Custom hook for fetching executions using TanStack Query
 */
export function useExecutions() {
  return useQuery({
    queryKey: [EXECUTIONS_QUERY_KEY],
    queryFn: async () => {
      const response = await executionsAPI.getAll();
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
 * Custom hook for fetching a single execution
 */
export function useExecution(id: number | null) {
  return useQuery({
    queryKey: [EXECUTIONS_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await executionsAPI.getOne(id);
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
 * Custom hook for creating an execution with optimistic updates
 */
export function useCreateExecution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExecutionData) => {
      const response = await executionsAPI.create(data);
      return response.data;
    },
    onMutate: async (newExecution) => {
      await queryClient.cancelQueries({ queryKey: [EXECUTIONS_QUERY_KEY] });
      const previousExecutions = queryClient.getQueryData<Execution[]>([EXECUTIONS_QUERY_KEY]);

      if (previousExecutions) {
        const optimisticExecution: Execution = {
          id: Math.random() * 1000000,
          ...newExecution,
          status: newExecution.status || 'planned',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        queryClient.setQueryData<Execution[]>(
          [EXECUTIONS_QUERY_KEY],
          [...previousExecutions, optimisticExecution]
        );
      }

      return { previousExecutions };
    },
    onError: (err, newExecution, context) => {
      if (context?.previousExecutions) {
        queryClient.setQueryData([EXECUTIONS_QUERY_KEY], context.previousExecutions);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXECUTIONS_QUERY_KEY] });
    },
  });
}

/**
 * Custom hook for updating an execution with optimistic updates
 */
export function useUpdateExecution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateExecutionData }) => {
      const response = await executionsAPI.update(id, data);
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [EXECUTIONS_QUERY_KEY] });
      await queryClient.cancelQueries({ queryKey: [EXECUTIONS_QUERY_KEY, id] });

      const previousExecutions = queryClient.getQueryData<Execution[]>([EXECUTIONS_QUERY_KEY]);
      const previousExecution = queryClient.getQueryData<Execution>([EXECUTIONS_QUERY_KEY, id]);

      if (previousExecutions) {
        queryClient.setQueryData<Execution[]>(
          [EXECUTIONS_QUERY_KEY],
          previousExecutions.map((execution) =>
            execution.id === id
              ? { ...execution, ...data, updated_at: new Date().toISOString() }
              : execution
          )
        );
      }

      if (previousExecution) {
        queryClient.setQueryData<Execution>(
          [EXECUTIONS_QUERY_KEY, id],
          { ...previousExecution, ...data, updated_at: new Date().toISOString() }
        );
      }

      return { previousExecutions, previousExecution };
    },
    onError: (err, { id }, context) => {
      if (context?.previousExecutions) {
        queryClient.setQueryData([EXECUTIONS_QUERY_KEY], context.previousExecutions);
      }
      if (context?.previousExecution) {
        queryClient.setQueryData([EXECUTIONS_QUERY_KEY, id], context.previousExecution);
      }
    },
    onSuccess: (data, { id }) => {
      queryClient.setQueryData([EXECUTIONS_QUERY_KEY, id], data);
      queryClient.invalidateQueries({ queryKey: [EXECUTIONS_QUERY_KEY] });
    },
  });
}

/**
 * Custom hook for deleting an execution
 */
export function useDeleteExecution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await executionsAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXECUTIONS_QUERY_KEY] });
    },
  });
}
