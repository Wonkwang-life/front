import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { warningAlert } from "../../components/Alert";

const Post = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<[String] | null>(null);
  const { id } = useParams();

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

  return (
    <Container>
      <Title>{title}</Title>
      {/* <div
        style={{
          width: "60vw",
          whiteSpace: "normal",
        }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(String(content)),
        }}
      /> */}
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {images?.map((image: any) => (
        <img src={image} alt={"상품이미지"} />
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
export default Post;
