import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["combative-rhinoceros-728.convex.cloud"],
    // Alternatively, to allow subdomains or enforce https:
    // remotePatterns: [
    //   { protocol: "https", hostname: "*.convex.cloud", pathname: "/**" },
    // ],
  },
};

export default nextConfig;
