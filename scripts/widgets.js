// scripts/widgets.js

export const availableWidgets = [
  {
    id: "clock",
    title: "System Clock",
    content: `<div id="clock-widget"></div>`,
    update: () => {
      const el = document.getElementById("clock-widget");
      if (el) el.textContent = new Date().toLocaleTimeString();
    },
  },
  {
    id: "notes",
    title: "Notes",
    content: `<textarea id="notes-area" placeholder="Type your notes here..."></textarea>`,
  },
  {
    id: "quote",
    title: "Quote of the Moment",
    content: `<div id="quote-text">Loading...</div>`,
    update: () => {
      const el = document.getElementById("quote-text");
      if (el) {
        const quotes = [
          "Make something today that didn't exist yesterday.",
          "Stay curious.",
          "Hack the boredom, not the system.",
        ];
        el.textContent = quotes[Math.floor(Math.random() * quotes.length)];
      }
    },
  },
];

export function initWidgets() {
  const container = document.querySelector(".main");
  if (!container) return;

  availableWidgets.forEach((widget) => {
    const div = document.createElement("div");
    div.className = "widget";
    div.id = widget.id;
    div.innerHTML = `
      <div class="widget-title">${widget.title}</div>
      <div class="widget-content">${widget.content}</div>
    `;
    container.appendChild(div);

    if (widget.update) widget.update();
  });

  // Update periodically (for clock, etc.)
  setInterval(() => {
    availableWidgets.forEach((w) => w.update && w.update());
  }, 5000);
}
