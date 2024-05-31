import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import styled from "styled-components";
import { Confirm, successAlert, warningAlert } from "../../components/Alert";

const Size = Quill.import("formats/size");
Size.whitelist = ["small", "medium", "large", "huge"];
Quill.register(Size, true);

const formats = [
  "font",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "align",
  "color",
  "background",
  "size",
  "h1",
  "image",
];

const PostFactory = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  const inputRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Backspace" && !isTitleFocused && !isEditorFocused) {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTitleFocused, isEditorFocused]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (value) => {
    try {
      setContent(value);
    } catch (error) {
      console.error("Error updating editor content:", error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleDelete = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const fileUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const fileUploadResponse = await axios.post(
        "http://localhost:8080/api/posts/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fileUrls.push(fileUploadResponse.data);
    }

    const postData = {
      title: title,
      content: content,
      //fileUrls: fileUrls,
      fileUrls: ["http://11", "http://22", "http://33"],
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_APIADDRESS}/post`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await successAlert(response.data.message);
      console.log(response.data);
    } catch (error) {
      await warningAlert(error.response.data.message);
    }
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ size: ["small", false, "large", "huge"] }],
          [{ align: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [
            {
              color: [],
            },
            { background: [] },
          ],
          ["image"],
        ],
      },
    };
  }, []);

  return (
    <Container>
      <Label>제품명</Label>
      <Input
        ref={inputRef}
        type="text"
        value={title}
        onChange={handleTitleChange}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
      />
      <Label>제품 상세내용</Label>
      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={handleContentChange}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        modules={modules}
        formats={formats}
      />
      <Input type="file" multiple onChange={handleFileChange} />
      <ImagePreview>
        {selectedFiles.map((file, index) => (
          <ImageContainer key={index}>
            <Image src={URL.createObjectURL(file)} alt={`preview ${index}`} />
            <DeleteButton onClick={() => handleDelete(index)}>
              삭제
            </DeleteButton>
          </ImageContainer>
        ))}
      </ImagePreview>
      <button onClick={handleSubmit}>Submit</button>
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

const Label = styled.div`
  font-size: 1.2rem;
  margin-bottom: -10px;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px;
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const Image = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 1px solid #ddd;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`;

export default PostFactory;
