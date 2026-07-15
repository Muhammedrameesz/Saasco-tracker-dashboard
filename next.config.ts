import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com", 
        pathname: "/**",
      },
    ],

    domains: ["img.freepik.com", "res.cloudinary.com"],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://trackingapp-backend-fksa.onrender.com/api/:path*",
      },
    ];
  },


  eslint: {
    ignoreDuringBuilds: true, 
  },

  typescript: {
    ignoreBuildErrors: false, 
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@": path.resolve(__dirname),
    };
    return config;
  },

  reactStrictMode: true,
};

export default nextConfig;
