import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const NotPageFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Title>존재하지 않는 페이지 입니다.</Title>
      <Button onClick={() => navigate("/")}>홈으로</Button>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: calc(100dvh - var(--header-height) - var(--footer-height));
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  color: var(--base-color);
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: 800;
`;

const Button = styled.button`
  padding: 15px 80px;
  border-radius: 5px;
  color: white;
  background-color: var(--base-color);
  margin-top: 100px;
  font-size: 1.3rem;
  transition: all 0.5s;

  &:hover {
    background-color: #2a2ac5;
  }
`;
export default NotPageFound;
