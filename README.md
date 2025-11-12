# Cobalt-Workspace

==================================

# Cobalt Workspace — Starter

Slick, modular personal dashboard that runs entirely on GitHub Pages.

## Features
- Draggable & resizable widgets
- Notes (markdown-style textarea), To-Do, Clock with Pomodoro
- Theme toggle, import/export layout (JSON)
- Everything stored in `localStorage` (no backend)

## How to use
1. Create a new GitHub repo and push these files.
2. In repo Settings → Pages, select the `main` branch `/ (root)` (or `gh-pages`), save.
3. Visit `https://<username>.github.io/<repo>` after a minute.

## Add widgets
Click **Add** in the top bar. Widgets are registered by the JS files in `js/widgets`.

## Customize / Extend
- Add widgets by creating `js/widgets/<name>.js` and calling `window.Nebula.registerWidget(widget)`.
- Each widget needs `id`, `name`, `defaultConfig`, `defaultSettings`, and `render(container, settings)`.

## Notes
- No external build tools required. Use modern browsers supporting ES modules.
- Layout is saved to `localStorage` under key `nebula:v1`.

Enjoy — tweak visuals and widgets however you like.



🚀 Roadmap
Phase	Goals

v0.1	Base UI, drag-drop layout, persistent positions.

v0.2	Add Notes, To-Do, Clock widgets.

v0.3	Add Theme customizer + Quick Links.

v0.4	Command palette + import/export.

v1.0	Full polish (animations, responsive design, shareable themes).
