/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // enables static exports
  images: {
    remotePatterns: [{ protocol: "https", hostname: "raw.githubusercontent.com" }],
    unoptimized: true, // enables static exports
  },
  env: { NEXT_PUBLIC_BUILD_ID: (process.env.GITHUB_SHA ?? String(Date.now())).slice(0, 12) },
};
module.exports = nextConfig;
