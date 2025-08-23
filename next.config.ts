import type { NextConfig } from "next";

const nextConfig: NextConfig = {

   typescript: {
    ignoreBuildErrors: true,
  },
  
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

// module.exports = {
//   output: 'standalone'
// };

export default nextConfig;
