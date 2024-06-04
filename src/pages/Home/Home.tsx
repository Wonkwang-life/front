import React, { useEffect, useState } from "react";
import styled from "styled-components";

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
        <span>스크롤 내리고 자연스럽게 나오는 내용들</span>
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
