export function initTheme() {
  const theme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", theme);
}

export function switchTheme() {
  const newTheme = localStorage.getItem("theme") === "light" ? "dark" : "light";  
  localStorage.setItem("theme", newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);
}
