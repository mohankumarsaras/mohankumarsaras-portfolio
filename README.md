# Terminal Portfolio

A personal portfolio site styled as a Linux terminal, built with React + Vite.
Designed for an AWS DevOps Engineer profile, but the content layer is fully
data-driven so it's easy to retarget.

## Quick start

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
```

## Project structure

```
terminal-portfolio/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                 # React entry point
    ├── App.jsx                  # Top-level component, just renders <Terminal />
    ├── components/
    │   ├── Terminal.jsx         # Core terminal UI: history, input, prompt
    │   ├── OutputLine.jsx       # Renders one line of output, auto-linkifies URLs/emails
    │   └── BootMessage.jsx      # Static welcome message shown on load
    ├── data/
    │   ├── profile.js           # <-- YOUR CONTENT GOES HERE
    │   └── commands.js          # Command registry: maps command name -> output
    ├── hooks/
    │   └── useCommandHistory.js # Up/down arrow command recall
    └── styles/
        └── terminal.css         # Monochrome terminal theme (all visual styling)
```

## Filling in your details

Everything personal lives in **`src/data/profile.js`**. Open it and replace
every `[PLACEHOLDER]` using your LinkedIn profile
(https://www.linkedin.com/in/mohankumarsaras/) as your reference:

- `name`, `title`, `location`, `email`, `phone`, `linkedin`, `github`
- `summary` / `tagline` — from your LinkedIn "About" section
- `skills` — grouped by category, matching your LinkedIn "Skills" section
- `experience` — one entry per role from LinkedIn "Experience"
- `projects` — your portfolio/side projects
- `certifications` — from LinkedIn "Licenses & Certifications"
- `education` — from LinkedIn "Education"

You do **not** need to touch any component file to update content — the
components just render whatever is in `profile.js`.

> Note: this project does not scrape or auto-fetch your LinkedIn profile.
> LinkedIn's terms of service restrict automated scraping, and profile
> markup changes often enough that a scraper would break unpredictably.
> Copying details over by hand also lets you word them for a portfolio
> audience rather than verbatim LinkedIn phrasing.

## Adding or changing terminal commands

Open **`src/data/commands.js`**. Each command is an entry in
`commandRegistry`:

```js
mycommand: {
  description: "Shown in the `help` output",
  handler: (args) => [
    { text: "Some output line" },
    { text: "A dimmed line", variant: "dim" },
  ],
},
```

Handlers return an array of `{ text, variant }` objects
(`variant` is one of `default`, `dim`, `accent`, `error`, `heading`), or
`{ clear: true }` to clear the screen (used by the `clear` command).

Built-in commands: `help`, `about`, `whoami`, `skills`, `experience`,
`projects`, `certifications`, `education`, `contact`, `ls`, `cat`, `clear`.

## Customizing the look

All visual styling — colors, font, spacing, terminal window chrome — lives
in `src/styles/terminal.css`, controlled mostly through CSS variables at the
top of the file:

```css
:root {
  --term-bg: #0c0e0c;        /* background */
  --term-fg: #c7f9cc;        /* default text */
  --term-fg-bright: #eaffea; /* command text / headings */
  --term-accent: #5fd97a;    /* section titles, prompt */
  --term-error: #ff6b6b;
}
```

Swap these to retheme (e.g. amber-on-black) without touching any component.

## Responsiveness

Layout breakpoints are handled in the `@media` blocks at the bottom of
`terminal.css`. The terminal window scales to a max width of 900px on
desktop and adapts font size / padding / key-value grid layout down to
phone-sized screens.

## Deploying

This is a static Vite build — `npm run build` outputs a `dist/` folder you
can deploy to GitHub Pages, Netlify, Vercel, or an S3 + CloudFront setup
(fitting, for an AWS DevOps portfolio).
