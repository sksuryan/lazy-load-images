
export let code = "._main_18t0y_1 {\r\n  display: grid;\r\n}\r\n\r\n._main_18t0y_1 input {\r\n  margin: 0 auto;\r\n  margin-top: 10px;\r\n}\r\n";
let json = {"main":"_main_18t0y_1"};
export default json;

// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';

  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}