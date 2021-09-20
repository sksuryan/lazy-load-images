
export let code = "._container_1uysy_1 {\r\n  position: relative;\r\n}\r\n\r\n._imageContainer_1uysy_9 {\r\n  width: 100%;\r\n  height: 80px;\r\n\r\n  transition: all 0.4s ease-in;\r\n\r\n  cursor: pointer;\r\n\r\n  border-radius: 1rem;\r\n  overflow: hidden;\r\n\r\n  background: rgb(237, 212, 248);\r\n  /* animation: blurIn ease-in 0.8s forwards; */\r\n}\r\n\r\n@media (min-width: 408px) {\r\n  ._imageContainer_1uysy_9 {\r\n    height: 120px;\r\n  }\r\n}\r\n\r\n._imageContainer_1uysy_9 canvas {\r\n  width: 100%;\r\n  height: 100%;\r\n\r\n  object-fit: cover;\r\n  pointer-events: none;\r\n\r\n  /* animation: blurIn ease-in 0.8s forwards; */\r\n}\r\n\r\n._container_1uysy_1:hover ._imageContainer_1uysy_9 {\r\n  filter: blur(2px) grayscale(1) !important;\r\n}\r\n\r\n@keyframes _blurIn_1uysy_1 {\r\n  0% {\r\n    filter: blur(4px);\r\n  }\r\n  100% {\r\n    filter: unset;\r\n  }\r\n}\r\n";
let json = {"container":"_container_1uysy_1","imageContainer":"_imageContainer_1uysy_9","blurIn":"_blurIn_1uysy_1"};
export default json;

// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';

  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}