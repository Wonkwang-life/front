import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as DOMPurify from "dompurify";

const Post = () => {
  const [content, setContent] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_APIADDRESS}/post/${id}`
        );
        console.log("API Response:", response.data); // 디버깅용
        if (response.data && response.data.content) {
          setContent(response.data.content.content);
        } else {
          console.error("예상치 못한 API 응답 구조");
        }
      } catch (error: any) {
        console.error("포스트 가져오는 중 오류 발생:", error);
      }
    };
    getPost();
  }, [id]);

  return (
    <>
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
    </>
  );
};

export default Post;
