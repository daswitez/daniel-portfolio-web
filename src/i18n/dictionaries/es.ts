/** Spanish UI strings. This file is the source of truth for the dictionary shape. */
export const es = {
  meta: {
    title: "{name} · Desarrollador Fullstack y Diseñador UI/UX",
    description:
      "Portafolio de {name}, desarrollador fullstack y diseñador UI/UX. Construyo productos con IA, agentes e interfaces con Next.js, TypeScript y Supabase. Disponible para trabajo remoto.",  },
  menubar: {
    available: "Disponible",
    language: "Idioma",
    changeLanguage: "Cambiar idioma",
    themeToLight: "Cambiar a modo claro",
    themeToDark: "Cambiar a modo oscuro",
  },
  play: {
    hint: "Psst… haz clic en cualquier parte.",
    count: "{count} garabatos",
    milestones: [
      "¡Eso es! Sigue, sigue.",
      "Ok, está claro que te gusta jugar.",
      "Imagina lo que haríamos con un proyecto de verdad.",
      "Ya eres oficialmente parte del equipo.",
    ],
    hello: {
      marquee: ["Diseño", "Código", "IA", "Producto", "Café", "Ideas"],
      bubble: "¡Ey! Pasa, pasa.",
      title: "Ahora, la parte divertida.",
      body: "Arriba está el escritorio serio. Aquí te cuento, sin corbata, qué puedo hacer por ti y por qué te va a gustar trabajar conmigo.",
      photoAlt: "Daniel, en modo sticker",
    },
    offer: {
      eyebrow: "Lo que ofrezco",
      title: "Tres cosas que hago muy bien.",
      gets: "Te llevas",
      items: {
        interfaces: {
          title: "Interfaces que se sienten bien",
          body: "Diseño y construyo productos que la gente entiende a la primera y disfruta usar.",
          gets: ["Flujos claros", "Design systems", "Microinteracciones"],
        },
        ai: {
          title: "IA que trabaja de verdad",
          body: "Integro modelos y agentes donde realmente mueven la aguja, no solo para decir que hay IA.",
          gets: ["Agentes y RAG", "Generación de medios", "Automatizaciones"],
        },
        backend: {
          title: "Backend que aguanta",
          body: "Arquitectura limpia, APIs sólidas e infraestructura lista para crecer sin sustos.",
          gets: ["Microservicios", "APIs", "Deploy y monitoreo"],
        },
      },
    },
    process: {
      eyebrow: "Cómo trabajo",
      title: "Del boceto al producto.",
      body: "Así llevo cada proyecto: de una idea en papel a algo que la gente usa todos los días.",
      handle: "Arrastra para comparar boceto y producto",
      scrollHint: "Sigue bajando para construirlo",
      before: "Boceto",
      after: "Producto",
      progress: "Paso {n} de {total}",
      steps: [
        {
          title: "Entiendo el problema",
          body: "Hablo con usuarios y con el negocio, mapeo los flujos y defino qué significa tener éxito.",
          deliverables: ["Entrevistas", "Mapa de flujos", "Métricas de éxito"],
        },
        {
          title: "Diseño la solución",
          body: "Wireframes, prototipo y design system: cada pantalla con su porqué.",
          deliverables: ["Wireframes", "Prototipo en Figma", "Design system"],
        },
        {
          title: "La construyo",
          body: "Frontend, backend e IA conectados, con datos reales desde el primer día.",
          deliverables: ["Next.js + TypeScript", "APIs", "Integración de IA"],
        },
        {
          title: "La lanzo y la mido",
          body: "Deploy, analítica y mejoras continuas según lo que dicen los datos.",
          deliverables: ["Deploy", "Analítica", "Iteración"],
        },
      ],
      callouts: [
        "Arquitectura de información",
        "Componentes y medidas exactas",
        "Datos reales en vivo",
        "IA conectada y medida",
      ],
    },
    why: {
      eyebrow: "Por qué yo",
      title: "Cinco razones. Lánzalas.",
      body: "Agarra la tarjeta de arriba y tírala a un lado, o usa el botón.",
      next: "Otra razón",
      counter: "{n} de {total}",
      reasons: [
        {
          title: "Hablo diseño y código",
          body: "Nada se pierde entre el diseño y el código: hago las dos cosas.",
        },
        {
          title: "IA desde el primer día",
          body: "Sé cuándo la IA suma y cuándo es humo, y la pongo donde de verdad importa.",
        },
        {
          title: "Pienso en producto",
          body: "Me importa la métrica que se mueve, no solo la tarea que se cierra.",
        },
        {
          title: "Rápido, sin atajos",
          body: "Entrego seguido, con código que otra persona puede leer mañana.",
        },
        {
          title: "Tres idiomas, buena onda",
          body: "Español, inglés y portugués. Y la buena energía viene incluida.",
        },
      ],
    },
    contact: {
      eyebrow: "Contacto",
      title: "¿Hacemos algo juntos?",
      body: "Escríbeme tu idea, por loca que sea. Respondo rápido y con ganas.",
      cta: "Escríbeme",
    },
  },
  /** Dock labels, keyed by section id (see DOCK_ITEMS). */
  nav: {
    label: "Secciones",
    home: "Inicio",
    hi: "Hola",
    offer: "Ofrezco",
    process: "Proceso",
    "why-me": "Por qué yo",
    contact: "Contacto",
  },
  /** Desktop folder names, keyed by folder id. */
  folders: {
    experience: "Experiencia",
    projects: "Proyectos",
    stack: "Tecnologías",
    about: "Sobre mí",
    contact: "Contacto",
  },
  hero: {
    greeting: "Hola, soy {name}.",
    tagline: "Construyo productos completos.",
    body: "Abre una carpeta, pregúntale a la terminal o juega un rato en Safari.",
    cta: "Ver experiencia",
    askTerminal: "Pregúntale a mi IA en la terminal ›",
    shortcutHint:
      "Presiona {keys} para abrir la terminal desde cualquier parte.",
  },
  desktop: {
    folders: "Carpetas",
    apps: "Aplicaciones",
    widgets: "Widgets",
    figmaFile: "Portfolio.fig",
    figmaOpen: "Abrir el diseño de este portafolio en Figma (nueva pestaña)",
    appNames: {
      files: "Archivos",
      terminal: "Terminal",
      safari: "Safari",
      notes: "Notas",
      mail: "Mail",
      code: "Código",
    },
  },
  widgets: {
    clock: "Reloj",
    clockCity: "NUEVA YORK",
    calendar: "Calendario",
    weekdays: ["L", "M", "X", "J", "V", "S", "D"],
    nowPlaying: "Reproductor de música",
    nowPlayingTitle: "Feel The Rhythm",
    nowPlayingSubtitle: "Orion, Kharmatic",
    seek: "Progreso de la canción",
    previous: "Anterior",
    next: "Siguiente",
    play: "Reproducir",
    pause: "Pausar",
    available: "Disponible",
    location: "Ubicación",
  },
  content: {
    featured: "Destacado",
    technologies: "Tecnologías",
    openInSafari: "Abrir en Safari",
    openSiteInSafari: "Abrir {site} en Safari",
    copyEmail: "Copiar correo",
    copied: "¡Copiado!",
    askTerminal: "Preguntarle a mi IA",
  },
  footer: "Diseñado y construido a mano.",
  window: {
    close: "Cerrar",
    minimize: "Minimizar",
    zoom: "Ampliar",
    restore: "Restaurar",
  },
  finder: {
    favorites: "Favoritos",
    desktop: "Escritorio",
  },
  safari: {
    back: "Atrás",
    forward: "Adelante",
    reload: "Recargar",
    favorites: "Favoritos",
    tabs: "Pestañas",
    closeTab: "Cerrar pestaña {title}",
    previewNote:
      "Vista previa de {site}. El sitio no permite mostrarse dentro de otra página.",
    openSite: "Abrir {site} ↗",
    screenshotAlt: "Captura de {site}",
  },
  game: {
    canvas: "Juego Clawd Run",
    title: "Clawd Run",
    controls: {
      jump: "Saltar · doble en el aire",
      duck: "Agacharse",
      pause: "Pausa",
    },
    legend: {
      bug: "Písalo",
      token: "Puntos y combos",
      coffee: "Escudo",
      moth: "Agáchate",
    },
    play: "Jugar",
    playAgain: "Jugar otra vez",
    resume: "Continuar",
    paused: "Pausa",
    gameOver: "¡Bug encontrado!",
    newBest: "¡Nuevo récord!",
    result: "Puntaje {score} · ✦ {tokens} · récord {best}",
    score: "Puntaje",
    best: "Récord",
    shield: "Escudo",
    shieldLost: "¡Salvado!",
    duck: "Agacharse",
  },
  terminal: {
    user: "visitante",
    inputLabel: "Comando",
    welcome:
      "portfolio-shell con IA. Pregunta lo que quieras sobre Daniel, o escribe {help}.",
    commandsHeading: "Comandos:",
    /** [command to show, description]. Every command listed must exist in commands.tsx. */
    help: [
      ["whoami", "quién soy"],
      ["experiencia", "dónde he trabajado"],
      ["proyectos", "lo que he construido"],
      ["stack", "tecnologías"],
      ["contacto", "cómo escribirme"],
    ],
    openHelp: "abre experiencia, proyectos, safari…",
    askNatural: "O pregunta en lenguaje natural: ",
    example: "¿has trabajado con React Native?",
    openNotFound: "open: no encuentro “{target}”. Prueba {ls}.",
    opening: "abriendo…",
    sudoGranted: "✓ permiso concedido.",
    sudoGrantedRest: "Escríbeme a {email} y lo hablamos.",
    sudoDenied:
      "{user} no está en el archivo sudoers. Este incidente será reportado.",
    thinking: "pensando…",
    localMode: "(modo local)",
    wait: "espera a que termine la respuesta anterior…",
    rateLimited:
      "Hiciste muchas preguntas seguidas. Espera unos minutos o escríbeme a {email}.",
  },
  assistant: {
    techYes:
      "Sí: {list} es parte de mi stack. Puedes ver dónde lo usé con “experiencia” o “proyectos”.",
    job: "{period}: {role} en {company}",
    contact: "Escríbeme a {email}. {availability}.",
    fallback:
      "No tengo esa respuesta a mano. Escribe “help” o pregúntame directamente en {email}.",
  },
};

export type Dictionary = typeof es;
