/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hololive.hololivepro.com', // hololive official site for seed images
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com', // Vercel Storage for user uploaded images
      },
    ],
  },
};

export default nextConfig;
