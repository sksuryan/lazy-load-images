import React, {useEffect, useRef, useState} from "../../_snowpack/pkg/react.js";
import loadImage from "../../_snowpack/pkg/blueimp-load-image.js";
import styles from "../styles/GridItem.module.css.proxy.js";
import GridOptions from "./GridOptions.js";
const GridItem = ({src}) => {
  const ImageContainerRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  useEffect(() => {
    loadImage(src, {
      canvas: true,
      maxWidth: 120,
      maxHeight: 120,
      cover: true
    }).then((data) => {
      ImageContainerRef.current.append(data.image);
    });
  }, []);
  return /* @__PURE__ */ React.createElement("div", {
    className: styles.container,
    onMouseEnter: () => {
      setShowOptions(true);
    },
    onMouseLeave: () => {
      setShowOptions(false);
    }
  }, /* @__PURE__ */ React.createElement("div", {
    className: styles.imageContainer,
    ref: ImageContainerRef,
    onContextMenu: (e) => {
      e.preventDefault();
    }
  }), showOptions && /* @__PURE__ */ React.createElement(GridOptions, null));
};
export default GridItem;
