import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { RiDoubleQuotesL } from "react-icons/ri";
import { RiDoubleQuotesR } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa6";
import HomeProduct from "../../components/HomeProduct";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [offset, setOffset] = useState(0);
  // 스크롤 이벤트 최적화를 위한 ref 사용
  const requestRef = useRef<number>();
  const navigate = useNavigate();

  const handleScroll = () => {
    setOffset(window.scrollY);
  };

  const animateScroll = () => {
    handleScroll();
    requestRef.current = requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    // 모바일 화면이 아닐 때만 스크롤 애니메이션을 실행 - 모바일에선 useEffect로 화면 깜빡임 현상 발생
    if (window.innerWidth > 600) {
      requestRef.current = requestAnimationFrame(animateScroll);
      // 스크롤 이벤트 리스너 추가
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
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
      <Main>
        <Content>
          <RiDoubleQuotesL />
          (주)원광생활건강은 질병 없는 사회를 추구하고자 <br />
          끊임없는 기술 개발과 연구 개발에 최선을 다한 제품을 유통/판매하고
          있습니다.
          <RiDoubleQuotesR />
        </Content>
        <ProductContent>
          <span>제품 목록</span>
          <ProductBox>
            <HomeProduct
              id={1}
              title="원광천녹침향원"
              imgUrls="/images/product1.png"
              content="침향, 홍삼, 녹용, 벌꿀 등 전통원료 16가지를 함유한 바쁜 현대인들의
        건강을 생각한 프리미엄 제품"
            />
            <HomeProduct
              id={2}
              title="원광헬시골드타임"
              imgUrls="/images/product2.png"
              content="비타민A, 비타민E가 함유된 건강기능식품"
            />
            <HomeProduct
              id={3}
              title="프로바이오틱스 하루톡톡"
              imgUrls="/images/product3.jpeg"
              content="19종 혼합 유산균 함류"
            />
          </ProductBox>
          <GoProductListPage onClick={() => navigate("/product")}>
            <span>모든 제품 보러 가기</span>
            <FaArrowRight />
          </GoProductListPage>
        </ProductContent>
      </Main>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  height: 340vh;
  width: 100vw;
  background-color: white;

  @media screen and (min-height: 700px) {
    height: 270vh;
  }
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
  z-index: 1;

  @media screen and (max-width: 600px) {
    height: 700px;
  }
`;

const BannerBackground = styled.div<{ offset: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background-image: url("/images/banner.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center ${(props) => props.offset * 0.5}px;
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

  @media screen and (max-width: 1000px) {
    & p {
      font-size: 1.4rem;
    }
  }
`;

const Main = styled.div`
  padding: 100px;
  background: white;
  z-index: 1;
  position: relative;
  text-align: center;
  height: 1300px;

  @media screen and (max-width: 1000px) {
    padding: 30px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  font-size: 1.3rem;
  color: rgba(0, 0, 0, 0.7);
  margin-top: 250px;

  & svg {
    font-size: 1.5rem;
  }

  @media screen and (max-width: 800px) {
    font-size: 1rem;

    & svg {
      font-size: 1.2rem;
    }
  }
`;

const ProductContent = styled(Content)`
  margin-top: 400px;

  @media screen and (max-width: 800px) {
    font-size: 1.2rem;
  }
`;

const ProductBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
`;

const GoProductListPage = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 1rem;
  transition: color 0.2s ease;
  margin-top: 20px;

  & svg {
    font-size: 1rem;
    margin-bottom: 3px;
  }

  &:hover {
    cursor: pointer;
    color: rgba(0, 0, 0, 0.5);
  }
`;
