import type { ProfileText } from "./base";

export const es: ProfileText = {
  role: "Fullstack Developer · UI/UX",
  location: "Remoto · LATAM",
  availability: "Respondo en menos de 24 h",
  lede: "¡Hey, hola! Qué bueno que pasaste por aquí.",
  bio: [
    "Soy desarrollador fullstack y diseñador UI/UX, y lo que más me emociona es crear cosas que la gente disfruta usar. Me encanta estar en todo el viaje: desde la primera charla con el usuario y el boceto en Figma hasta la base de datos, el deploy y ese momento en que las métricas gritan «¡funcionó!».",
    "Últimamente vivo entre la IA y el producto: integro modelos, armo agentes y diseño interfaces que hacen que todo eso se sienta simple. Brillo en equipos pequeños que se mueven rápido, escribo código que otros disfrutan leer y siempre tengo ganas de aprender algo nuevo. ¿Tienes una idea dando vueltas? Cuéntamela, que seguro la hacemos realidad.",
  ],
  facts: [
    { label: "Enfoque", value: "Producto de punta a punta" },
    { label: "Idiomas", value: "Español, inglés, portugués (intermedio)" },
    { label: "Modalidad", value: "Remoto, freelance o full-time" },
  ],
  experienceLede:
    "Experiencia en UI/UX, integraciones con inteligencia artificial y software AI‑native.",
  experience: {
    solvertic: {
      role: "AI Engineer",
      period: "2026 — presente",
      description:
        "En Solvertic construyo software para una universidad y para un sistema financiero. Trabajo sobre todo en backend, inteligencia artificial e infraestructura: microservicios en Java con Spring Boot, diseñados con arquitectura hexagonal, e integraciones de IA con Spring AI.",
      highlights: [
        "Microservicios en Java y Spring Boot con arquitectura hexagonal (puertos y adaptadores).",
        "Integración de modelos de IA en los servicios con Spring AI.",
        "Infraestructura y despliegue de los servicios de la universidad y del sistema financiero.",
      ],
      tags: [
        "Java",
        "Spring Boot",
        "Spring AI",
        "Arquitectura hexagonal",
        "Microservicios",
      ],
    },
    grazia: {
      role: "Desarrollador Fullstack · AI Engineer · UI/UX",
      period: "2025 — 2026",
      description:
        "Grazia es un creative board de video con IA: genera anuncios cinematográficos, influencers de IA fotorrealistas, contenido UGC y videos inmobiliarios en minutos, para equipos de marketing y e‑commerce. Mi rol cubre el producto de punta a punta: diseño la experiencia, construyo el frontend y el backend, e integro los modelos generativos en una plataforma AI‑native.",
      highlights: [
        "Diseño UI/UX de los flujos de generación de video, imagen, voz y audio.",
        "Integración de modelos de IA generativa: pipelines de generación, colas de trabajo y entrega de medios.",
        "Desarrollo fullstack de funcionalidades del producto, del diseño en Figma al deploy.",
      ],
      tags: ["Next.js", "TypeScript", "Supabase", "IA generativa", "UI/UX"],
    },
    freelance: {
      role: "Desarrollador web freelance",
      company: "Clientes independientes",
      period: "2024 — 2025",
      description:
        "Desarrollo a medida para negocios y emprendedores. Además de sitios web, construí software hecho a la medida: sistemas pensados para el proceso de cada cliente. Entiendo el problema, diseño la interfaz y entrego el producto funcionando.",
      highlights: [
        "Sistemas a medida para cada negocio: paneles de administración, automatizaciones e integraciones, no solo sitios web.",
      ],
    },
  },
  projects: {
    landed: {
      title: "Landed",
      tagline: "Alquilar casa en otro país sin haberla pisado.",
      description:
        "Pisos amueblados de 3 a 24 meses en Lisboa y Oporto para gente que se muda desde el extranjero: búsqueda, visita por video, documentos y contrato, todo online y en tres idiomas. El objetivo: pasar de 3 semanas a 5 días desde la primera consulta hasta el contrato.",
      role: "Producto, UX/UI, design system y desarrollo full-stack, de principio a fin",
      highlights: [
        "Búsqueda por minutos reales en transporte público hasta tu oficina o universidad, con mapa y lista sincronizados.",
        "Precio todo incluido y en tu moneda, con el tipo de cambio diario del BCE.",
        "Visitas por video en tu zona horaria, sin reservas dobles: Postgres lo impide con una exclusion constraint.",
        "Asistente con IA que usa datos reales: recomienda pisos que existen, consulta huecos libres y reserva la visita.",
        "Seguridad de producto: API propia, cookies httpOnly, CSRF y Row Level Security en todas las tablas.",
        "Demo pública con 5 roles, accesible (axe, WCAG 2.1 AA) y pensada primero para el móvil.",
      ],
      stats: [
        { value: "31", label: "Páginas" },
        { value: "44", label: "Endpoints de API" },
        { value: "62", label: "Pantallas en Figma" },
        { value: "3", label: "Idiomas" },
      ],
      note: "Proyecto de portafolio: las casas, personas y empresa de la demo son ficticias. Para probarla: Sign in → Try the demo.",
    },
  },
  stack: [
    {
      name: "Frontend",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "React Native",
      ],
    },
    {
      name: "Backend",
      items: [
        "Node.js",
        "NestJS",
        "PostgreSQL",
        "Prisma",
        "Redis",
        "REST / GraphQL",
      ],
    },
    {
      name: "Diseño",
      items: [
        "Figma",
        "Design systems",
        "Prototipado",
        "User research",
        "Accesibilidad",
      ],
    },
    {
      name: "Infra e IA",
      items: ["Docker", "Vercel", "AWS", "CI/CD", "APIs de LLM", "Agentes"],
    },
  ],
};
