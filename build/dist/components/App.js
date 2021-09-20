import React, {useState} from "../../_snowpack/pkg/react.js";
import styles from "../styles/App.module.css.proxy.js";
import Grid from "./Grid.js";
const App = () => {
  const [images, setImages] = useState([]);
  return /* @__PURE__ */ React.createElement("div", {
    className: styles.main
  }, /* @__PURE__ */ React.createElement("input", {
    type: "file",
    multiple: true,
    onChange: (e) => {
      setImages([...e.target.files]);
    }
  }), /* @__PURE__ */ React.createElement(Grid, {
    images
  }));
};
export default App;
