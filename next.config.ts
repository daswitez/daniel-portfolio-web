import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Run Next.js static-paths / cache probes in worker threads instead of forked
    // child processes, avoiding Windows/OneDrive Jest worker IPC crashes.
    workerThreads: true,
  },
};

export default nextConfig;
