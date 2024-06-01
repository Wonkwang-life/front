import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { confirm, successAlert, warningAlert } from "../../components/Alert";

const Post = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<[String] | null>(null);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_APIADDRESS}/post/${id}`
        );
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
  }, []);

  const handleDelete = async () => {
    const result = await confirm("정말 글을 삭제하시겠습니까?");
    if (!result.isConfirmed) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_APIADDRESS}/post/${id}`
      );
      const result = await successAlert("글 삭제가 완료되었습니다.");
      if (result.isConfirmed) navigate("/");
    } catch (error: any) {
      const result = await warningAlert(error.response.data.message);
      console.log(result);
    }
  };

  return (
    <Container>
      <Title>{title}</Title>
      <div>
        <Button onClick={(e) => navigate(`/post-fac?edit=${id}`)}>수정</Button>
        <Button onClick={handleDelete}>삭제</Button>
      </div>
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {images?.map((image: any, index) => (
        <img key={index} src={image} alt={"상품이미지"} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
`;

const Title = styled.div`
  font-size: 2rem;
`;

const Button = styled.button`
  background-color: white;
  border: 1px solid black;
`;
export default Post;
