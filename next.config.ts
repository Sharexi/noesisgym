import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static site: every page is plain HTML in `out/`, served from Cloudflare Pages.
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
