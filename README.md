# 🚀 Portfolio Next.js

> **Disclaimer**
> This is a portfolio I originally coded at the very beginning of my web development journey.
> The code was later refactored to replace MongoDB with JSON configuration files.
> It’s quite old, so it’s not representative of my current coding skills, but it’s kept here for learning purposes and is **beginner-friendly**.

A modern, customizable portfolio built with Next.js, fully configurable via JSON files.

## ✨ Features

* 🎨 Modern, responsive design
* ⚙️ Centralized configuration via JSON files
* 🔧 SEO-optimized with customizable metadata
* 📱 Mobile & desktop friendly
* 🌟 Customizable console ASCII art
* 📡 Built-in API for dynamic configuration

## 🛠️ Installation

**Requirements**

* Node.js ≥ 16
* npm or yarn

**Setup**

```bash
git clone https://github.com/samymih/portfolio-template.git
cd portfolio-template
npm install   # or yarn install
npm run dev   # or yarn dev
```

Your portfolio will be available at [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

All configuration is done via JSON files in the `config/` folder:

* **general.json** – Social links, contact info, navbar/hero
* **aboutItems.json** – Structure of the “About” section
* **about.json** – Detailed content of the “About” section
* **projects.json** – Your projects, categories, and images

SEO settings (title, URL, description, OG/Twitter images, etc.) are in `pages/_app.jsx`.

## 📁 File Structure

```
config/
  general.json
  aboutItems.json
  about.json
  projects.json
pages/
  _app.jsx
  api/general.js
public/images/   # Project images
```

## 🎨 Customization

* **Theme color:** Change `themeColor` in SEO config
* **Section colors:** Edit `aboutItems.json`
* **Project colors & icons:** Defined in `projects.json`
* **Console ASCII art:** Edit `utils/ascii.js` and `console.ascii.style` in SEO config

## 🚀 Deployment

**Recommended:** Deploy on [Vercel](https://vercel.com/) — detects Next.js automatically.

Other platforms:

```bash
npm run build
npm start
```

## 🔧 Scripts

```bash
npm run dev     # Dev mode
npm run build   # Production build
npm start       # Run production
npm run lint    # ESLint check
```

## 🆘 Troubleshooting

* Check all JSON files are valid and correctly filled
* Make sure project images exist in `public/images/`
* Open browser console (F12) for error logs

## 📝 License

MIT License — see `LICENSE`.

## 🤝 Contributing

Fork, branch, commit, push, and open a PR.

---

⭐ **If this project helps you, consider giving it a star!**
