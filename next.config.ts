import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Files in /public have no hash in their name, so Next serves them with max-age=0
  // and every visit re-checks them. A week is a safe middle ground: repeat visits load
  // them from cache, and a replaced file reaches everyone within days (rename it to
  // make the change instant).
  async headers() {
    return ["img", "story", "previews", "music"].map((folder) => ({
      source: `/${folder}/:path*`,
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=604800, stale-while-revalidate=86400",
        },
      ],
    }));
  },
  experimental: {
    // Run Next.js static-paths / cache probes in worker threads instead of forked
    // child processes, avoiding Windows/OneDrive Jest worker IPC crashes.
    workerThreads: true,
  },
};

export default nextConfig;
