// scripts/storage.js

export function saveLayout() {
  const widgets = Array.from(document.querySelectorAll(".widget")).map((w) => ({
    id: w.id,
    top: w.style.top,
    left: w.style.left,
  }));

  localStorage.setItem("retro_layout", JSON.stringify(widgets));

  const notes = document.getElementById("notes-area")?.value || "";
  localStorage.setItem("retro_notes", notes);
}

export function restoreLayout() {
  const saved = JSON.parse(localStorage.getItem("retro_layout") || "[]");
  saved.forEach((pos) => {
    const el = document.getElementById(pos.id);
    if (el) {
      el.style.position = "absolute";
      el.style.top = pos.top;
      el.style.left = pos.left;
    }
  });

  const notes = localStorage.getItem("retro_notes");
  if (notes && document.getElementById("notes-area")) {
    document.getElementById("notes-area").value = notes;
  }
}
