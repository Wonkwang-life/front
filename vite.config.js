import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 모든 네트워크 인터페이스에서 접근 가능하도록 설정
    port: 3000, // 원하는 포트를 설정, 기본은 3000
  },
});
