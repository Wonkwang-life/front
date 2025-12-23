import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import {
  confirm,
  errorAlert,
  successAlert,
  warningAlert,
} from "../../components/Alert";
import api from "../../api";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import "react-quill/dist/quill.snow.css";

interface PostData {
  title: string;
  content: string;
  oneLineIntroduce: string;
  storeLink: string;
  productType: string;
  packingUnit: string;
  tag: string;
  hit: number;
  howEat: string;
}

const Post = () => {
  const [postData, setPostData] = useState<PostData | null>(null);
  const [images, setImages] = useState<[string] | null>(null);
  const [isDeleteing, setIsDeleteing] = useState(false);
  const { id } = useParams();
  const user = useRecoilValue(userState);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("id", id);
    const getPost = async () => {
      try {
        const response = await api.get(`/post/${id}`);
        // console.log("API Response:", response.data); // 디버깅용
        if (response.data && response.data.content) {
          setPostData(response.data.content);
          setImages(response.data.content.imageUrls);
        } else {
          console.error("예상치 못한 API 응답 구조");
        }
      } catch (error: any) {
        const result = await warningAlert(error.response.data.message);
        navigate("/product");
      }
    };
    getPost();

    window.scrollTo({
      top: 0, // 헤더 높이까지 고려해서 연산
      behavior: "smooth",
    });
  }, []);

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${postData?.title}`,
          text: `${postData?.oneLineIntroduce}`,
          url: url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        successAlert("URL이 클립보드에 복사되었습니다.");
      } catch (error) {
        console.error("클립보드 복사 실패:", error);

        // 일부 브라우저에서는 execCommand를 사용해 클립보드에 복사하는 대체 방법
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          successAlert("URL이 클립보드에 복사되었습니다.");
        } catch (err) {
          errorAlert("클립보드 복사에 실패했습니다. 수동으로 복사해주세요.");
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const handleDelete = async () => {
    if (isDeleteing) return; //삭제중이면 리턴

    const result = await confirm("정말 글을 삭제하시겠습니까?");
    if (!result.isConfirmed) return;

    setIsDeleteing(true);
    try {
      await api.delete(`/post/${id}`);
      successAlert("글 삭제가 완료되었습니다.");
      navigate("/product");
    } catch (error: any) {
      setIsDeleteing(false);
      await errorAlert(
        error.response?.data?.message || "글 삭제에 실패했습니다."
      );
    }
  };

  return (
    <Container>
      <PostForm>
        {user && (
          <AdminContainer>
            <Button onClick={(e) => navigate(`/write?edit=${id}`)}>수정</Button>
            <Button onClick={handleDelete} disabled={isDeleteing}>
              {!isDeleteing ? "삭제" : "삭제 중..."}
            </Button>
            {/* <div>조회수 : {postData?.hit}</div> */}
          </AdminContainer>
        )}
        <TopContainer>
          {images && <img src={images[0]} alt="대표이미지" />}
          <TopContent>
            <Title>{postData?.title}</Title>
            <Introduce>
              <div>{postData?.oneLineIntroduce}</div>
            </Introduce>
            <Detail>
              <div>제품유형</div>
              <div>{postData?.productType}</div>
            </Detail>
            <Detail>
              <div>포장단위</div>
              <div>{postData?.packingUnit}</div>
            </Detail>
            <Detail>
              <div>섭취방법</div>
              <div>{postData?.howEat}</div>
            </Detail>
            {postData?.storeLink && (
              <Detail>
                <div>구매채널</div>
                <div>네이버스토어</div>
              </Detail>
            )}

            <Tag>
              <div>{postData?.tag}</div>
            </Tag>
            <ButtonContainer>
              {/* {postData?.storeLink && (
                <Button
                  style={{ background: "#13b65c" }}
                  href={postData?.storeLink}
                  target="_blank"
                >
                  구매하기
                </Button>
              )} */}
              <Button
                style={{ background: "var(--base-color)" }}
                onClick={() => handleShare()}
              >
                공유하기
              </Button>
              {(postData?.title === "원바디톡스" ||
                postData?.title === "원광침향원" ||
                postData?.title === "원광 AE 플러스") && (
                <Button style={{ background: "var(--base-color)" }}>
                  <a href="http://wonnature.co.kr" target="_blank">
                    판매처
                  </a>
                </Button>
              )}
            </ButtonContainer>
          </TopContent>
        </TopContainer>
        <Hr />
        <Content
          dangerouslySetInnerHTML={{ __html: postData?.content as string }}
          className="ql-editor"
        />
        {images?.map(
          (image: any, index) =>
            index !== 0 && <Image key={index} src={image} alt={"상품이미지"} />
        )}
        <ButtonContainer>
          <Button onClick={() => navigate("/product")}>목록으로</Button>
        </ButtonContainer>
      </PostForm>
    </Container>
  );
};

const centeredFlex = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  ${centeredFlex}
  width: 100%;
  min-height: 100vh;
  padding: 20px;

  @media screen and (max-width: 450px) {
    padding: 10px;
  }
`;

const PostForm = styled.div`
  ${centeredFlex}
  align-items: flex-start;
  width: 100%;
  max-width: 1000px;
  padding: 40px 30px;
  gap: 20px;

  @media screen and (max-width: 500px) {
    padding: 40px 10px;
  }
`;

const TopContainer = styled.div`
  ${centeredFlex}
  width: 100%;
  height: auto;
  flex-flow: row nowrap;
  align-items: center;
  gap: 60px;

  & img {
    width: 50%;
    height: 100%; // 추가된 부분
    object-fit: cover; // 이미지 비율을 유지하면서 요소를 채우도록 설정
    border-radius: 8px;
  }

  @media screen and (max-width: 1000px) {
    flex-flow: column;

    & img {
      width: 100%;
    }
  }
`;

const TopContent = styled.div`
  ${centeredFlex}
  width: 50%;
  height: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;

  @media screen and (max-width: 1000px) {
    width: 95%;
  }

  @media screen and (max-width: 500px) {
    width: 90%;
  }
`;

const Detail = styled.div`
  display: flex;
  font-size: 1.1rem;
  color: rgba(0, 0, 0, 0.7);
  width: 100%;
  & :nth-child(1) {
    width: 100px;
  }

  & :nth-child(2) {
    width: calc(100% - 130px);
    white-space: wrap;
  }

  @media screen and (max-width: 450px) {
    width: 100%;
    font-size: 1rem;
    & :nth-child(1) {
      width: 100px;
    }
    & :nth-child(2) {
      width: 100%;
    }
  }
`;

const Tag = styled.div`
  margin-top: 20px;
  word-spacing: 15px;
  color: var(--base-color);
  font-size: 0.9rem;

  @media screen and (max-width: 450px) {
    word-spacing: 10px;
  }
`;

const Title = styled.div`
  font-size: 1.7rem;
  font-weight: 600;
  color: #333333;
`;

const Introduce = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  text-align: left;
  color: #333333;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  ${centeredFlex}
  width: 100%;
  flex-direction: row;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  width: 100%;
  height: 50px;
  background-color: var(--base-color);
  color: #ffffff;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.3s;
  border-radius: 10px;

  &:hover {
    filter: brightness(80%);
  }

  &:nth-child(2) {
    background-color: ${(props) => (!props.disabled ? "tomato" : "gray")};
  }

  & a {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const Content = styled.div`
  width: 100%;
  min-height: auto;
  line-height: 1.5;
  color: #555555;
  padding: 0;
`;

const Image = styled.img`
  width: 100%;
  max-width: 100%;
  margin-top: -20px;
`;

const NaverBtn = styled.a`
  padding: 10px 30px;
  background-color: #03c75a;
  font-weight: bolder;
  font-size: 1.1rem;
  color: white !important;
  align-self: flex-start;
`;

const Hr = styled.hr`
  width: 100%;
  color: #808080aa;
  margin: 30px auto;
`;

const AdminContainer = styled.div`
  display: flex;
  width: 30%;
  min-width: 350px;
  padding: 10px 0;
  flex-flow: row nowrap;
  align-items: center;
  gap: 12px;
  margin-left: auto;

  & div {
    width: 300px;
  }

  @media screen and (max-width: 1000px) {
    width: 100%;
  }
`;

export default Post;
