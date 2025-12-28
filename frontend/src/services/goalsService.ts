import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsAPI } from '../api';
import type { Goal } from '../types';
import axios from 'axios';

export interface CreateGoalData {
  vision: number;
  parent_goal?: number | null;
  title: string;
  description: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'stalled';
  strategic_level?: 'high' | 'low';
  confidence_level?: number;
  target_date?: string;
  weight?: number;
}

export interface UpdateGoalData {
  vision?: number;
  parent_goal?: number | null;
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'stalled';
  strategic_level?: 'high' | 'low';
  confidence_level?: number;
  target_date?: string;
  weight?: number;
}

const GOALS_QUERY_KEY = 'goals';

export function useGoals() {
  return useQuery({
    queryKey: [GOALS_QUERY_KEY],
    queryFn: async () => {
      const response = await goalsAPI.getAll();
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

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGoalData) => {
      const response = await goalsAPI.create(data);
      return response.data;
    },
    onMutate: async (newGoal) => {
      await queryClient.cancelQueries({ queryKey: [GOALS_QUERY_KEY] });

      const previousGoals = queryClient.getQueryData<Goal[]>([GOALS_QUERY_KEY]);

      if (previousGoals) {
        const optimisticGoal: Goal = {
          id: Math.random() * 1000000,
          ...newGoal,
          strategic_level: newGoal.strategic_level || 'low',
          status: newGoal.status || 'pending',
          confidence_level: newGoal.confidence_level || 3,
          weight: newGoal.weight || 1.0,
          progress_percentage: 0,
          kpi_count: 0,
          sub_goal_count: 0,
          vision_name: '',
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
      if (context?.previousGoals) {
        queryClient.setQueryData([GOALS_QUERY_KEY], context.previousGoals);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GOALS_QUERY_KEY] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateGoalData }) => {
      const response = await goalsAPI.patch(id, data);
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [GOALS_QUERY_KEY] });
      await queryClient.cancelQueries({ queryKey: [GOALS_QUERY_KEY, id] });

      const previousGoals = queryClient.getQueryData<Goal[]>([GOALS_QUERY_KEY]);
      const previousGoal = queryClient.getQueryData<Goal>([GOALS_QUERY_KEY, id]);

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

      if (previousGoal) {
        queryClient.setQueryData<Goal>(
          [GOALS_QUERY_KEY, id],
          { ...previousGoal, ...data, updated_at: new Date().toISOString() }
        );
      }

      return { previousGoals, previousGoal };
    },
    onError: (err, { id }, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData([GOALS_QUERY_KEY], context.previousGoals);
      }
      if (context?.previousGoal) {
        queryClient.setQueryData([GOALS_QUERY_KEY, id], context.previousGoal);
      }
    },
    onSuccess: (data, { id }) => {
      queryClient.setQueryData([GOALS_QUERY_KEY, id], data);
      queryClient.invalidateQueries({ queryKey: [GOALS_QUERY_KEY] });
    },
  });
}

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

export function useConfidenceMatrix() {
  return useQuery({
    queryKey: ['confidence-matrix'],
    queryFn: async () => {
      const response = await goalsAPI.getConfidenceMatrix();
      return response.data;
    },
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useStrategicGoals() {
  return useQuery({
    queryKey: ['strategic-goals'],
    queryFn: async () => {
      const response = await goalsAPI.getStrategicGoals();
      return response.data.results || [];
    },
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useTacticalGoals() {
  return useQuery({
    queryKey: ['tactical-goals'],
    queryFn: async () => {
      const response = await goalsAPI.getTacticalGoals();
      return response.data.results || [];
    },
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useSubGoals(parentGoalId: number | null) {
  return useQuery({
    queryKey: ['sub-goals', parentGoalId],
    queryFn: async () => {
      if (!parentGoalId) return [];
      const response = await goalsAPI.getSubGoals(parentGoalId);
      return response.data;
    },
    enabled: !!parentGoalId,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
}