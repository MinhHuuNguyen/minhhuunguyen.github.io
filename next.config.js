/** @type {import('next').NextConfig} */

const nextConfig = () => {
  const gaId = process.env.GOOGLE_ANALYTICS_ID;

  if (!gaId) {
    throw new Error("❌ Environment variable GOOGLE_ANALYTICS_ID is not set.");
  }

  if (!/^G-[A-Z0-9]+$/.test(gaId)) {
    throw new Error(`❌ Invalid GOOGLE_ANALYTICS_ID '${gaId}'. It must start with 'G-' and contain only uppercase letters or digits.`);
  }

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

