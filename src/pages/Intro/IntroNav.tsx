import styled from "styled-components";
import { Link, Outlet, useLocation } from "react-router-dom";

const Intro = () => {
  const location = useLocation();

  return (
    <Container>
      <Tabs>
        <Tab $isactive={location.pathname === "/intro"}>
          <Link to="/intro">개요</Link>
        </Tab>
        <Tab $isactive={location.pathname === "/intro/people"}>
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

  @media screen and (max-width: 1100px) {
    height: 100dvh;
    align-items: center;
    flex-direction: column;
    gap: 60px;
  }

  @media screen and (max-width: 400px) {
    gap: 20px;
  }
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  width: 15dvw;
  margin-top: 10%;
  position: absolute;
  left: 5%;

  @media screen and (max-width: 1100px) {
    width: 80dvw;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    top: 5%;
    left: inherit;
  }
  @media screen and (max-width: 800px) {
    top: 10%;
  }
`;

const Tab = styled.span<{ $isactive: boolean }>`
  & a {
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    font-weight: bolder;
    padding: 15px 0;
    font-weight: 500;
    border-bottom: 2px solid
      ${(props) => (props.$isactive ? "var(--base-color)" : "black")};
    color: ${(props) => (props.$isactive ? "var(--base-color)" : "black")};
  }
  & a:hover {
    border-bottom: 2px solid var(--base-color);
  }

  @media screen and (max-width: 1100px) {
    & a {
      padding: 15px 80px;
    }
  }

  @media screen and (max-width: 500px) {
    & a {
      padding: 15px 60px;
    }
  }

  @media screen and (max-width: 400px) {
    & a {
      padding: 15px 50px;
    }
  }
`;
