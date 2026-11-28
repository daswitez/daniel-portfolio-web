import type { ProfileText } from "./base";

export const en: ProfileText = {
  role: "Fullstack Developer · UI/UX",
  location: "Remote · LATAM",
  availability: "I reply within 24 h",
  lede: "Hey there! So glad you stopped by.",
  bio: [
    "I’m a fullstack developer and UI/UX designer, and what gets me most excited is building things people genuinely enjoy using. I love being part of the whole ride: from the first chat with a user and the Figma sketch to the database, the deploy and that moment when the metrics shout “it worked!”.",
    "Lately I live where AI meets product: I integrate models, build agents and design interfaces that make all of it feel simple. I thrive in small teams that move fast, write code people actually enjoy reading, and I’m always up for learning something new. Got an idea spinning around? Tell me about it, and let’s make it real.",
  ],
  facts: [
    { label: "Focus", value: "End-to-end product" },
    {
      label: "Languages",
      value: "Spanish, English, Portuguese (intermediate)",
    },
    { label: "Work style", value: "Remote, freelance or full-time" },
  ],
  experienceLede:
    "Experienced in UI/UX, artificial intelligence integrations and AI‑native software.",
  experience: {
    solvertic: {
      role: "AI Engineer",
      period: "2026 — present",
      description:
        "At Solvertic I build software for a university and for a financial system. My work is mostly backend, artificial intelligence and infrastructure: Java microservices with Spring Boot, designed with hexagonal architecture, and AI integrations with Spring AI.",
      highlights: [
        "Java and Spring Boot microservices with hexagonal architecture (ports and adapters).",
        "AI models integrated into the services with Spring AI.",
        "Infrastructure and deployment for the university’s and the financial system’s services.",
      ],
    },
    grazia: {
      role: "Fullstack Developer · AI Engineer · UI/UX",
      period: "2025 — 2026",
      description:
        "Grazia is an AI video creative board: it generates cinematic ads, photorealistic AI influencers, UGC content and real estate videos in minutes, for marketing and e‑commerce teams. My role covers the product end to end: I design the experience, build the frontend and backend, and integrate the generative models into an AI‑native platform.",
      highlights: [
        "UI/UX design of the video, image, voice and audio generation flows.",
        "Generative AI model integration: generation pipelines, job queues and media delivery.",
        "Fullstack development of product features, from Figma design to deploy.",
      ],
    },
    freelance: {
      role: "Freelance web developer",
      company: "Independent clients",
      period: "2024 — 2025",
      description:
        "Custom development for businesses and entrepreneurs. Beyond websites, I built tailored software: systems shaped around each client’s own process. I understand the problem, design the interface and deliver a working product.",
      highlights: [
        "Tailored systems for each business: admin dashboards, automations and integrations, not just websites.",
      ],
    },
  },
  projects: {
    landed: {
      title: "Landed",
      tagline: "Rent a home abroad before you've ever set foot in it.",
      description:
        "Furnished homes for 3 to 24 months in Lisbon and Porto for people moving from abroad: search, video viewing, documents and lease, all online and in three languages. The goal: go from 3 weeks to 5 days between first enquiry and signed lease.",
      role: "Product, UX/UI, design system and full-stack development, end to end",
      highlights: [
        "Search by real public-transit minutes to your office or university, with a synced map and list.",
        "All-inclusive pricing shown in your own currency, using the ECB's daily exchange rate.",
        "Video viewings in your time zone with no double bookings: Postgres prevents them with an exclusion constraint.",
        "An AI assistant grounded in real data: it recommends homes that exist, checks open slots and books the viewing.",
        "Real product security: its own API, httpOnly cookies, CSRF checks and Row Level Security on every table.",
        "Public demo with 5 roles, accessible (axe, WCAG 2.1 AA) and designed mobile-first.",
      ],
      stats: [
        { value: "31", label: "Pages" },
        { value: "44", label: "API endpoints" },
        { value: "62", label: "Screens in Figma" },
        { value: "3", label: "Languages" },
      ],
      note: "Portfolio project: the homes, people and company in the demo are fictional. To try it: Sign in → Try the demo.",
    },
    tuvoz: {
      title: "Tu Voz",
      tagline: "Sell by talking: inventory and sales with an AI agent.",
      description:
        "Inventory and sales management for small merchants, with an AI agent that understands both text and voice. Instead of hunting for products and filling in forms with a queue at the counter, the seller says “sold two 50 m rolls of fabric” and the agent drafts the sale for them to confirm.",
      role: "Product, UX/UI and full-stack development, including the real-time voice AI",
      highlights: [
        "Real-time voice sales with Gemini Live: live transcription and spoken replies.",
        "An agent with 12 tools over real data: it finds products even when the name is said wrong, records sales, stock arrivals and transfers between branches, voids sales, creates products and flags low stock.",
        "Nothing is saved without confirmation: the agent proposes, the person confirms by voice or with a button.",
        "Stock only changes through SQL functions that log every movement, so manual and voice sales share exactly the same logic.",
        "Teams with roles (owner, admin, employee), branches and invites by code or QR, enforced with Row Level Security.",
        "Products with QR codes, decimal units (metres, rolls, kg) and a dashboard with charts by period.",
      ],
      stats: [
        { value: "12", label: "Agent tools" },
        { value: "3", label: "Roles with permissions" },
        { value: "2", label: "Modes: text and voice" },
        { value: "6", label: "SQL migrations" },
      ],
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
      name: "Design",
      items: [
        "Figma",
        "Design systems",
        "Prototyping",
        "User research",
        "Accessibility",
      ],
    },
    {
      name: "Infra & AI",
      items: ["Docker", "Vercel", "AWS", "CI/CD", "LLM APIs", "Agents"],
    },
  ],
};
