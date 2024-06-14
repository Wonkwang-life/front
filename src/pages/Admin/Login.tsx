import axios from "axios";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import { successAlert, warningAlert } from "../../components/Alert";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../state/userState";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login();
  };

  const handleLogoutSubmit = (e) => {
    e.preventDefault();
    logout();
  };

  const login = async () => {
    try {
      const response = await api.post(`/user/login`, {
        username,
        password,
      });

      setUser(response.data.content);
      console.log(response.data.content);
      successAlert(response.data.message);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      warningAlert(error.response.data.message);
    }
  };

  const logout = async () => {
    try {
      const response = await api.get("/user/logout");
      successAlert(response.data.message);

      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      warningAlert(error.response.data.message);
    }
  };
  return (
    <Container>
      {!user ? (
        <LoginForm onSubmit={handleLoginSubmit}>
          <Title>관리자 로그인</Title>
          <Label>유저이름</Label>
          <Input type="text" value={username} onChange={handleUsernameChange} />
          <Label>비밀번호</Label>
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button type="submit">로그인</Button>
        </LoginForm>
      ) : (
        <LoginForm onSubmit={handleLogoutSubmit}>
          <Title>로그아웃</Title>
          <Button type="submit">로그아웃</Button>
        </LoginForm>
      )}
    </Container>
  );
};

const centeredFlex = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  ${centeredFlex}
  width: 100%;
  min-height: calc(100dvh - var(--header-height) - var(--footer-height));
  background-color: #f0f4f8;
  padding: 20px;
`;

const LoginForm = styled.form`
  ${centeredFlex}
  align-items: flex-start;
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  border: solid #ccd1d9 1px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  width: 100%;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
  color: #333333;
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 5px;
  color: #555555;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 10px;
  margin-bottom: 20px;
  border: 1px solid #ccd1d9;
  border-radius: 8px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  &:focus {
    border-color: #0288d1;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  height: 45px;
  background-color: #0288d1;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0277bd;
  }
`;

export default Login;
