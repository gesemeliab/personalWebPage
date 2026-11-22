/** @type {import('next').NextConfig} */
const nextConfig = {
  // The site has no backend, so it is exported as plain static files.
  // `pnpm run build` writes them to ./out, deployable to any static host.
  output: "export",

  // Static export has no server to optimise images on the fly.
  images: { unoptimized: true },

  // /es/ is written as es/index.html, which every static host serves as-is.
  trailingSlash: true,

  // One root layout per language means no single layout for the 404 page;
  // app/global-not-found.js renders it instead.
  experimental: { globalNotFound: true },

  reactStrictMode: true,
};

export default nextConfig;
