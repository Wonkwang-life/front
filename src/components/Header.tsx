import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { RxHamburgerMenu } from "react-icons/rx";

const Header = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [isClickMenuBtn, setIsClickMenuBtn] = useState(false); // 햄버거 메뉴 열고 닫기 기능 구현을 위함
  const HeaderRef = useRef<HTMLDivElement | null>(null); // 탭을 참조하기 위한 ref

  // 햄버거 메뉴를 닫는 함수
  const handleCloseMenu = () => {
    setIsClickMenuBtn(false);
  };

  // 바깥 클릭 감지 로직
  useEffect(() => {
    // 클릭된 요소가 헤더 컴포넌트 내부에 있는지 확인하고, 바깥쪽 클릭이라면 handleCloseMenu 함수를 실행
    const handleClickOutside = (event: MouseEvent) => {
      if (
        HeaderRef.current &&
        !HeaderRef.current.contains(event.target as Node)
      ) {
        handleCloseMenu();
      }
    };
    // 클릭 이벤트 리스너 추가
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [HeaderRef]);

  // 화면 1000px 이하 시, 맨 처음엔 애니메이션 실행되지 않도록 설정
  // 메뉴 버튼 클릭시에만 css animation 발생하도록 하기 위함
  const handleResize = () => {
    if (window.innerWidth <= 1000) setAnimate(false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container ref={HeaderRef}>
      <Logo src="/images/logo2.png" alt="logo" onClick={() => navigate("/")} />
      <Tabs $isClickMenuBtn={isClickMenuBtn} $animate={animate}>
        <Tab onClick={handleCloseMenu}>
          <Link to="/intro">회사 소개</Link>
        </Tab>
        <Tab onClick={handleCloseMenu}>
          <Link to="/product">제품 소개</Link>
        </Tab>
        <Tab onClick={handleCloseMenu}>
          <Link to="/location">오시는 길</Link>
        </Tab>
        <Tab onClick={handleCloseMenu}>
          <Link to="http://www.wonnature.co.kr/index.php" target="_blank">
            원네이처
          </Link>
        </Tab>
      </Tabs>
      <RxHamburgerMenu
        onClick={() => {
          setIsClickMenuBtn(!isClickMenuBtn);
          setAnimate(true);
        }}
      />
    </Container>
  );
};

export default Header;

const Container = styled.div`
  height: var(--header-height); //index.css에 변수선언 되어있음
  position: sticky;
  top: 0px;
  z-index: 10;
  background-color: white;
  padding: 15px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;

  & svg {
    position: absolute;
    right: 32px;
    top: 28px;
    font-size: 25px;
    display: none;
    color: black;
  }

  @media screen and (max-width: 1000px) {
    width: 100%;
    flex-direction: column;
    align-items: center;
    align-items: flex-start;
    padding: 27px 0;

    & svg {
      display: block;
    }
  }
`;

const Logo = styled.img`
  width: 230px;

  &:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 1400px) {
    padding-left: 30px;
  }
`;

const Tabs = styled.div<{
  $isClickMenuBtn: boolean;
  $animate: boolean;
}>`
  height: 54px;
  padding: 0 20%;
  display: grid; // 기본적으로 grid를 사용하여 탭을 표시
  grid-template-columns: repeat(4, 1fr);
  width: 70%;

  @media screen and (max-width: 1400px) {
    width: 90%;
  }

  @media screen and (max-width: 1000px) {
    background-color: white;
    padding: 0;
    padding-top: 20px;
    padding-bottom: 235px;
    width: 100%;
    display: flex; // 화면이 1000px 미만일 때는 flex로 변경
    flex-direction: column;
    ${({ $isClickMenuBtn, $animate }) =>
      $isClickMenuBtn
        ? css`
            animation: ${slideDown} 0.3s forwards;
          `
        : $animate
        ? css`
            animation: ${slideUp} 0.3s forwards;
          `
        : css`
            display: none;
          `}
  }
`;

const Tab = styled.span`
  & a {
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    font-weight: 500;
    padding: 15px 0;
  }

  & a:hover {
    border-bottom: 2px solid #474da2;
    color: #474da2;
  }

  @media screen and (max-width: 1000px) {
    background-color: white;
    & a {
      width: 100%;
    }

    & a:hover {
      border-bottom: 0px;
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(-1px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-1px);
    opacity: 0;
}
`;
