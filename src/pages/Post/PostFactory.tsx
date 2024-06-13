import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import { successAlert, warningAlert } from "../../components/Alert";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";

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
];

const PostFactory = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [storeLink, setStoreLink] = useState("");
  const [productType, setProductType] = useState("");
  const [packingUnit, setPackingUnit] = useState("");
  const [oneLineIntroduce, setOneLineIntroduce] = useState("");
  const [howEat, setHowEat] = useState("");
  const [tag, setTag] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const user = useRecoilValue(userState);
  const [userCheck, setUserCheck] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef(null);
  const quillRef = useRef(null);
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();

  //글 수정 기능
  useEffect(() => {
    const getEditData = async (id) => {
      try {
        const response = await api.get(`/post/${id}`);

        if (response.data && response.data.content) {
          const {
            title,
            content,
            storeLink,
            imageUrls,
            productType,
            packingUnit,
            oneLineIntroduce,
            tag,
            howEat,
          } = response.data.content;
          setTitle(title);
          setContent(content);
          setStoreLink(storeLink);
          setProductType(productType);
          setPackingUnit(packingUnit);
          setOneLineIntroduce(oneLineIntroduce);
          setHowEat(howEat);
          setTag(tag);
          let initialImageUrls = imageUrls;

          const initialFiles = initialImageUrls.map((url) => ({
            file: null,
            url,
          }));
          setSelectedFiles((prevFiles) => [...prevFiles, ...initialFiles]);
        }
      } catch (error: any) {
        const result = await warningAlert(error.response.data.message);
        navigate("/write"); //수정이 아닌 그냥 글쓰기로 이동
        console.log(result);
      }
    };
    if (params.get("edit")) {
      getEditData(params.get("edit"));
    }

    checkUser();
  }, []);

  useEffect(() => {
    if (userCheck) loginCheck();
    else setUserCheck(true);
    console.log("usercheck: ", user);
  }, [user]);

  const checkUser = async () => {
    try {
      const response = await api.get(`/user/check`, {
        // skipInterceptor: true,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const loginCheck = async () => {
    if (user === null) {
      warningAlert("관리자 로그인을 해주세요.");
      navigate("/login");
    }
  };

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

  const handleContentChange = (value) => {
    try {
      setContent(value);
    } catch (error) {
      console.error("Error updating editor content:", error);
    }
  };

  const handleFileChange = (e) => {
    console.log(e.target.files);
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
    if (isUploading) return;
    //업로드 중이면 리턴
    setIsUploading(true);

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
        const fileUploadResponse = await api.post(
          `/post/image`, // 서버 측 업로드 엔드포인트에 전송
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const uploadedUrls = fileUploadResponse.data.content; // 서버로부터 받은 이미지 URL 리스트
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
        storeLink: storeLink,
        oneLineIntroduce,
        productType,
        packingUnit,
        howEat,
        tag,
      };

      let response;
      if (!params.get("edit")) {
        //글 쓰기
        response = await api.post(`/post`, postData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        //글 수정
        response = await api.patch(`/post/${params.get("edit")}`, postData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      setIsUploading(false); //업로드 상태를 마침
      successAlert(response.data.message);
      navigate(`/product/${response.data.content}`);
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
          ["bold", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [
            {
              color: [],
            },
            { background: [] },
          ],
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
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
      />
      <Label>제품 한줄 소개</Label>
      <Input
        ref={inputRef}
        type="text"
        value={oneLineIntroduce}
        placeholder="ex) 비타민A가 함유된 건강기능식품입니다."
        onChange={(e) => setOneLineIntroduce(e.target.value)}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
      />
      <Label>제품 유형</Label>
      <Input
        ref={inputRef}
        type="text"
        value={productType}
        placeholder="ex) 비타민"
        onChange={(e) => setProductType(e.target.value)}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
      />
      <Label>포장 단위</Label>
      <Input
        ref={inputRef}
        type="text"
        value={packingUnit}
        placeholder="ex) 500mg"
        onChange={(e) => setPackingUnit(e.target.value)}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
      />
      <Label>섭취 방법</Label>
      <Input
        ref={inputRef}
        type="text"
        value={howEat}
        placeholder="ex) 1일 1회 섭취"
        onChange={(e) => setHowEat(e.target.value)}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
      />
      <Label>태그</Label>
      <Input
        ref={inputRef}
        type="text"
        value={tag}
        placeholder="ex) #비타민A #홍삼"
        onChange={(e) => setTag(e.target.value)}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
        style={{ wordSpacing: "15px" }}
      />
      <Label>스토어 링크</Label>
      <Input
        ref={inputRef}
        type="text"
        value={storeLink}
        placeholder="ex) https://smartstore.naver.com/wonnature/products/xxxxx"
        onChange={(e) => setStoreLink(e.target.value)}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
      />
      <Label>제품 상세내용</Label>
      <ReactQuill //스타일은 index.css에서 수정
        ref={quillRef}
        value={content}
        onChange={handleContentChange}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        modules={modules}
        formats={formats}
      />
      <FileInputLabel htmlFor="file-upload">
        이미지 추가 (첫번째 이미지가 대표 이미지)
      </FileInputLabel>
      <FileInput
        id="file-upload"
        type="file"
        accept="image/*"
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
      <ConfirmBtn onClick={handleSubmit} disabled={isUploading}>
        {isUploading
          ? "업로드 중..."
          : params.get("edit")
          ? "제품 수정"
          : "제품 등록"}
      </ConfirmBtn>
    </Container>
  );
};

const Container = styled.div`
  width: 90%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
  margin: 0 auto;
`;

const Label = styled.div`
  font-size: 1.3rem;
  margin-top: 10px;
  margin-bottom: -15px;
  font-weight: 600;
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
  background-color: #18e66a;
  color: white;
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.3s;

  &:hover {
    background-color: #18c75e !important;
  }
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
  width: calc(50% - 5px);
  position: relative;

  @media screen and (max-width: 550px) {
    width: calc(100%);
  }
`;

const Image = styled.img`
  width: 100%;
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

const ConfirmBtn = styled.button`
  padding: 8px 0%;
  border-radius: 5px;
  border: 0px;
  background-color: ${(props) => (!props.disabled ? "#007bff" : "gray")};
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  transition: all 0.3s;

  &:hover {
    background-color: #1b6cc2 !important;
  }
`;

export default PostFactory;
