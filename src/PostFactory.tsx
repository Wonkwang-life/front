// src/Editor.js
import React, { useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const PostFactory = () => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
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
      content: content,
      fileUrls: fileUrls,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/post",
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
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
        ],
      },
    };
  }, []);

  return (
    <div>
      <ReactQuill
        value={content}
        onChange={handleContentChange}
        modules={modules}
        formats={formats}
      />
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

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
export default PostFactory;
