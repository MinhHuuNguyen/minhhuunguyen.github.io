/** @type {import('next').NextConfig} */

const nextConfig = () => {

  return {
    reactStrictMode: true,
    output: "export",  // <=== enables static exports
    compiler: {
      emotion: true,
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "*",
        },
        {
          protocol: "http",
          hostname: "*",
        },
      ],
      unoptimized: true // <=== enables static exports
    },
  };
};

module.exports = nextConfig;

