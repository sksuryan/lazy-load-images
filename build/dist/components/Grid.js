import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import GridItem from "./GridItem.js";
import styles from "../styles/Grid.module.css.proxy.js";
import LazyLoad from "../../_snowpack/pkg/react-lazyload.js";
const Grid = ({images}) => {
  console.log(images);
  return /* @__PURE__ */ React.createElement("div", {
    className: styles.container
  }, images.map((src) => /* @__PURE__ */ React.createElement(LazyLoad, {
    key: src.name,
    height: 120,
    offset: 80,
    once: true
  }, /* @__PURE__ */ React.createElement(GridItem, {
    src
  }))));
};
export default Grid;
