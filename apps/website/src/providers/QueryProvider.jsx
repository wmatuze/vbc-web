import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Create a client
const QueryProvider = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 60 seconds.  After that, navigating
            // back to a page or re-mounting its component triggers a background
            // refetch while the cached (stale) data is shown immediately so
            // there is never a blank-screen flash.
            staleTime: 60 * 1000, // 60 seconds
            gcTime: 5 * 60 * 1000, // keep unused cache for 5 minutes

            // Always re-fetch when a component mounts (e.g. navigating back).
            // Because staleTime is set, React Query shows cached data instantly
            // and fetches in the background — no blank flash.
            refetchOnMount: true,

            // Refetch when the user switches back to the browser tab so data
            // stays current without requiring a manual reload.
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
