import React from "react";
import styled from "styled-components";
import { Link, Outlet, useLocation } from "react-router-dom";

const Intro = () => {
  const location = useLocation();

  return (
    <Container>
      <Tabs>
        <Tab isActive={location.pathname === "/intro"}>
          <Link to="/intro">개요</Link>
        </Tab>
        <Tab isActive={location.pathname === "/intro/people"}>
          <Link to="people">직원</Link>
        </Tab>
      </Tabs>
      <Outlet />
    </Container>
  );
};

export default Intro;

const Container = styled.div`
  height: 90dvh;
  width: 80dvw;
  display: flex;
  justify-content: center;
  margin: auto;
  gap: 30px;
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  width: 15%;
  margin-top: 10%;
`;

const Tab = styled.span<{ isActive: boolean }>`
  & a {
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    font-weight: bolder;
    padding: 15px 0;
    font-weight: 500;
    border-bottom: 2px solid
      ${(props) => (props.isActive ? "var(--base-color)" : "black")};
    color: ${(props) => (props.isActive ? "var(--base-color)" : "black")};
  }
  & a:hover {
    border-bottom: 2px solid var(--base-color);
  }
`;
