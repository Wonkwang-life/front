import axios from "axios";
import { warningAlert } from "./components/Alert";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_APIADDRESS}`, // 기본 URL 설정
  withCredentials: true,
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    // 요청 전 처리 (예: 토큰 추가)
    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 공통 에러 처리
    if (error.config && error.config.skipInterceptor) {
      // 공통 에러 처리를 건너뛰기
      return Promise.reject(error);
    }
    if (error.response) {
      // 서버가 응답을 반환한 경우
      console.error("Error:", error.response.data);
      // 사용자에게 에러 메시지 표시 등 공통 처리
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      console.error("No response received:", error.request);
    } else {
      // 요청 설정 중에 발생한 에러
      console.error("Error setting up request:", error.message);
    }
    if (error.response.status === 401) {
      warningAlert(error.response.data.message);
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
