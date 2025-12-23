import { useState } from "react";
import styled, { css } from "styled-components";
import { successAlert, warningAlert } from "../../components/Alert";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const AddPeople = () => {
  const [username, setUsername] = useState("");
  const [position, setPosition] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleAddPeopleSubmit = (e) => {
    e.preventDefault();
    postPeople();
  };

  const postPeople = async () => {
    try {
      const response = await api.post("/staff");
      successAlert(response.data.message);
      navigate("/intro/people");
    } catch (error) {
      console.error("Error:", error);
      warningAlert(error.response.data.message);
    }
  };

  return (
    <Container>
      <LoginForm onSubmit={handleAddPeopleSubmit}>
        <Title>직원 추가</Title>
        <Label>이름</Label>
        <Input
          required
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
        <Label>직책</Label>
        <Input
          required
          type="text"
          value={position}
          onChange={handlePositionChange}
        />
        <Label>전화번호</Label>
        <Input
          required
          type="text"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="ex) 010-1234-5678"
        />
        <Button type="submit">추가하기</Button>
      </LoginForm>
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

export default AddPeople;
