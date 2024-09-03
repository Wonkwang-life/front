import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import { userState } from "../../state/userState";
import { productState } from "../../state/productState";

// Product 타입을 JSON 구조에 맞게 수정
interface Product {
  id: number;
  title: string;
  content: string;
  imageUrls: string[];
  oneLineIntroduce: string;
  tag: string;
}

const Products: React.FC = () => {
  // products 와 searchTerm 상태에 대한 타입 지정
  const productsLoadable = useRecoilValueLoadable(productState);
  const [products, setProducts] = useRecoilState<Product[]>(productState);
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
    if (productsLoadable.state === "hasValue" && !products) fetchProducts();
  }, []);

  // 검색어에 따른 상품 필터링 함수
  const filteredProducts = products?.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  return (
    <Container>
      <h2>제품 목록</h2>
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
        {filteredProducts?.length > 0 ? (
          <>
            {filteredProducts?.map((product) => (
              <ProductCard
                key={product.id}
                onClick={() => handleProductClick(product.id)}
              >
                <ProductImage src={product.imageUrls[0]} alt={product.title} />
                <ProductName>{product.title}</ProductName>
                <ProductDescription>
                  {product.oneLineIntroduce}
                </ProductDescription>
                <ProductTag>
                  {product.tag.split(" ").map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </ProductTag>
              </ProductCard>
            ))}
          </>
        ) : (
          <Label>존재하지 않는 제품입니다.</Label>
        )}
      </ProductCards>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80dvw;
  min-height: calc(100dvh - var(--header-height) - var(--footer-height));
  margin: auto;
  margin-bottom: 100px;
  & h2 {
    margin-top: 50px;
    margin-bottom: 40px;
  }
  @media screen and (max-width: 1000px) {
    width: 70dvw;
  }

  @media screen and (max-width: 768px) {
    width: 100dvw;
  }

  @media screen and (max-width: 500px) {
    width: 70dvw;
  }
  @media screen and (max-width: 450px) {
    width: 85dvw;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 30px;

  @media screen and (max-width: 768px) {
    justify-content: center;
  }
`;

const SearchInput = styled.input`
  padding: 5px;
  font-size: 16px;
  width: 230px;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-bottom: 1px solid #ccc;

  &:hover {
    border-bottom: 1px solid #7e6efd;
  }

  &:focus {
    outline: 1px solid white !important;
    border-bottom: 1px solid #5d48fb;
  }

  @media screen and (max-width: 1000px) {
    width: 180px;
  }

  @media screen and (max-width: 768px) {
    width: 50%;
  }

  @media screen and (max-width: 500px) {
    width: 95%;
  }
`;

const ProductCards = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

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

const ProductCard = styled.div`
  border: 1px solid #ddd;
  width: calc((100% - 40px) / 3); /* 수정: 3개씩 가로로 정렬 */
  text-align: center;
  cursor: pointer; /* 커서를 포인터로 변경하여 클릭 가능함을 나타냄 */
  animation: ${fadeIn} 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 8px;
  transition: all 0.3s;
  /* flex-grow: 1; */

  @media screen and (max-width: 1000px) {
    width: calc((100% - 40px) / 2); /* 수정: 3개씩 가로로 정렬 */
    height: auto; /* 모바일 화면에서는 높이를 자동으로 설정 */
  }

  @media screen and (max-width: 768px) {
    width: 60dvw;
  }

  @media screen and (max-width: 500px) {
    width: 70dvw;
  }

  @media screen and (max-width: 450px) {
    width: 85dvw;
  }

  &:hover {
    transform: scale(1.02);
  }
`;

const ProductImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 280px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  @media screen and (max-width: 1500px) {
    height: 250px;
  }

  @media screen and (max-width: 1100px) {
    height: 200px;
  }

  @media screen and (max-width: 768px) {
    height: 300px;
  }

  @media screen and (max-width: 500px) {
    height: 250px;
  }
`;

const ProductName = styled.div`
  margin-top: 15px;
  margin-bottom: 7px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ProductDescription = styled.div`
  height: 70px;
  font-size: 1rem;
  color: #666;
  text-wrap: balance;
  padding: 0px 15px;
`;

const ProductTag = styled.div`
  font-size: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 7px;
  padding: 0 20px;
  margin-bottom: 20px;
`;

const Tag = styled.div`
  color: var(--base-color);
  font-size: 0.9rem;
`;

const WriteBtn = styled.button`
  padding: 14px 25px;
  margin-bottom: 20px;
  background-color: rgb(48 79 163);
  color: white;
  border: none;
  border-radius: 10px;

  &:hover {
    filter: brightness(85%);
  }
`;

const Label = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 15%;
  color: rgba(0, 0, 0, 0.5);
`;

export default Products;
