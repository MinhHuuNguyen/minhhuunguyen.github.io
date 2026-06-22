/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = () => {
  return {
    reactStrictMode: true,

    output: "export", // enables static exports

    compiler: {
      emotion: true,
    },

    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "raw.githubusercontent.com",
        },
        {
          protocol: "https",
          hostname: "cdn.pixabay.com",
        },
      ],
      unoptimized: true, // enables static exports
    },

    webpack: (config) => {
      /**
       * Skip toàn bộ code trong git submodule
       * Thay "./submodule" bằng đúng folder submodule của bạn
       */
      const submodulePath = path.resolve(__dirname, "./submodule");

      /**
       * Không cho webpack resolve/import vào submodule
       */
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        [submodulePath]: false,
      };

      /**
       * Ignore tất cả file nằm trong submodule
       */
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: [submodulePath],
      });

      return config;
    },
  };
};

module.exports = nextConfig;
