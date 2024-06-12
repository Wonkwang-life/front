import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // 헤더 높이를 가져오기 위함
  const headerHeight = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--header-height");
  const headerHeightValue = parseFloat(headerHeight);

  useEffect(() => {
    window.scrollTo({
      top: 0 - headerHeightValue, // 헤더 높이까지 고려해서 연산
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
