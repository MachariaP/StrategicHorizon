import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visionAPI } from '../api';
import type { Vision } from '../types';
import axios from 'axios';

export interface CreateVisionData {
  year: number;
  north_star: string;
  yearly_theme: string;
  time_horizon?: 1 | 3 | 5 | 10;
  five_whys?: string[];
  visual_url?: string;
}

export interface UpdateVisionData {
  north_star?: string;
  yearly_theme?: string;
  time_horizon?: 1 | 3 | 5 | 10;
  five_whys?: string[];
  visual_url?: string;
  is_active?: boolean;
}

const VISION_QUERY_KEY = 'visions';

/**
 * Custom hook for fetching visions using TanStack Query
 */
export function useVisions() {
  return useQuery({
    queryKey: [VISION_QUERY_KEY],
    queryFn: async () => {
      const response = await visionAPI.getAll();
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
 * Custom hook for fetching a single vision
 */
export function useVision(id: number | null) {
  return useQuery({
    queryKey: [VISION_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await visionAPI.getOne(id);
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
 * Custom hook for creating a vision with optimistic updates
 */
export function useCreateVision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVisionData) => {
      const response = await visionAPI.create(data);
      return response.data;
    },
    onMutate: async (newVision) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [VISION_QUERY_KEY] });

      // Snapshot previous value
      const previousVisions = queryClient.getQueryData<Vision[]>([VISION_QUERY_KEY]);

      // Optimistically update with temporary ID
      if (previousVisions) {
        const optimisticVision: Vision = {
          id: Date.now(), // Temporary ID
          ...newVision,
          time_horizon: newVision.time_horizon || 1,
          time_horizon_display: newVision.time_horizon ? `${newVision.time_horizon} Year${newVision.time_horizon > 1 ? 's' : ''}` : '1 Year',
          five_whys: newVision.five_whys || [],
          is_active: true,
          is_deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        queryClient.setQueryData<Vision[]>(
          [VISION_QUERY_KEY],
          [...previousVisions, optimisticVision]
        );
      }

      return { previousVisions };
    },
    onError: (err, newVision, context) => {
      // Rollback on error
      if (context?.previousVisions) {
        queryClient.setQueryData([VISION_QUERY_KEY], context.previousVisions);
      }
    },
    onSuccess: () => {
      // Refetch to get accurate data from server
      queryClient.invalidateQueries({ queryKey: [VISION_QUERY_KEY] });
    },
  });
}

/**
 * Custom hook for updating a vision with optimistic updates
 */
export function useUpdateVision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateVisionData }) => {
      const response = await visionAPI.patch(id, data);
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [VISION_QUERY_KEY] });
      await queryClient.cancelQueries({ queryKey: [VISION_QUERY_KEY, id] });

      // Snapshot previous values
      const previousVisions = queryClient.getQueryData<Vision[]>([VISION_QUERY_KEY]);
      const previousVision = queryClient.getQueryData<Vision>([VISION_QUERY_KEY, id]);

      // Optimistically update visions list
      if (previousVisions) {
        queryClient.setQueryData<Vision[]>(
          [VISION_QUERY_KEY],
          previousVisions.map((vision) =>
            vision.id === id
              ? { ...vision, ...data, updated_at: new Date().toISOString() }
              : vision
          )
        );
      }

      // Optimistically update single vision
      if (previousVision) {
        queryClient.setQueryData<Vision>(
          [VISION_QUERY_KEY, id],
          { ...previousVision, ...data, updated_at: new Date().toISOString() }
        );
      }

      return { previousVisions, previousVision };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousVisions) {
        queryClient.setQueryData([VISION_QUERY_KEY], context.previousVisions);
      }
      if (context?.previousVision) {
        queryClient.setQueryData([VISION_QUERY_KEY, id], context.previousVision);
      }
    },
    onSuccess: (data, { id }) => {
      // Update cache with server response
      queryClient.setQueryData([VISION_QUERY_KEY, id], data);
      queryClient.invalidateQueries({ queryKey: [VISION_QUERY_KEY] });
    },
  });
}

/**
 * Custom hook for deleting a vision
 */
export function useDeleteVision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await visionAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VISION_QUERY_KEY] });
    },
  });
}
