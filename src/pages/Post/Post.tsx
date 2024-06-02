import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import { confirm, successAlert, warningAlert } from "../../components/Alert";
import api from "../../api";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";

const Post = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<[String] | null>(null);
  const { id } = useParams();
  const user = useRecoilValue(userState);

  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await api.get(`/post/${id}`);
        console.log("API Response:", response.data); // 디버깅용
        if (response.data && response.data.content) {
          setTitle(response.data.content.title);
          setContent(response.data.content.content);
          setImages(response.data.content.imageUrls);
        } else {
          console.error("예상치 못한 API 응답 구조");
        }
      } catch (error: any) {
        const result = await warningAlert(error.response.data.message);
        console.log(result);
      }
    };
    getPost();

    setTimeout(() => {
      console.log(user);
    }, 2000);
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleDelete = async () => {
    const result = await confirm("정말 글을 삭제하시겠습니까?");
    if (!result.isConfirmed) return;
    try {
      const response = await api.delete(`/post/${id}`);
      const result = await successAlert("글 삭제가 완료되었습니다.");
      if (result.isConfirmed) navigate("/");
    } catch (error: any) {
      const result = await warningAlert(error.response.data.message);
      console.log(result);
    }
  };

  return (
    <Container>
      <PostForm>
        <Title>{title}</Title>
        {user && (
          <ButtonContainer>
            <Button onClick={(e) => navigate(`/post-fac?edit=${id}`)}>
              수정
            </Button>
            <Button onClick={handleDelete}>삭제</Button>
          </ButtonContainer>
        )}
        <Content dangerouslySetInnerHTML={{ __html: content }} />
        {images?.map((image: any, index) => (
          <Image key={index} src={image} alt={"상품이미지"} />
        ))}
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
  background-color: #f0f4f8;
  padding: 20px;
`;

const PostForm = styled.div`
  ${centeredFlex}
  align-items: flex-start;
  width: 100%;
  max-width: 600px;
  padding: 40px 30px;
  border: solid #ccd1d9 1px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  gap: 20px;
`;

const Title = styled.h1`
  width: 100%;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  color: #333333;
`;

const ButtonContainer = styled.div`
  ${centeredFlex}
  flex-direction: row;
  gap: 10px;
`;

const Button = styled.button`
  width: 100px;
  height: 40px;
  background-color: #0288d1;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0277bd;
  }
`;

const Content = styled.div`
  width: 100%;
  font-size: 1rem;
  line-height: 1.5;
  color: #555555;
`;

const Image = styled.img`
  width: 100%;
  max-width: 100%;
  border-radius: 8px;
  margin-top: 20px;
`;

export default Post;
