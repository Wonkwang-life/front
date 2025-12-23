import { useEffect, useState } from "react";
import styled from "styled-components";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopBtn = () => {
  const [showScrollToTopButton, setShowScrollToTopButton] =
    useState<boolean>(false);

  const handleScroll = () => {
    if (window.scrollY > window.innerHeight / 2) {
      setShowScrollToTopButton(true);
    } else {
      setShowScrollToTopButton(false);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", handleScroll);
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <ScrollToTopButton
      $showbutton={showScrollToTopButton}
      onClick={handleScrollToTop}
    >
      <FaArrowUp />
    </ScrollToTopButton>
  );
};

export default ScrollToTopBtn;

const ScrollToTopButton = styled.div<{ $showbutton: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 9999;
  bottom: 50px;
  right: 30px;
  width: 70px;
  height: 70px;
  font-size: 2rem;
  background-color: var(--base-color);
  color: #fff;
  border: 3px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  opacity: ${({ $showbutton }) => ($showbutton ? 1 : 0)};
  visibility: ${({ $showbutton }) => ($showbutton ? "visible" : "hidden")};
  transition: opacity 0.3s ease-in, visibility 0.3s ease-in;

  &:hover {
    background-color: #1f3d8e;
  }

  @media screen and (max-width: 600px) {
    width: 60px;
    height: 60px;
    font-size: 1.7rem;
    right: 20px;
    bottom: 40px;
  }
`;
