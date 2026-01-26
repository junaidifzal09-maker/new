import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/trpc/router'; // we'll create this file next or soon
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter, any, null>();

export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: '/api/trpc', // this matches your API route
      // headers: () => {
      //   const token = getAuthToken(); // add auth later if needed
      //   return { Authorization: token ? `Bearer ${token}` : '' };
      // },
    }),
  ],
});

// Optional: React Query defaults (good for caching & refetching)
export const trpcReact = trpc.createReactQueryHooks({
  client: trpcClient,
});
