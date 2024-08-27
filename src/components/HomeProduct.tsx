import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface HomeProductProps {
  id: number;
  title: string;
  imgUrls: string;
  content: string;
}

const HomeProduct = ({ id, title, imgUrls, content }: HomeProductProps) => {
  const navigate = useNavigate();

  return (
    <Container onClick={() => navigate(`/product/${id}`)}>
      <ProductImg src={imgUrls} />
      <ProductTitle>{title}</ProductTitle>
      <ProductContent>{content}</ProductContent>
    </Container>
  );
};

export default HomeProduct;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  gap: 15px;

  &:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 800px) {
    width: 100%;
    padding-bottom: 30px;
    border-bottom: 1px #868686 solid;
  }
`;

const ProductTitle = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
`;

const ProductImg = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;

  @media screen and (max-width: 800px) {
    height: 400px;
  }
`;

const ProductContent = styled.p`
  font-size: 1.1rem;
  width: 90%;
`;
const ProductTag = styled.p`
  font-size: 0.9rem;
  width: 90%;
  word-spacing: 15px;
`;
