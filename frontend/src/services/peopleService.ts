import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { peopleAPI } from '../api';
import type { Person } from '../types';
import axios from 'axios';

export interface CreatePersonData {
  name: string;
  role: 'mentor' | 'partner' | 'supporter' | 'advisor' | 'other';
  role_description: string;
  contact_info?: string;
  notes?: string;
  relationship_depth?: number;
  last_contact_date?: string;
  frequency_days?: number;
}

export interface UpdatePersonData {
  name?: string;
  role?: 'mentor' | 'partner' | 'supporter' | 'advisor' | 'other';
  role_description?: string;
  contact_info?: string;
  notes?: string;
  relationship_depth?: number;
  last_contact_date?: string;
  frequency_days?: number;
}

const PEOPLE_QUERY_KEY = 'people';

/**
 * Custom hook for fetching people using TanStack Query
 */
export function usePeople() {
  return useQuery({
    queryKey: [PEOPLE_QUERY_KEY],
    queryFn: async () => {
      const response = await peopleAPI.getAll();
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
 * Custom hook for fetching a single person
 */
export function usePerson(id: number | null) {
  return useQuery({
    queryKey: [PEOPLE_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await peopleAPI.getOne(id);
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
 * Custom hook for creating a person with optimistic updates
 */
export function useCreatePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePersonData) => {
      const response = await peopleAPI.create(data);
      return response.data;
    },
    onMutate: async (newPerson) => {
      await queryClient.cancelQueries({ queryKey: [PEOPLE_QUERY_KEY] });
      const previousPeople = queryClient.getQueryData<Person[]>([PEOPLE_QUERY_KEY]);

      if (previousPeople) {
        const optimisticPerson: Person = {
          id: Math.random() * 1000000,
          ...newPerson,
          relationship_depth: newPerson.relationship_depth || 2,
          frequency_days: newPerson.frequency_days || 30,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        queryClient.setQueryData<Person[]>(
          [PEOPLE_QUERY_KEY],
          [...previousPeople, optimisticPerson]
        );
      }

      return { previousPeople };
    },
    onError: (err, newPerson, context) => {
      if (context?.previousPeople) {
        queryClient.setQueryData([PEOPLE_QUERY_KEY], context.previousPeople);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PEOPLE_QUERY_KEY] });
    },
  });
}

/**
 * Custom hook for updating a person with optimistic updates
 */
export function useUpdatePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdatePersonData }) => {
      const response = await peopleAPI.update(id, data);
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [PEOPLE_QUERY_KEY] });
      await queryClient.cancelQueries({ queryKey: [PEOPLE_QUERY_KEY, id] });

      const previousPeople = queryClient.getQueryData<Person[]>([PEOPLE_QUERY_KEY]);
      const previousPerson = queryClient.getQueryData<Person>([PEOPLE_QUERY_KEY, id]);

      if (previousPeople) {
        queryClient.setQueryData<Person[]>(
          [PEOPLE_QUERY_KEY],
          previousPeople.map((person) =>
            person.id === id
              ? { ...person, ...data, updated_at: new Date().toISOString() }
              : person
          )
        );
      }

      if (previousPerson) {
        queryClient.setQueryData<Person>(
          [PEOPLE_QUERY_KEY, id],
          { ...previousPerson, ...data, updated_at: new Date().toISOString() }
        );
      }

      return { previousPeople, previousPerson };
    },
    onError: (err, { id }, context) => {
      if (context?.previousPeople) {
        queryClient.setQueryData([PEOPLE_QUERY_KEY], context.previousPeople);
      }
      if (context?.previousPerson) {
        queryClient.setQueryData([PEOPLE_QUERY_KEY, id], context.previousPerson);
      }
    },
    onSuccess: (data, { id }) => {
      queryClient.setQueryData([PEOPLE_QUERY_KEY, id], data);
      queryClient.invalidateQueries({ queryKey: [PEOPLE_QUERY_KEY] });
    },
  });
}

/**
 * Custom hook for deleting a person
 */
export function useDeletePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await peopleAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PEOPLE_QUERY_KEY] });
    },
  });
}
