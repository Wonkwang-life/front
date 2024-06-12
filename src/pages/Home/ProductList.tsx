import axios from "axios";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";

// Product 타입을 JSON 구조에 맞게 수정
interface Product {
  id: number;
  title: string;
  content: string;
  imageUrls: string[];
  oneLineIntroduce: string;
}

const ProductList: React.FC = () => {
  // products 와 searchTerm 상태에 대한 타입 지정
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  // 상품 정보를 가져오는 함수
  const fetchProducts = async () => {
    try {
      const response = await api.get("/post");
      setProducts(response.data.content.content);
    } catch (error) {
      console.error("데이터를 불러오지 못했습니다. ", error);
    }
  };

  // 컴포넌트가 처음 랜더링 될 때 실행되는 함수
  useEffect(() => {
    fetchProducts();
  }, []);

  // 검색어에 따른 상품 필터링 함수
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  return (
    <StyledProductList>
      <Title>
        <h2>제품 목록</h2>
      </Title>
      {user && (
        <WriteBtn onClick={() => navigate("/write")}>상품 등록</WriteBtn>
      )}
      <SearchInputWrapper>
        <SearchInput
          type="text"
          placeholder="제품 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchInputWrapper>
      <ProductCards>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            onClick={() => handleProductClick(product.id)}
          >
            <ProductImage src={product.imageUrls[0]} alt={product.title} />
            <ProductName>{product.title}</ProductName>
            <ProductDescription>{product.oneLineIntroduce}</ProductDescription>
          </ProductCard>
        ))}
      </ProductCards>
    </StyledProductList>
  );
};

const Title = styled.div`
  padding: 5px;
  display: block;
  text-align: center;
`;

const StyledProductList = styled.div`
  padding: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// fadein 애니메이션 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const ProductCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ProductCard = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  width: calc((100% - 40px) / 3); /* 수정: 3개씩 가로로 정렬 */
  text-align: center;
  cursor: pointer; /* 커서를 포인터로 변경하여 클릭 가능함을 나타냄 */
  animation: ${fadeIn} 0.5s ease-in-out;

  @media screen and (max-width: 768px) {
    width: 100%; /* 모바일 화면에서 100% 너비로 설정 */
  }
`;

const ProductDescription = styled.div`
  margin-top: 15px;
  font-size: 14px;
  color: #666;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 70%;
  object-fit: contain;
`;

const ProductName = styled.div`
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;

  @media screen and (max-width: 768px) {
    justify-content: center;
  }
`;

const SearchInput = styled.input`
  padding: 5px;
  font-size: 16px;
  width: 18%;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-bottom: 1px solid #ccc;

  &:hover,
  &:focus {
    border-bottom: 1px solid #000;
  }

  @media screen and (max-width: 768px) {
    width: 80%;
  }
`;
const WriteBtn = styled.button`
  padding: 10px 15px;
  margin-bottom: 20px;
  margin-left: 10px;
  background-color: rgb(48 79 163);
  color: white;
`;

export default ProductList;
