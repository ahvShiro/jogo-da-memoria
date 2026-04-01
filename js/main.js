import * as Theme from "./theme.js";

document.addEventListener("DOMContentLoaded", () => {

  Theme.initTheme();

  const btnTheme = document.getElementById("btnTheme")
  btnTheme.onclick = Theme.switchTheme;
  
});