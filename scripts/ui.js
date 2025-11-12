// scripts/ui.js
import { saveLayout } from "./storage.js";

export function initUI() {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("hidden");
      saveLayout(); // store preference
    });
  }

  // Optional: draggable widgets
  makeWidgetsDraggable();
}

function makeWidgetsDraggable() {
  const widgets = document.querySelectorAll(".widget");
  let active = null, offsetX, offsetY;

  widgets.forEach((widget) => {
    widget.addEventListener("mousedown", (e) => {
      active = widget;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      widget.style.position = "absolute";
      widget.style.zIndex = 1000;
    });

    document.addEventListener("mousemove", (e) => {
      if (!active) return;
      active.style.left = e.pageX - offsetX + "px";
      active.style.top = e.pageY - offsetY + "px";
    });

    document.addEventListener("mouseup", () => {
      if (active) {
        active.style.zIndex = 1;
        saveLayout();
        active = null;
      }
    });
  });
}
