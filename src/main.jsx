import "../polyfills";
// https://github.com/xmtp/xmtp-js/issues/487
import React from "react";
import ReactDOM from "react-dom/client";
import { Wrapper } from "./wrapper";
import "./styles/index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import Error from "./app/error";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Wrapper />
    {/* <Error /> */}
  </React.StrictMode>
);
