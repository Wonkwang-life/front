import React, { useEffect, useState, useRef } from "react";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa6";
import HomeProduct from "../../components/HomeProduct";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { warningAlert } from "../../components/Alert";

const Home: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [products, setProducts] = useState([]);
  const [contentVisible, setContentVisible] = useState(false);
  const [productContentVisible, setProductContentVisible] = useState(false);
  // 스크롤 이벤트 최적화를 위한 ref 사용
  const requestRef = useRef<number>();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const productContentRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleScroll = () => {
    setOffset(window.scrollY);
  };

  const animateScroll = () => {
    handleScroll();
    requestRef.current = requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    getRecentProducts();
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

  useEffect(() => {
    //스크롤 위치 시 애니메이션을 위한 함수
    const contentObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setContentVisible(true);
          contentObserver.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const productContentObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProductContentVisible(true);
          productContentObserver.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      contentObserver.observe(contentRef.current);
    }

    if (productContentRef.current) {
      productContentObserver.observe(productContentRef.current);
    }

    return () => {
      if (contentRef.current) {
        contentObserver.unobserve(contentRef.current);
      }

      if (productContentRef.current) {
        productContentObserver.unobserve(productContentRef.current);
      }
    };
  }, []);

  const getRecentProducts = async () => {
    try {
      const response = await api.get("/post");
      setProducts(response.data.content.content);
    } catch (error: any) {
      warningAlert(error.response.data.message);
    }
  };

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
        <Content ref={contentRef} isVisible={contentVisible}>
          <RiDoubleQuotesL />
          (주)원광생활건강은 질병 없는 사회를 추구하고자 <br />
          끊임없는 기술 개발과 연구 개발에 최선을 다한 제품을 유통/판매하고
          있습니다.
          <RiDoubleQuotesR />
        </Content>
        <ProductContent
          ref={productContentRef}
          isVisible={productContentVisible}
        >
          <span>제품 목록</span>
          <ProductBox>
            {products.map(
              (product, index) =>
                index < 3 && (
                  <HomeProduct
                    key={product?.id}
                    id={product?.id}
                    title={product?.title}
                    imgUrls={product?.imageUrls[0]}
                    content={product?.oneLineIntroduce}
                    tag={product?.tag}
                  />
                )
            )}
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

import styled, { keyframes, css } from "styled-components";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    
    transform: translateY(40px) scale(0.4);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Container = styled.div`
  height: auto;
  width: 100vw;
  background-color: white;
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
  padding: 0px;
  background: white;
  z-index: 1;
  position: relative;
  text-align: center;
  height: auto;

  @media screen and (max-width: 1000px) {
    padding: 30px;
  }
`;

const Content = styled.div<{ isVisible: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  font-size: 1.5rem;
  color: rgba(0, 0, 0, 0.7);
  margin-top: 200px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 1.2s ease, transform 1.2s ease;

  ${({ isVisible }) =>
    isVisible &&
    css`
      opacity: 1;
      transform: translateY(0);
      animation: ${fadeInUp} 1.2s ease;
    `}

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
  margin: 250px 0;

  @media screen and (max-width: 800px) {
    font-size: 1.2rem;
  }
`;

const ProductBox = styled.div`
  display: flex;
  width: 100%;
  max-width: 1300px;
  padding: 0 20px;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;

  @media screen and (max-width: 600px) {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
  }
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

export default Home;
