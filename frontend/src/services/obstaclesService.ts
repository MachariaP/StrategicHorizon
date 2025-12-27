import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { obstaclesAPI } from '../api';
import type { Obstacle } from '../types';
import axios from 'axios';

export interface CreateObstacleData {
  goal?: number;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  severity_index?: number;
  mitigation_plan?: string;
  is_blocking?: boolean;
}

export interface UpdateObstacleData {
  goal?: number;
  title?: string;
  description?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  severity_index?: number;
  mitigation_plan?: string;
  is_blocking?: boolean;
}

const OBSTACLES_QUERY_KEY = 'obstacles';

/**
 * Custom hook for fetching obstacles using TanStack Query
 */
export function useObstacles() {
  return useQuery({
    queryKey: [OBSTACLES_QUERY_KEY],
    queryFn: async () => {
      const response = await obstaclesAPI.getAll();
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
 * Custom hook for fetching a single obstacle
 */
export function useObstacle(id: number | null) {
  return useQuery({
    queryKey: [OBSTACLES_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await obstaclesAPI.getOne(id);
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
 * Custom hook for creating an obstacle with optimistic updates
 */
export function useCreateObstacle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateObstacleData) => {
      const response = await obstaclesAPI.create(data);
      return response.data;
    },
    onMutate: async (newObstacle) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [OBSTACLES_QUERY_KEY] });

      // Snapshot previous value
      const previousObstacles = queryClient.getQueryData<Obstacle[]>([OBSTACLES_QUERY_KEY]);

      // Optimistically update with temporary ID
      if (previousObstacles) {
        const optimisticObstacle: Obstacle = {
          id: Math.random() * 1000000,
          ...newObstacle,
          severity_index: newObstacle.severity_index || 5,
          is_blocking: newObstacle.is_blocking || false,
          // Backend has mitigation_plan field with a @property mitigation that returns mitigation_plan
          mitigation: newObstacle.mitigation_plan || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        queryClient.setQueryData<Obstacle[]>(
          [OBSTACLES_QUERY_KEY],
          [...previousObstacles, optimisticObstacle]
        );
      }

      return { previousObstacles };
    },
    onError: (err, newObstacle, context) => {
      // Rollback on error
      if (context?.previousObstacles) {
        queryClient.setQueryData([OBSTACLES_QUERY_KEY], context.previousObstacles);
      }
    },
    onSuccess: () => {
      // Refetch to get accurate data from server
      queryClient.invalidateQueries({ queryKey: [OBSTACLES_QUERY_KEY] });
      // Also invalidate goals to update status if obstacle is critical
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

/**
 * Custom hook for updating an obstacle with optimistic updates
 */
export function useUpdateObstacle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateObstacleData }) => {
      const response = await obstaclesAPI.update(id, data);
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [OBSTACLES_QUERY_KEY] });
      await queryClient.cancelQueries({ queryKey: [OBSTACLES_QUERY_KEY, id] });

      // Snapshot previous values
      const previousObstacles = queryClient.getQueryData<Obstacle[]>([OBSTACLES_QUERY_KEY]);
      const previousObstacle = queryClient.getQueryData<Obstacle>([OBSTACLES_QUERY_KEY, id]);

      // Optimistically update obstacles list
      if (previousObstacles) {
        queryClient.setQueryData<Obstacle[]>(
          [OBSTACLES_QUERY_KEY],
          previousObstacles.map((obstacle) =>
            obstacle.id === id
              ? { ...obstacle, ...data, updated_at: new Date().toISOString() }
              : obstacle
          )
        );
      }

      // Optimistically update single obstacle
      if (previousObstacle) {
        queryClient.setQueryData<Obstacle>(
          [OBSTACLES_QUERY_KEY, id],
          { ...previousObstacle, ...data, updated_at: new Date().toISOString() }
        );
      }

      return { previousObstacles, previousObstacle };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousObstacles) {
        queryClient.setQueryData([OBSTACLES_QUERY_KEY], context.previousObstacles);
      }
      if (context?.previousObstacle) {
        queryClient.setQueryData([OBSTACLES_QUERY_KEY, id], context.previousObstacle);
      }
    },
    onSuccess: (data, { id }) => {
      // Update cache with server response
      queryClient.setQueryData([OBSTACLES_QUERY_KEY, id], data);
      queryClient.invalidateQueries({ queryKey: [OBSTACLES_QUERY_KEY] });
      // Also invalidate goals to update status
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

/**
 * Custom hook for deleting an obstacle
 */
export function useDeleteObstacle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await obstaclesAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OBSTACLES_QUERY_KEY] });
      // Also invalidate goals to update status
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}
