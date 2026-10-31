import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出，部署到 GitHub Pages
  output: "export",
  // 仓库为 https://github.com/laihaibo/spring.git，Pages 服务于子路径 /spring
  basePath: "/spring",
  // 静态托管下子路由需要以目录形式存在（foo/index.html）
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
