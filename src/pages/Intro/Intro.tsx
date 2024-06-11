import React from "react";
import styled from "styled-components";

const Intro = () => {
  return (
    <Container>
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
    </Container>
  );
};

export default Intro;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  gap: 50px;
  & img {
    width: 150px;
  }
`;

const EmphasisText = styled.span`
  color: var(--base-color);
  font-size: 2rem;
`;

const Content = styled.p`
  text-align: center;
  font-size: 1.3rem;
  line-height: 50px;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 50px;
`;
