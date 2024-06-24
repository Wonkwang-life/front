import ReactDOM from "react-dom/client";
import "./index.css";
import { RecoilRoot } from "recoil";
import App from "./App";
import React from "react";

const rootElement = document.getElementById("root")!;
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </React.StrictMode>
  );
} else {
  console.error(
    "Root element not found. Make sure 'root' element exists in your HTML file."
  );
}
