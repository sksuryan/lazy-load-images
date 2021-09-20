
export let code = "._container_1uez2_1 {\r\n  display: grid;\r\n  gap: 1rem;\r\n\r\n  margin: 2rem auto;\r\n}\r\n\r\n@media (min-width: 0px) {\r\n  ._container_1uez2_1 {\r\n    width: calc(80px * 3 + 1rem * 2);\r\n    grid-template-columns: repeat(auto-fit, 80px);\r\n  }\r\n}\r\n\r\n@media (min-width: 408px) {\r\n  ._container_1uez2_1 {\r\n    grid-template-columns: repeat(auto-fit, 120px);\r\n    width: calc(120px * 3 + 1rem * 2);\r\n  }\r\n}\r\n\r\n@media (min-width: 544px) {\r\n  ._container_1uez2_1 {\r\n    width: calc(120px * 4 + 1rem * 3);\r\n  }\r\n}\r\n\r\n@media (min-width: 680px) {\r\n  ._container_1uez2_1 {\r\n    width: calc(120px * 5 + 1rem * 4);\r\n  }\r\n}\r\n";
let json = {"container":"_container_1uez2_1"};
export default json;

// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';

  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}