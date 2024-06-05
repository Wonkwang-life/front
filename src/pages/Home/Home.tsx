import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RiDoubleQuotesL } from "react-icons/ri";
import { RiDoubleQuotesR } from "react-icons/ri";

const Home: React.FC = () => {
  const [offset, setOffset] = useState(0);

  const handleScroll = () => {
    setOffset(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container>
      <Banner>
        <BannerBackground offset={offset} />
        <BannerContent>
          <p>
            (주)원광생활건강은
            <br />
            건강기능식품/건강식품을
            <br />
            유통하는 전문업체입니다.
          </p>
        </BannerContent>
      </Banner>
      <Content>
        <ParallaxBox offset={offset} speed={0.3}>
          <RiDoubleQuotesL />
          (주)원광생활건강은 질병 없는 사회를 추구하고자 <br />
          끊임없는 기술 개발과 연구 개발에 최선을 다한 제품을 유통/판매하고
          있습니다.
          <RiDoubleQuotesR />
        </ParallaxBox>
      </Content>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  height: 200vh;
  width: 100vw;
`;

const Banner = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
`;

const BannerBackground = styled.div<{ offset: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url("/images/banner.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position-x: center;
  transform: translateY(${(props) => props.offset * 0.5}px);
  filter: brightness(50%);
  z-index: -1;

  @media screen and (max-width: 1000px) {
    background-position-x: 15%;
    background-size: cover;
  }
`;

const BannerContent = styled.div`
  z-index: 1;
  & p {
    margin: 0;
  }
`;

const Content = styled.div`
  padding: 100px;
  background: white;
  z-index: 1;
  position: relative;
  text-align: center;
  height: 800px;
`;

const ParallaxBox = styled.div<{ offset: number; speed: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  font-size: 1.3rem;
  transform: translateY(${(props) => props.offset * props.speed}px);
  color: rgba(0, 0, 0, 0.7);

  & svg {
    font-size: 1.5rem;
  }
`;
