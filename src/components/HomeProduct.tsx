import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface HomeProductProps {
  id: number;
  title: string;
  imgUrls: string;
  content: string;
  tag: string;
}

const HomeProduct = ({
  id,
  title,
  imgUrls,
  content,
  tag,
}: HomeProductProps) => {
  const navigate = useNavigate();

  return (
    <Container onClick={() => navigate(`/product/${id}`)}>
      <ProductImg src={imgUrls} />
      <ProductTitle>{title}</ProductTitle>
      <ProductContent>{content}</ProductContent>
      <ProductTag>{tag}</ProductTag>
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

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;

const ProductTitle = styled.span`
  font-size: 1.3rem;
`;

const ProductImg = styled.img`
  width: 100%;
  max-width: 300px;
  height: 100%;
  object-fit: cover;
`;

const ProductContent = styled.p`
  font-size: 1.1rem;
  width: 90%;

  @media screen and (max-width: 800px) {
    font-size: 0.8rem;
  }
`;
const ProductTag = styled.p`
  font-size: 0.9rem;
  width: 90%;
  word-spacing: 15px;

  @media screen and (max-width: 800px) {
    font-size: 0.8rem;
  }
`;
