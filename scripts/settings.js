// scripts/settings.js

export async function loadSettings() {
  const theme = localStorage.getItem("retro_theme") || "green";
  document.body.setAttribute("data-theme", theme);
}

export function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("retro_theme", theme);
}
