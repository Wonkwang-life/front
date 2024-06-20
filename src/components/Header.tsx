import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { RxHamburgerMenu } from "react-icons/rx";

const Header = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [isClickMenuBtn, setIsClickMenuBtn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const HeaderRef = useRef<HTMLDivElement | null>(null);

  const handleCloseMenu = () => {
    setIsClickMenuBtn(false);
  };

  const handleNavigate = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setIsClickMenuBtn(false);
  };

  useEffect(() => {
    if (!isClickMenuBtn) {
      setTimeout(() => {
        setAnimate(false);
      }, 300);
    }
  }, [isClickMenuBtn]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        HeaderRef.current &&
        !HeaderRef.current.contains(event.target as Node)
      ) {
        handleCloseMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [HeaderRef]);

  const handleResize = () => {
    if (window.innerWidth <= 1000) setAnimate(false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container ref={HeaderRef} className={isScrolled ? "scrolled" : ""}>
      <Logo
        src="/images/logo_alpha.png"
        alt="logo"
        onClick={() => navigate("/")}
      />
      <Tabs $isClickMenuBtn={isClickMenuBtn} $animate={animate}>
        <Tab onClick={handleNavigate}>
          <Link to="/intro">회사 소개</Link>
        </Tab>
        <Tab onClick={handleNavigate}>
          <Link to="/product">제품 소개</Link>
        </Tab>
        <Tab onClick={handleNavigate}>
          <Link to="/location">오시는 길</Link>
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
  height: var(--header-height);
  position: sticky;
  top: 0px;
  z-index: 10;
  background-color: white;
  padding: 15px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition: background-color 0.5s, backdrop-filter 0.5s, box-shadow 0.5s;
  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);

  &.scrolled {
    -webkit-backdrop-filter: blur(10px); /*ios 전용 */
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(15px);
    box-shadow: 0 4px 7px rgba(0, 0, 0, 0.15);
  }

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
    align-items: flex-start;
    justify-content: center;
    padding: 27px 0;

    & svg {
      display: block;
    }

    &.scrolled {
      background-color: rgb(255, 255, 255);
      backdrop-filter: blur(0px);
      box-shadow: 0;
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 70%;

  @media screen and (max-width: 1400px) {
    width: 90%;
  }

  @media screen and (max-width: 1000px) {
    background-color: white;
    box-shadow: 0 4px 7px rgba(0, 0, 0, 0.15);
    padding: 0;
    height: auto;
    position: absolute;
    top: var(--header-height);
    width: 100%;
    display: flex;
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

const Tab = styled.div`
  position: relative;

  & a {
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.15rem;
    padding: 15px 0;
    position: relative;
    transition: color 0.3s;

    @media screen and (min-width: 1001px) {
      &:before {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #474da2;
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }

      &:hover:before {
        transform: scaleX(1);
      }
    }
  }

  @media screen and (max-width: 1000px) {
    & a {
      width: 100%;
      padding: 20px 0;
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
