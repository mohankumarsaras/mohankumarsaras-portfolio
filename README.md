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

## 🌐 Socials:
[![Bluesky](https://img.shields.io/badge/bluesky-0285FF?style=for-the-badge&logo=bluesky&logoColor=%23FFFFFF)](https://bsky.app/profile/mohankumarsaras) [![Discord](https://img.shields.io/badge/Discord-%237289DA.svg?logo=discord&logoColor=white)](https://discord.gg/YvxQxuujd) [![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://instagram.com/mohankumarsaras) [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://linkedin.com/in/mohankumarsaras) [![Medium](https://img.shields.io/badge/Medium-12100E?logo=medium&logoColor=white)](https://medium.com/@mohankumar.saraswathy) [![X](https://img.shields.io/badge/X-black.svg?logo=X&logoColor=white)](https://x.com/mohankumarsaras) [![Mastodon](https://img.shields.io/badge/-MASTODON-%232B90D9?logo=mastodon&logoColor=white)](https://mastodon.social/@mohankumarsaras) [![email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white)](mailto:mohankumar.saraswathy@gmail.com) 

# 💻 Tech Stack:
![Apache](https://img.shields.io/badge/apache-%23D42029.svg?style=for-the-badge&logo=apache&logoColor=white) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) ![Jenkins](https://img.shields.io/badge/jenkins-%232C5263.svg?style=for-the-badge&logo=jenkins&logoColor=white) ![AmazonDynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Canva](https://img.shields.io/badge/Canva-%2300C4CC.svg?style=for-the-badge&logo=Canva&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white) ![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)
# 📊 GitHub Stats:
![](https://github-readme-stats.shion.dev/api?username=mohankumarsaraswathy&theme=default&hide_border=false&include_all_commits=false&count_private=false)<br/>
![](https://streak-stats.demolab.com/?user=mohankumarsaraswathy&theme=default&hide_border=false)<br/>
![](https://github-readme-stats.shion.dev/api/top-langs/?username=mohankumarsaraswathy&theme=default&hide_border=false&include_all_commits=false&count_private=false&layout=compact)

---
[![](https://komarev.com/ghpvc/?username=mohankumarsaraswathy&icon=0&color=0)](https://visitcount.itsvg.in)

<!-- Proudly created with GPRM ( https://gprm.itsvg.in ) -->
