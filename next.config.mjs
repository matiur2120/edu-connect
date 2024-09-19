/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
           
          },
          {
            protocol: 'https',
            hostname: 'i.pravatar.cc'
          },
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com'
          }
        ],
      },
};

export default nextConfig;
