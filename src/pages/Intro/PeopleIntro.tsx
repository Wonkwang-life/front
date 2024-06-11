import React from "react";
import styled from "styled-components";

const PeopleIntro = () => {
  return <PeopleContainer>직원</PeopleContainer>;
};

export default PeopleIntro;

const PeopleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  width: 90%;
`;
