import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@deconcierge/services"],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "pino": "pino/browser",
      "pino-pretty": false,
      "lokijs": false,
      "encoding": false,
      "supports-color": false,
      "thread-stream": false,
      "sonic-boom": false,
      "fastbench": false,
      "pino-elasticsearch": false,
      "tap": false,
      "tape": false,
      "desm": false,
      "why-is-node-running": false,
    };
    return config;
  },
};

export default nextConfig;
