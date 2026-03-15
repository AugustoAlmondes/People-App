import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/src/shared/services/api';
import { UserFilters } from '../types';

export function useUsers(filters: UserFilters) {
  return useInfiniteQuery({
    queryKey: ['users', filters],
    queryFn: ({ pageParam = 1 }) => fetchUsers({ page: pageParam, ...filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // randomuser.me doesn't have a strict end, but we can limit or just keep going
      // assuming 20 per page, just increment the page number
      return allPages.length + 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
