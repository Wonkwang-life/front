import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import styled from "styled-components";
import { successAlert, warningAlert } from "../../components/Alert";
import { useNavigate } from "react-router-dom";

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
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [isImageFixed, setIsImageFixed] = useState(false); //이미지를 수정했는지

  const inputRef = useRef(null);
  const quillRef = useRef(null);
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();

  useEffect(() => {
    const getEditData = async (id) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_APIADDRESS}/post/${id}`
        );

        if (response.data && response.data.content) {
          setTitle(response.data.content.title);
          setContent(response.data.content.content);
          let initialImageUrls = response.data.content.imageUrls;

          const initialFiles = initialImageUrls.map((url) => ({
            file: null,
            url,
          }));
          setSelectedFiles((prevFiles) => [...prevFiles, ...initialFiles]);
        }
      } catch (error: any) {
        const result = await warningAlert(error.response.data.message);
        navigate("/post-fac"); //수정이 아닌 그냥 글쓰기로 이동
        console.log(result);
      }
    };
    if (params.get("edit")) {
      getEditData(params.get("edit"));
    }
  }, []);

  //뒤로가기 방지
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
    console.log(e.target.files);
    setIsImageFixed(true);
    const files = Array.from(e.target.files).map((file: any) => ({
      file,
      url: null,
    }));
    setSelectedFiles((prevFiles: any) => [...prevFiles, ...files]);
  };

  const handleDelete = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const moveImage = (index, direction) => {
    setIsImageFixed(true);
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
    let imageUrls: any = []; //서버에 업로드할 imageUrl 배열
    let index = 0;

    for (const { file, url } of selectedFiles) {
      if (file) {
        //파일을 로컬에서 추가한 경우
        formData.append("file", file);
        imageUrls.push(index++); //우선 이미지 url 대신 index 값을 삽입 후 추후 대체함
      } else {
        imageUrls.push(url); // 수정 시 이미 업로드 된 이미지
      }
    }
    try {
      const formDataEntries = [...formData.entries()]; //로컬에서 추가한 이미지 갯수 확인을 위한 변수
      if (formDataEntries.length >= 1) {
        const fileUploadResponse = await axios.post(
          `${import.meta.env.VITE_SERVER_APIADDRESS}/post/image`, // 서버 측 업로드 엔드포인트에 전송
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const uploadedUrls = fileUploadResponse.data; // 서버로부터 받은 이미지 URL 리스트
        let uploadIndex = 0;

        // imageUrls 배열 중 index값을 서버에서 받은 image Url로 대체
        for (let i = 0; i < imageUrls.length; i++) {
          if (typeof imageUrls[i] === "number") {
            imageUrls[i] = uploadedUrls[uploadIndex++];
          }
        }
        //AWS에 이미지 업로드 완료 후 링크 반환된걸 imageUrls에 저장 성공 ---
      }

      const postData = {
        title: title,
        content: content,
        imageUrls: imageUrls, //게시글에 있는 이미지 urls들 최종 값 업로드
      };

      let response;
      if (!params.get("edit")) {
        //글 쓰기
        response = await axios.post(
          `${import.meta.env.VITE_SERVER_APIADDRESS}/post`,
          postData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        //글 수정
        response = await axios.patch(
          `${import.meta.env.VITE_SERVER_APIADDRESS}/post/${params.get(
            "edit"
          )}`,
          postData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const result = await successAlert(response.data.message);
      if (result.isConfirmed) navigate(`/post/${response.data.content}`);
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
        {selectedFiles.map(({ file, url }, index) => (
          <ImageContainer key={index}>
            <Image
              src={file ? URL.createObjectURL(file) : url}
              alt={`preview ${index}`}
            />
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
