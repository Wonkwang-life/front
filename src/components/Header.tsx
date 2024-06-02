import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Header = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Logo onClick={() => navigate("/")}>
        <img src="/images/logo.png" alt="logo" />
        <span>원광생활건강</span>
      </Logo>
      <Tabs>
        <Tab>
          <Link to="/intro">회사 소개</Link>
        </Tab>
        <Tab>
          <Link to="/product-list">제품 소개</Link>
        </Tab>
        <Tab>
          <Link to="/location">오시는 길</Link>
        </Tab>
        <Tab>
          <Link to="http://www.wonnature.co.kr/index.php">원네이처</Link>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  position: sticky;
  top: 0px;
  z-index: 10;
  background-color: white;
  padding: 15px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
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
`;

const Tabs = styled.div`
  height: 54px;
  padding: 0 20%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 70%;
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
`;
