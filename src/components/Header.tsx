import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RxHamburgerMenu } from "react-icons/rx";

const Header = () => {
  const navigate = useNavigate();
  const [isClickHambergerMenu, setIsClickHambergerMenu] = useState(false); // 햄버거 메뉴 열고 닫기 기능 구현을 위함
  const HeaderRef = useRef<HTMLDivElement | null>(null); // 탭을 참조하기 위한 ref

  // 탭 클릭 시 햄버거 메뉴를 닫는 함수
  const handleCloseHamburgerMenu = () => {
    setIsClickHambergerMenu(false);
  };

  // 바깥 클릭 감지 로직
  useEffect(() => {
    // 클릭된 요소가 헤더 컴포넌트 내부에 있는지 확인하고, 바깥쪽 클릭이라면 handleCloseHamburgerMenu 함수를 실행
    const handleClickOutside = (event: MouseEvent) => {
      if (
        HeaderRef.current &&
        !HeaderRef.current.contains(event.target as Node)
      ) {
        handleCloseHamburgerMenu();
      }
    };
    // 클릭 이벤트 리스너 추가
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [HeaderRef]);

  return (
    <Container ref={HeaderRef}>
      <Logo onClick={() => navigate("/")}>
        <img src="/images/logo.png" alt="logo" />
        <span>원광생활건강</span>
      </Logo>
      <Tabs isClickHambergerMenu={isClickHambergerMenu}>
        <Tab onClick={handleCloseHamburgerMenu}>
          <Link to="/intro">회사 소개</Link>
        </Tab>
        <Tab onClick={handleCloseHamburgerMenu}>
          <Link to="/product-list">제품 소개</Link>
        </Tab>
        <Tab onClick={handleCloseHamburgerMenu}>
          <Link to="/location">오시는 길</Link>
        </Tab>
        <Tab onClick={handleCloseHamburgerMenu}>
          <Link to="http://www.wonnature.co.kr/index.php" target="_blank">
            원네이처
          </Link>
        </Tab>
      </Tabs>
      <RxHamburgerMenu
        onClick={() => {
          setIsClickHambergerMenu(!isClickHambergerMenu);
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
  }

  @media screen and (max-width: 1000px) {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;

    & svg {
      display: block;
    }
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & img {
    width: 50px;
  }

  & span {
    font-size: 1.5rem;
    font-weight: 700;
  }

  &:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 1000px) {
    margin-left: 20px;
    margin-bottom: 5px;
  }
`;

const Tabs = styled.div<{ isClickHambergerMenu: boolean }>`
  height: 54px;
  padding: 0 20%;
  display: grid; // 기본적으로 grid를 사용하여 탭을 표시
  grid-template-columns: repeat(4, 1fr);
  width: 70%;

  @media screen and (max-width: 1000px) {
    background-color: white;
    padding: 0;
    padding-bottom: 235px;
    width: 100%;
    display: flex; // 화면이 1000px 미만일 때는 flex로 변경
    flex-direction: column;
    display: ${({ isClickHambergerMenu }) =>
      isClickHambergerMenu
        ? "flex"
        : "none"}; // 메뉴바 클릭에 따른 display 재조정
  }

  @media screen and (min-width: 1000px) {
    display: grid; // 화면이 1000px 이상일 때는 항상 grid로 표시
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
  }

  @media screen and (max-width: 1000px) {
    background-color: white;
    & a:hover {
      border-bottom: 0px;
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
`;
