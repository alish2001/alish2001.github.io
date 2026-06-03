import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static HTML/CSS/JS export for GitHub Pages (no server runtime).
  output: "export",
  // GitHub Pages serves files as-is; disable the Image Optimization server.
  images: { unoptimized: true },
};

export default nextConfig;
