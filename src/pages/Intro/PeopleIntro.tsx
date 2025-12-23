import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import api from "../../api";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import { useNavigate } from "react-router-dom";

const PeopleIntro = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [peoples, setPeoples] = useState<
    {
      id: number;
      name: string;
      position: string;
      phoneNumber: string;
    }[]
  >([]);
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  const getPeopleIntroData = async () => {
    try {
      const response = await api.get("/staff");
      setPeoples(response.data.content);
    } catch (error) {
      console.error("데이터를 불러오지 못했습니다. ", error);
    }
  };

  useEffect(() => {
    getPeopleIntroData();
  }, []);

  useEffect(() => {
    console.log();
  }, [peoples]);

  // 검색어에 따른 직원 필터링
  const filteredPeoples = useMemo(
    () =>
      peoples?.filter((people) => {
        // people 객체와 name이 존재하는지 확인
        if (!people?.name) return false;

        // 검색어가 비어있으면 모든 결과 반환
        if (!searchTerm.trim()) return true;

        // 검색어가 이름에 포함되어 있는지 확인 (대소문자 구분 없이)
        return people.name.toLowerCase().includes(searchTerm.toLowerCase());
      }),
    [peoples, searchTerm]
  );
  return (
    <PeopleContainer>
      {user && (
        <AddBtn
          onClick={() => {
            navigate("/add-people");
          }}
        >
          직원 추가
        </AddBtn>
      )}
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
        {searchTerm &&
          (filteredPeoples.length > 0 ? (
            <>
              {filteredPeoples.map((people) => (
                <PeopleImage key={people.id}>
                  <div>
                    <img src="/images/logo.png" />
                    <span>Wonkwang Healthecare</span>
                  </div>
                  <div>
                    <span>{people.position}</span>
                    <span>{people.name}</span>
                  </div>
                  <div>
                    <span>TEL {people.phoneNumber}</span>
                  </div>
                </PeopleImage>
              ))}
            </>
          ) : (
            <span>존재하지 않는 직원입니다.</span>
          ))}
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
  max-height: 40%;
  overflow-y: auto;
  margin-bottom: 100px;

  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const PeopleImage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: var(--base-color);
  color: white;
  width: 400px;
  height: 250px;
  font-size: 0.8rem;
  box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.5);
  margin-bottom: 30px;
  & img {
    width: 25px;
    filter: brightness(0) invert(1);
  }
  & div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  & div:nth-child(2) {
    flex-direction: column;
    gap: 5px;
    & span:last-child {
      font-size: 1.1rem;
      letter-spacing: 5px;
    }
  }
  @media screen and (max-width: 1000px) {
    width: 300px;
    height: 200px;
    font-size: 0.7rem;
    & div:nth-child(2) {
      & span:last-child {
        font-size: 1rem;
        letter-spacing: 5px;
      }
    }
  }
`;

const AddBtn = styled.button`
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
