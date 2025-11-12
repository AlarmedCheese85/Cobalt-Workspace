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


Current Project Root:
dashboard-app/
│
├── index.html                # Main entry point (loads the dashboard)
├── manifest.json             # PWA manifest (for installable web app support)
├── service-worker.js         # For offline use / caching (optional)
│
├── /assets/                  # Static assets (icons, logos, images)
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── /styles/                  # All CSS files
│   ├── main.css              # Global styles + layout
│   ├── theme.css             # Theme variables (colors, dark/light modes)
│   ├── widgets.css           # Styles for widgets / panels
│   └── animations.css        # Optional for slick transitions
│
├── /scripts/                 # All JS logic
│   ├── main.js               # Entry JS (loads dashboard, applies settings)
│   ├── ui.js                 # Handles UI components (menus, modals, resizing)
│   ├── widgets.js            # Logic for widgets (notes, timers, embeds, etc.)
│   ├── storage.js            # Saves user layout/customizations to localStorage
│   ├── settings.js           # Handles theme, layout presets, etc.
│   └── utils.js              # Small helper functions
│
├── /components/              # HTML components or templates
│   ├── widget-template.html  # Base widget structure
│   ├── navbar.html           # Top bar or side menu layout
│   └── modal.html            # For settings / customization pop-ups
│
└── /data/                    # Optional (user data, configs, sample presets)
    └── default-layout.json   # Default dashboard layout and widgets

