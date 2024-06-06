import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// Product 타입을 JSON 구조에 맞게 수정
interface Product {
  id: number;
  title: string;
  content: string;
  imageUrls: string[];
}

const ProductList: React.FC = () => {
  // products 와 searchTerm 상태에 대한 타입 지정
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 상품 정보를 가져오는 함수
  const fetchProducts = async () => {
    try {
      const response = await fetch("/product-list.json");
      const data = await response.json();
      setProducts(data.content.content);
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

  const navigate = useNavigate();

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  return (
    <StyledProductList>
      <Title>
        <h2>상품 목록입니당</h2>
      </Title>
      {/* 검색 입력창 추가 */}
      <SearchInput
        type="text"
        placeholder="제품 검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ProductCards>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            onClick={() => handleProductClick(product.id)}
          >
            {/* imageUrls 배열의 첫 번째 이미지를 표시*/}
            <ProductImage src={product.imageUrls[0]} alt={product.title} />
            <ProductName>{product.title}</ProductName>
          </ProductCard>
        ))}
      </ProductCards>
    </StyledProductList>
  );
};

const Title = styled.div`
  padding: 5px;
`;

const StyledProductList = styled.div`
  padding: 20px;
`;

const ProductCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const ProductCard = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  width: 200px;
  text-align: center;
  cursor: pointer; /* 커서를 포인터로 변경하여 클릭 가능함을 나타냄 */
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
`;

const ProductName = styled.div`
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
`;

// 검색 입력창 스타일링
const SearchInput = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export default ProductList;
