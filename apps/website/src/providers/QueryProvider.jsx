import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Create a client
const QueryProvider = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // staleTime: 0 — data is always considered stale.
            // React Query still shows cached data instantly (no blank flash)
            // but always fires a background refetch when a component mounts,
            // so navigating back always shows up-to-date data.
            staleTime: 0,
            gcTime: 5 * 60 * 1000, // keep unused cache for 5 minutes

            refetchOnMount: true,
            refetchOnWindowFocus: true,

            retry: 2,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
