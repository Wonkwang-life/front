import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import VitePluginHtmlEnv from "vite-plugin-html-env";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePluginHtmlEnv(),
    VitePluginHtmlEnv({ compiler: true }),
    createHtmlPlugin({
      inject: {
        data: {
          title: "원광생활건강",
          description:
            "원광생활건강은 다양한 건강기능식품과 건강식품을 제공합니다. 건강한 생활을 위한 최고의 선택, 원광생활건강.",
          keywords: "원광생활건강, 건강기능식품, 건강식품, 건강",
          url: "https://www.wonkwanghealth.com/",
          ogImage: "/images/logo2.png",
          twitterImage: "/images/logo2.png",
        },
      },
    }),
  ],
  server: {
    host: "0.0.0.0", // 모든 네트워크 인터페이스에서 접근 가능하도록 설정
    port: 3000, // 원하는 포트를 설정, 기본은 3000
  },
});
