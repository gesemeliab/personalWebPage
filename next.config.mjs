/** @type {import('next').NextConfig} */
const nextConfig = {
  // The site has no backend, so it is exported as plain static files.
  // `pnpm run build` writes them to ./out, deployable to any static host.
  output: "export",

  // Static export has no server to optimise images on the fly.
  images: { unoptimized: true },

  reactStrictMode: true,
};

export default nextConfig;
