import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['img.freepik.com', 'res.cloudinary.com'],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://trackingapp-backend-fksa.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
