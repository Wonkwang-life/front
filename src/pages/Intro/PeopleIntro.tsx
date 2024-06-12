import React, { useState, useEffect } from "react";
import styled from "styled-components";
import peopleData from "../../../public/people-list.json";

const PeopleIntro = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [peoples, setPeoples] = useState<
    {
      name: string;
      role: string;
      phone: string;
      email: string;
      imageUrls: string;
      id: number;
    }[]
  >([]);

  useEffect(() => {
    setPeoples(peopleData.content.content);
  }, []);

  // 검색어에 따른 직원 필터링 함수
  const filteredPeoples = peoples.filter((people) =>
    people.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PeopleContainer>
      <SearchBox>
        <h4>직원 이름을 입력하세요.</h4>
        <SearchInput
          type="text"
          placeholder="직원 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBox>
      <ResultBox>
        {searchTerm && (
          <>
            {filteredPeoples.map((people) => (
              <ResultsContent key={people.id}>
                <PeopleImg
                  src={`/images/${people.imageUrls}`}
                  alt={people.name}
                />
                <PeopleInfo>
                  <li>이름: {people.name}</li>
                  <li>직책: {people.role}</li>
                  <li>연락처: {people.phone}</li>
                  <li>e-mail: {people.email}</li>
                </PeopleInfo>
              </ResultsContent>
            ))}
          </>
        )}
      </ResultBox>
    </PeopleContainer>
  );
};

export default PeopleIntro;

const PeopleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  width: 90dvw;
  height: 100dvh;

  @media screen and (max-width: 1100px) {
    margin-top: 100px;
  }
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;
`;

const SearchInput = styled.input`
  padding: 5px 10px;
  font-size: 0.9rem;
  width: 220px;
  border: 1px solid #ccc;
  border-radius: 10px;
  outline: none;

  @media screen and (max-width: 500px) {
    font-size: 0.8rem;
  }
`;

const ResultBox = styled.div`
  height: 40%;
  margin-bottom: 100px;
`;

const ResultsContent = styled.div`
  display: flex;
  gap: 30px;

  @media screen and (max-width: 1000px) {
    flex-direction: column;
  }
`;

const PeopleImg = styled.img`
  width: 350px;
  box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.5);
  @media screen and (max-width: 500px) {
    width: 300px;
  }
`;

const PeopleInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  & li {
    font-size: 1rem;
  }

  @media screen and (max-width: 500px) {
    & li {
      font-size: 0.9rem;
    }
  }
`;
