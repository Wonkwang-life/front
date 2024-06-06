import React from "react";
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
  gap: 10px;

  &:hover {
    cursor: pointer;
  }
`;

const ProductTitle = styled.span`
  font-size: 1.1rem;
`;

const ProductImg = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;

  @media screen and (max-width: 1000px) {
    width: 150px;
    height: 150px;
  }

  @media screen and (max-width: 600px) {
    width: 100px;
    height: 100px;
  }
`;

const ProductContent = styled.p`
  font-size: 0.9rem;
  width: 90%;

  @media screen and (max-width: 800px) {
    font-size: 0.8rem;
  }
`;
