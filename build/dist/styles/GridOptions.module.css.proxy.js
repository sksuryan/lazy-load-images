
export let code = "._container_1t9vy_1 {\r\n  display: flex;\r\n  flex-direction: column;\r\n\r\n  position: absolute;\r\n  bottom: 0;\r\n\r\n  width: calc(120px - 8px);\r\n  padding: 0.625rem 1rem;\r\n  margin: 4px;\r\n\r\n  background: linear-gradient(rgb(248, 247, 248), rgb(235, 228, 243));\r\n\r\n  border-radius: 1rem;\r\n\r\n  transition: all ease-in 0.4sec;\r\n  /* animation: scaleIn ease-in 0.4s forwards; */\r\n\r\n  z-index: 10;\r\n}\r\n\r\n._container_1t9vy_1 button {\r\n  background: none;\r\n  outline: none;\r\n  border: none;\r\n\r\n  font-family: 'Montserrat';\r\n  font-weight: 500;\r\n  font-size: 0.75rem;\r\n\r\n  margin: 0.5rem 0;\r\n\r\n  cursor: pointer;\r\n}\r\n\r\n@keyframes _scaleIn_1t9vy_1 {\r\n  0% {\r\n    width: 0%;\r\n    transform: scale(0);\r\n  }\r\n  100% {\r\n    width: calc(120px - 8px);\r\n    transform: scale(1);\r\n  }\r\n}\r\n";
let json = {"container":"_container_1t9vy_1","scaleIn":"_scaleIn_1t9vy_1"};
export default json;

// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';

  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}