import * as Theme from "./theme.js";
import * as Game from "./game.js";

document.addEventListener("DOMContentLoaded", () => {

  Theme.initTheme();
  Game.start();

  const btnTheme = document.getElementById("btnTheme")
  btnTheme.onclick = Theme.switchTheme;

  const btnRestart = document.getElementById("btnRestart");
  btnRestart.onclick = Game.start;
});