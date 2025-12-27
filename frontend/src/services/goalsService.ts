import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsAPI } from '../api';
import type { Goal } from '../types';
import axios from 'axios';

export interface CreateGoalData {
  vision: number;
  title: string;
  description: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'stalled';
  confidence_level?: number;
  target_date?: string;
}

export interface UpdateGoalData {
  vision?: number;
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'stalled';
  confidence_level?: number;
  target_date?: string;
}

const GOALS_QUERY_KEY = 'goals';

/**
 * Custom hook for fetching goals using TanStack Query
 */
export function useGoals() {
  return useQuery({
    queryKey: [GOALS_QUERY_KEY],
    queryFn: async () => {
      const response = await goalsAPI.getAll();
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
 * Custom hook for fetching a single goal
 */
export function useGoal(id: number | null) {
  return useQuery({
    queryKey: [GOALS_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await goalsAPI.getOne(id);
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
 * Custom hook for creating a goal with optimistic updates
 */
export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGoalData) => {
      const response = await goalsAPI.create(data);
      return response.data;
    },
    onMutate: async (newGoal) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [GOALS_QUERY_KEY] });

      // Snapshot previous value
      const previousGoals = queryClient.getQueryData<Goal[]>([GOALS_QUERY_KEY]);

      // Optimistically update with temporary ID
      if (previousGoals) {
        const optimisticGoal: Goal = {
          id: Math.random() * 1000000, // Temporary ID (will be replaced by server response)
          ...newGoal,
          status: newGoal.status || 'pending',
          confidence_level: newGoal.confidence_level || 3,
          progress_percentage: 0,
          kpi_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        queryClient.setQueryData<Goal[]>(
          [GOALS_QUERY_KEY],
          [...previousGoals, optimisticGoal]
        );
      }

      return { previousGoals };
    },
    onError: (err, newGoal, context) => {
      // Rollback on error
      if (context?.previousGoals) {
        queryClient.setQueryData([GOALS_QUERY_KEY], context.previousGoals);
      }
    },
    onSuccess: () => {
      // Refetch to get accurate data from server
      queryClient.invalidateQueries({ queryKey: [GOALS_QUERY_KEY] });
    },
  });
}

/**
 * Custom hook for updating a goal with optimistic updates
 */
export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateGoalData }) => {
      const response = await goalsAPI.patch(id, data);
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [GOALS_QUERY_KEY] });
      await queryClient.cancelQueries({ queryKey: [GOALS_QUERY_KEY, id] });

      // Snapshot previous values
      const previousGoals = queryClient.getQueryData<Goal[]>([GOALS_QUERY_KEY]);
      const previousGoal = queryClient.getQueryData<Goal>([GOALS_QUERY_KEY, id]);

      // Optimistically update goals list
      if (previousGoals) {
        queryClient.setQueryData<Goal[]>(
          [GOALS_QUERY_KEY],
          previousGoals.map((goal) =>
            goal.id === id
              ? { ...goal, ...data, updated_at: new Date().toISOString() }
              : goal
          )
        );
      }

      // Optimistically update single goal
      if (previousGoal) {
        queryClient.setQueryData<Goal>(
          [GOALS_QUERY_KEY, id],
          { ...previousGoal, ...data, updated_at: new Date().toISOString() }
        );
      }

      return { previousGoals, previousGoal };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousGoals) {
        queryClient.setQueryData([GOALS_QUERY_KEY], context.previousGoals);
      }
      if (context?.previousGoal) {
        queryClient.setQueryData([GOALS_QUERY_KEY, id], context.previousGoal);
      }
    },
    onSuccess: (data, { id }) => {
      // Update cache with server response
      queryClient.setQueryData([GOALS_QUERY_KEY, id], data);
      queryClient.invalidateQueries({ queryKey: [GOALS_QUERY_KEY] });
    },
  });
}

/**
 * Custom hook for deleting a goal
 */
export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await goalsAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GOALS_QUERY_KEY] });
    },
  });
}
