import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/src/shared/services/api';
import { UserFilters } from '../types';

export function useUsers(filters: UserFilters) {
  return useInfiniteQuery({
    queryKey: ['users', filters],
    queryFn: ({ pageParam = 1 }) => fetchUsers({ page: pageParam, ...filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If the API returns an empty array, there are no more pages to fetch.
      // This prevents infinite fetching loops, especially during API outages.
      if (!lastPage.results || lastPage.results.length === 0) {
        return undefined;
      }
      return allPages.length + 1;
    },
    staleTime: 1000 * 60 * 5,
  });
}
