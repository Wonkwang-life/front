import React from "react";
import styled from "styled-components";

const CompanyIntro = () => {
  return (
    <IntroContainer>
      <img src="/images/logo.png" alt="logo" />
      <EmphasisText>
        지속 가능하고 더 나은 삶을 위하는 생활 건강 브랜드
      </EmphasisText>
      <Content>
        원광생활건강은 다양한 건강기능식품과 건강식품을 제공합니다. <br />
        대표 제품으로는 프로바이오틱스, 비타민 보충제, 한방 건강식품 등이
        있습니다. <br />
        우리는 자연 친화적인 원료를 사용하여 고객의 건강을 최우선으로
        생각합니다.
      </Content>
    </IntroContainer>
  );
};

export default CompanyIntro;

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  width: 90%;

  & img {
    width: 150px;
  }

  @media screen and (max-width: 800px) {
    & img {
      width: 120px;
    }
  }

  @media screen and (max-width: 600px) {
    & img {
      width: 100px;
    }
  }

  @media screen and (max-width: 500px) {
    height: 100dvh;
    width: 80%;
  }
`;

const EmphasisText = styled.span`
  color: var(--base-color);
  font-size: 2rem;

  @media screen and (max-width: 800px) {
    font-size: 1.5rem;
  }

  @media screen and (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

const Content = styled.p`
  text-align: center;
  font-size: 1.3rem;
  line-height: 50px;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 50px;
  @media screen and (max-width: 800px) {
    font-size: 1rem;
    line-height: 40px;
  }

  @media screen and (max-width: 600px) {
    font-size: 0.9rem;
    line-height: 35px;
  }

  @media screen and (max-width: 500px) {
    text-align: left;
    line-height: 30px;
  }
`;
