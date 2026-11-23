# Portfolio OS

Portafolio con forma de escritorio de Mac (Next.js 16 · App Router · TypeScript · CSS Modules).
Migrado desde `Portfolio OS.html` (que se conserva como referencia del diseño original).

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Dónde está cada cosa

```
src/
├─ app/                     layout (fuentes, metadata, script de tema), page, globals.css
├─ content/profile.ts       ← TUS DATOS. Todo el texto del sitio sale de aquí
├─ config/navigation.ts     carpetas, ítems del dock, tamaños de ventana, breakpoint
├─ types/                   Profile, WindowKind, OpenTarget…
├─ styles/tokens.css        tokens de diseño (colores light/dark, sombras, easing, fuentes)
├─ lib/                     storage seguro, texto, tema, assistant (respuestas de la terminal)
├─ hooks/                   useNow (reloj compartido, sin hydration mismatch), useActiveSection
└─ components/
   ├─ ui/                   primitivos: Button, TagList, StatusDot
   ├─ icons/                SVGs como componentes
   ├─ layout/               MenuBar, ThemeToggle, Dock, Footer
   ├─ desktop/              Desktop (hero), Hero, DesktopIcons, AppLauncher
   ├─ widgets/              Reloj, Calendario, Now Playing (WebAudio), Perfil, Estado
   ├─ content/              bloques compartidos por el Finder y las secciones de la página
   ├─ sections/             PageSection
   └─ windows/              gestor de ventanas + Finder, Terminal, Safari (juego Bug Squash)
```

## Decisiones

- **Server Components por defecto**; `"use client"` solo donde hay estado o APIs del navegador
  (ventanas, widgets con reloj, dock, toggle de tema, botones). La página se prerenderiza estática.
- **Gestor de ventanas** (`components/windows/WindowManager.tsx`): `useReducer` + dos contextos
  (estado y acciones separados para que los botones no se re-rendericen al mover ventanas).
  Abrir algo desde cualquier sitio: `useWindowActions().open({ kind: "finder", folder: "proyectos" })`.
- **Arrastre sin re-renders**: durante el drag se escriben variables CSS directamente; el estado
  se actualiza una vez al soltar.
- **Ventanas con code-splitting** (`next/dynamic`): el JS de la terminal y del juego solo se descarga al abrirlas.
- **Animaciones por frame** (visualizador, juego) mediante refs + `requestAnimationFrame`, nunca con estado de React.
- **Tema sin parpadeo**: script inline en `<head>` que fija `data-theme` antes del primer paint.
- **Terminal con IA**: `lib/assistant/index.ts` es el punto único para conectar un backend
  (p. ej. un route handler con la API de Claude). Hoy responde en modo local por palabras clave.
