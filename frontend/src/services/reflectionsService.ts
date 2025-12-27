import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reflectionsAPI } from '../api';
import type { QuarterlyReflection } from '../types';
import axios from 'axios';

export interface CreateReflectionData {
  reflection_type: 'weekly' | 'monthly' | 'quarterly';
  year: number;
  quarter?: number;
  month?: number;
  week_number?: number;
  wins: string;
  challenges: string;
  lessons_learned: string;
  adjustments: string;
  gratitude_log?: string;
}

export interface UpdateReflectionData {
  wins?: string;
  challenges?: string;
  lessons_learned?: string;
  adjustments?: string;
  gratitude_log?: string;
}

const REFLECTIONS_QUERY_KEY = 'reflections';

/**
 * Custom hook for fetching reflections using TanStack Query
 */
export function useReflections() {
  return useQuery({
    queryKey: [REFLECTIONS_QUERY_KEY],
    queryFn: async () => {
      const response = await reflectionsAPI.getAll();
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
 * Custom hook for fetching a single reflection
 */
export function useReflection(id: number | null) {
  return useQuery({
    queryKey: [REFLECTIONS_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await reflectionsAPI.getOne(id);
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
 * Custom hook for creating a reflection with optimistic updates
 */
export function useCreateReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReflectionData) => {
      const response = await reflectionsAPI.create(data);
      return response.data;
    },
    onMutate: async (newReflection) => {
      await queryClient.cancelQueries({ queryKey: [REFLECTIONS_QUERY_KEY] });
      const previousReflections = queryClient.getQueryData<QuarterlyReflection[]>([REFLECTIONS_QUERY_KEY]);

      if (previousReflections) {
        const optimisticReflection: QuarterlyReflection = {
          id: Math.random() * 1000000,
          ...newReflection,
          is_locked: false,
          can_edit: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        queryClient.setQueryData<QuarterlyReflection[]>(
          [REFLECTIONS_QUERY_KEY],
          [...previousReflections, optimisticReflection]
        );
      }

      return { previousReflections };
    },
    onError: (err, newReflection, context) => {
      if (context?.previousReflections) {
        queryClient.setQueryData([REFLECTIONS_QUERY_KEY], context.previousReflections);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REFLECTIONS_QUERY_KEY] });
    },
  });
}

/**
 * Custom hook for updating a reflection with optimistic updates
 */
export function useUpdateReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateReflectionData }) => {
      const response = await reflectionsAPI.update(id, data);
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [REFLECTIONS_QUERY_KEY] });
      await queryClient.cancelQueries({ queryKey: [REFLECTIONS_QUERY_KEY, id] });

      const previousReflections = queryClient.getQueryData<QuarterlyReflection[]>([REFLECTIONS_QUERY_KEY]);
      const previousReflection = queryClient.getQueryData<QuarterlyReflection>([REFLECTIONS_QUERY_KEY, id]);

      if (previousReflections) {
        queryClient.setQueryData<QuarterlyReflection[]>(
          [REFLECTIONS_QUERY_KEY],
          previousReflections.map((reflection) =>
            reflection.id === id
              ? { ...reflection, ...data, updated_at: new Date().toISOString() }
              : reflection
          )
        );
      }

      if (previousReflection) {
        queryClient.setQueryData<QuarterlyReflection>(
          [REFLECTIONS_QUERY_KEY, id],
          { ...previousReflection, ...data, updated_at: new Date().toISOString() }
        );
      }

      return { previousReflections, previousReflection };
    },
    onError: (err, { id }, context) => {
      if (context?.previousReflections) {
        queryClient.setQueryData([REFLECTIONS_QUERY_KEY], context.previousReflections);
      }
      if (context?.previousReflection) {
        queryClient.setQueryData([REFLECTIONS_QUERY_KEY, id], context.previousReflection);
      }
    },
    onSuccess: (data, { id }) => {
      queryClient.setQueryData([REFLECTIONS_QUERY_KEY, id], data);
      queryClient.invalidateQueries({ queryKey: [REFLECTIONS_QUERY_KEY] });
    },
  });
}

/**
 * Custom hook for deleting a reflection
 */
export function useDeleteReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await reflectionsAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REFLECTIONS_QUERY_KEY] });
    },
  });
}
