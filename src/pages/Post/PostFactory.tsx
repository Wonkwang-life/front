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

  const moveImage = (index, direction) => {
    const newFiles = [...selectedFiles];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    [newFiles[index], newFiles[targetIndex]] = [
      newFiles[targetIndex],
      newFiles[index],
    ];
    setSelectedFiles(newFiles);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append("file", file); // 'file' 필드에 여러 파일을 추가
    }

    try {
      const fileUploadResponse = await axios.post(
        `${import.meta.env.VITE_SERVER_APIADDRESS}/post/image`, // 서버 측 업로드 엔드포인트에 전송
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fileUrls = fileUploadResponse.data;

      const postData = {
        title: title,
        content: content,
        fileUrls: fileUrls,
      };

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
      <FileInputLabel htmlFor="file-upload">파일 선택</FileInputLabel>
      <FileInput
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <ImagePreview>
        {selectedFiles.map((file, index) => (
          <ImageContainer key={index}>
            <Image src={URL.createObjectURL(file)} alt={`preview ${index}`} />
            <ButtonContainer>
              <ArrowButton
                onClick={() => moveImage(index, "up")}
                disabled={index === 0}
              >
                ◀
              </ArrowButton>
              <ArrowButton
                onClick={() => moveImage(index, "down")}
                disabled={index === selectedFiles.length - 1}
              >
                ▶
              </ArrowButton>
            </ButtonContainer>
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

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  font-size: 16px;
`;

const FileInput = styled.input`
  display: none;
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
  width: 250px;
  height: 250px;
  object-fit: cover;
  border: 1px solid #ddd;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  gap: 5px;
  margin: 10px;
`;

const ArrowButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
  padding: 15px;
  &:disabled {
    background: rgba(0, 0, 0, 0.2);
    cursor: not-allowed;
  }
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
