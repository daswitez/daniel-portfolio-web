# Portfolio OS 🖥️

Hi! 👋 This is my personal portfolio: a little macOS-style desktop that lives in your browser.
Open folders, drag widgets around, play a song, ask the AI terminal about my work, or play a
round of **Clawd Run** in Safari. Below the desk there's a more playful side, with doodles that pop
up wherever you click (yes, mostly cats 🐱).

You're very welcome to look around the code and use it as a **reference or starting point** for
your own portfolio. Please just read the [license section](#-license--licencia--licença) first:
the code is free to reuse, but my personal content is not.

## ✨ What's inside

- **A desk you can explore**: draggable widgets, folders and app icons, plus windows you can
  move, maximize and close (Finder, Terminal and Safari).
- **AI terminal** (⌘ + K): answers questions about my experience using DeepSeek, streamed letter
  by letter. The API key stays on the server, with rate limiting to prevent abuse.
- **Safari with live sites** and a pixel-art endless runner starring Clawd, the Claude Code mascot.
- **An Apple Music–style player** with a real song.
- **The playground**: GSAP scroll animations, 3D tilt cards, a sketch-to-product reveal and a
  deck of cards you can throw.
- **Three languages** (English, Spanish, Portuguese), picked automatically from the visitor's
  browser.
- **Light and dark mode**, and respect for "reduce motion" settings.

## 🧰 Tech stack

[Next.js 16](https://nextjs.org) (App Router) · React 19 · TypeScript · CSS Modules ·
[GSAP](https://gsap.com) + ScrollTrigger · [Motion](https://motion.dev) · DeepSeek API ·
Supabase (rate-limit counters only)

## 🚀 Running it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values you need
npm run dev                  # http://localhost:3000
```

The site works without any keys. The terminal just falls back to simple local answers.
To enable the AI, set `DEEPSEEK_API_KEY` in `.env.local`. For production rate limiting, also set
the Supabase variables and run [`supabase/rate-limit.sql`](./supabase/rate-limit.sql) once in
your Supabase project. See [`.env.example`](./.env.example) for the full list.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## 🗂️ Where things live

```
src/
├─ app/[lang]/        pages per language (/en, /es, /pt)
├─ app/api/chat/      AI endpoint (server only: key, validation, rate limits)
├─ proxy.ts           sends visitors to their browser's language
├─ content/profile/   personal content (base data + text per language)
├─ i18n/              UI translations and language helpers
├─ lib/ai/            DeepSeek client, system prompt, limits, rate limiting
├─ components/
│  ├─ desktop/        the hero desk
│  ├─ widgets/        clock, calendar, music player, profile, status
│  ├─ windows/        window manager + Finder, Terminal, Safari (Clawd Run)
│  ├─ playground/     the playful sections below the desk
│  └─ layout/ ui/ icons/
└─ styles/tokens.css  design tokens (colors, shadows, easing)
```

**Using it as a template?** Replace everything in `src/content/profile/`, the text in
`src/i18n/dictionaries/`, and the images and audio in `public/` with your own (see the license
below for why that's required).

## 📄 License / Licencia / Licença

### 🇺🇸 English
The source code of this project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

**Personal Content Exclusion:** While you are free to use, modify, and distribute the code as a template or reference, all personal content—including my name, logo, biography, photographs, resume, project case studies, and **i18n translation files**—remains **All Rights Reserved** and may not be reused or redistributed without explicit permission.

---

### 🇪🇸 Español
El código fuente de este proyecto está bajo la **Licencia MIT** - consulta el archivo [LICENSE](./LICENSE) para más detalles.

**Exclusión de contenido personal:** Aunque tienes libertad para usar, modificar y distribuir el código como plantilla o referencia, todo el contenido personal —incluyendo mi nombre, logotipo, biografía, fotografías, currículum, casos de estudio y los **archivos de traducción (i18n)**— mantiene **Todos los Derechos Reservados** y no puede ser reutilizado ni redistribuido sin permiso explícito.

---

### 🇧🇷 Português
O código-fonte deste projeto está licenciado sob a **Licença MIT** - consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

**Exclusão de conteúdo pessoal:** Embora você seja livre para usar, modificar e distribuir o código como modelo ou referência, todo o conteúdo pessoal — incluindo meu nome, logotipo, biografia, fotografias, currículo, estudos de caso e os **arquivos de tradução (i18n)** — permanece com **Todos os Direitos Reservados** e não pode ser reutilizado ou redistribuído sem permissão explícita.

---

### 🎵 Third-party assets
Some assets belong to others and are not covered by the MIT License: the song *Feel The Rhythm*
and its cover art (in `public/music` and `public/img`) belong to Orion and Kharmatic, and Clawd,
the Claude Code mascot, belongs to Anthropic.

---

Made with ☕ and a lot of curiosity by **Daniel** ·
[LinkedIn](https://www.linkedin.com/in/daniel-mercado-subirana-448731318) ·
[danielmercadosubirana@gmail.com](mailto:danielmercadosubirana@gmail.com)
