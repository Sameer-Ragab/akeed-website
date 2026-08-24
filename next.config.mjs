/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    qualities: [75, 100]
  }
};

export default nextConfig;
