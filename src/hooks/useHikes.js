import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';

export const useHikes = () => {
  return useQuery({
    queryKey: ['hikes'],
    queryFn: async () => {
      const response = await apiClient.get('/api/hikes');
      return response.data;
    },
    retry: 1,
    staleTime: 300000,
  });
};
